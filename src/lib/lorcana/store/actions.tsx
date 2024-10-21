import useGameStore from ".";
import { executeBotAction } from "../bot";
import {
    Action,
    Card,
    Effect,
    Event,
    GameState,
    Player,
    TriggeredCardAbility,
    UserInitiatedCardAbility,
    UserInitiatedInteractiveCardAbility,
    Zone,
} from "../types/game";
import {
    applyModifiers,
    canPlayCard,
    canQuestCard,
    drawCard,
    findPotentialTargets,
    isAbility,
    isCard,
    isEffectAbility,
    isInputAbility,
} from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PLAYER_ACTIONS: Record<Action, (...ags: any) => void> = {
    play: choosePlayCard,
    draw: chooseDrawCard,
    quest: chooseQuest,
    challenge: chooseChallenge,
    discard: () => console.log("Discarding"),
    sing: chooseSing,
    ink: chooseInkCard,
    ability: chooseAbility,
    end_game: () => console.log("Ending game"),
    pass: choosePass,
    cancel: chooseCancel,
};

function choosePlayCard() {
    useGameStore.setState(
        gameState => {
            const player = gameState.players[gameState.currentPlayer];

            // Filter the playable cards based on available ink
            const playableCards = player.hand.filter(
                card => card.cost <= player.availableInk
            );

            // Set the input stage for selecting a card to play
            gameState.inputStage = {
                prompt: "Select a card to play:",
                options: playableCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (!isCard(targetCard)) {
                                console.error("No valid target for playing.");
                                return gameState;
                            }

                            gameState.inputStage = null;

                            const newGameState = moveCardToZoneReturnState(
                                gameState,
                                "hand",
                                "field",
                                targetCard
                            );

                            // decrease player available ink
                            newGameState.players = newGameState.players.map(
                                p => {
                                    if (p.id === player.id) {
                                        p.availableInk -= targetCard.cost;
                                    }
                                    return p;
                                }
                            );

                            const resolvedGameState = checkTriggers(
                                newGameState,
                                "play",
                                targetCard
                            );

                            return { ...resolvedGameState };
                        },
                        false,
                        { type: `PLAY CARD` }
                    );
                },
            };

            return { ...gameState };
        },
        false,
        { type: `INITIATE PLAY CARD` }
    );
}

function chooseDrawCard(numCards: number, playerId: string) {
    useGameStore.setState(
        gameState => {
            const newGameState = drawCard(gameState, numCards, playerId);

            gameState.turnFlags.draw = true;

            return { ...newGameState };
        },
        false,
        { type: `DRAW ${numCards} CARDs` }
    );
}

function chooseQuest() {
    useGameStore.setState(
        gameState => {
            const player = gameState.players[gameState.currentPlayer];
            const questableCards = player.field.filter(canQuestCard);

            gameState.inputStage = {
                prompt: "Select a card to quest:",
                options: questableCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (!isCard(targetCard)) {
                                console.error("No valid target for quest.");
                                return gameState;
                            }
                            const newGameState = questCard(
                                gameState,
                                targetCard
                            );

                            return { ...newGameState };
                        },
                        false,
                        { type: `QUEST CARD` }
                    );
                },
            };

            return { ...gameState };
        },
        false,
        { type: `INITIATE QUEST CARD` }
    );
}

function chooseChallenge() {
    useGameStore.setState(
        gameState => {
            const player = gameState.players[gameState.currentPlayer];
            const challengeableCards = player.field.filter(
                card => card.type === "character" && !card.exerted
            );

            gameState.inputStage = {
                prompt: "Select a card to challenge:",
                options: challengeableCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (!isCard(targetCard)) {
                                console.error("No valid target for attack.");
                                return gameState;
                            }

                            const newGameState = processChallenge(
                                gameState,
                                targetCard
                            );

                            return { ...newGameState };
                        },
                        false,
                        { type: `CHALLENGE CARD` }
                    );
                },
            };

            return { ...gameState };
        },
        false,
        { type: `INITIATE CHALLENGE CARD` }
    );
}

function chooseAbility() {
    useGameStore.setState(
        gameState => {
            const player = gameState.players[gameState.currentPlayer];
            const abilityCards = player.field.filter(card =>
                card.abilities
                    .filter(a => a.type === "user-initiated")
                    .some(a => a.actionCheck(gameState, card))
            );
            const actionCards = player.hand.filter(card =>
                card.abilities
                    .filter(a => a.type === "user-initiated")
                    .some(a => a.actionCheck(gameState, card))
            );

            gameState.inputStage = {
                prompt: "Select a card to exert:",
                options: [...abilityCards, ...actionCards],
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (!isCard(targetCard)) {
                                console.error("No valid target for attack.");
                                return gameState;
                            }

                            const abilities = targetCard.abilities.filter(
                                ability => ability.type === "user-initiated"
                            );

                            if (abilities.length == 0) {
                                console.error("No ability found.");
                                return gameState;
                            }

                            return {
                                ...promptAbilities(gameState, targetCard),
                            };
                        },
                        false,
                        { type: `ABILITY CARD` }
                    );
                },
            };

            return { ...gameState };
        },
        false,
        { type: `INITIATE ABILITY CARD` }
    );
}
function chooseSing() {
    // TODO: Implement
}

function chooseInkCard() {
    useGameStore.setState(
        gameState => {
            const player = gameState.players[gameState.currentPlayer];
            const inkableCards = player.hand.filter(
                card => card.inkwell && card.zone === "hand"
            );

            gameState.inputStage = {
                prompt: "Select a card to ink:",
                options: inkableCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (!isCard(targetCard)) {
                                console.error("No valid target for attack.");
                                return gameState;
                            }

                            const newGameState = inkCard(gameState, targetCard);

                            return { ...newGameState };
                        },
                        false,
                        { type: `INK CARD` }
                    );
                },
            };

            gameState.turnFlags.ink = true;

            return { ...gameState };
        },
        false,
        { type: `INITIATE INK CARD` }
    );
}

function chooseCancel() {
    useGameStore.setState(
        gameState => {
            gameState.inputStage = null;
            return { ...gameState };
        },
        false,
        { type: `CANCEL ACTION` }
    );
}

function choosePass() {
    useGameStore.setState(
        gameState => {
            gameState.inputStage = null;
            gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
            gameState.attacker = gameState.players[gameState.currentPlayer].id;
            gameState.defender =
                gameState.players[gameState.currentPlayer === 0 ? 1 : 0].id;
            gameState.turn += 1;
            gameState.players = gameState.players.map(p => {
                if (p.id === gameState.attacker) {
                    p.availableInk = p.inkwell.length;
                    p.field = p.field.map(card => {
                        card.exerted = false;
                        return card;
                    });

                    gameState = drawCard(gameState, 1, p.id);
                }
                return p;
            });
            gameState.phase = "start_phase";

            if (!gameState.players[gameState.currentPlayer].isHuman) {
                setTimeout(() => {
                    executeBotAction();
                }, 1000);
            }

            gameState.turnFlags = {
                ink: false,
                play: false,
                ability: false,
                challenge: false,
                draw: false,
            };

            checkTriggers(gameState, "start_phase", null);

            return { ...gameState };
        },
        false,
        { type: `PASS ACTION` }
    );
}

function promptAbilities(gameState: GameState, card: Card) {
    const abilities = card.abilities.filter(
        ability => ability.type === "user-initiated"
    );

    const filteredAbilities = abilities.filter(ability =>
        ability.actionCheck(gameState, card)
    );

    gameState.inputStage = {
        prompt: "Select an ability to use:",
        options: filteredAbilities,
        showDialogue: true,
        callback: selectedOption => {
            useGameStore.setState(
                gameState => {
                    if (!selectedOption || !isInputAbility(selectedOption)) {
                        console.error("No valid option selected.");
                        return gameState;
                    }

                    return processInput(gameState, card, selectedOption);
                },
                false,
                { type: `MULTIPLE ABILITIES` }
            );
        },
    };

    return { ...gameState };
}

// ACTION PROCESSOR __________________________________________________________
function processInput(
    gameState: GameState,
    card: Card,
    ability: UserInitiatedCardAbility | TriggeredCardAbility
): GameState {
    if (!ability) {
        console.error("No ability found.");
        return gameState;
    }

    // Handle multi-part inputs
    if (isInputAbility(ability) && "multiPart" in ability) {
        handleMultiPartInput(
            gameState,
            ability.multiPart,
            ability.callback,
            card
        );
        return gameState;
    }

    if (isEffectAbility(ability)) {
        return applyEffect(gameState, ability.effect, card);
    }

    const filteredOptions = filterOptions(gameState, ability.options);

    if (filteredOptions.length === 0) {
        console.error("No valid options for selection.");
        return { ...gameState, inputStage: null };
    }

    const inputStage: GameState["inputStage"] = {
        prompt: ability.prompt || "Select an option",
        options: filteredOptions,
        showDialogue: ability.showDialog,
        callback: selectedOption => {
            useGameStore.setState(
                gameState => {
                    if (!isCard(selectedOption)) {
                        console.error("Invalid option selected.");
                        return gameState;
                    }
                    
                    return ability.callback
                        ? ability.callback(gameState, selectedOption, card)
                        : gameState;
                },
                false,
                { type: `RESOLVED ACTION` }
            );
        },
    };

    return { ...gameState, inputStage };
}

function handleMultiPartInput(
    gameState: GameState,
    multiPart: UserInitiatedInteractiveCardAbility["multiPart"],
    finalCallback: (
        gameState: GameState,
        selectedOption: Card | null,
        card: Card
    ) => GameState,
    card: Card
): GameState {
    if (!multiPart) {
        console.error("No multi-part input found.");
        return gameState;
    }
    const steps = multiPart.steps;
    let stepIndex = gameState.inputStage?.stepIndex || 0;
    const currentGameState = { ...gameState };

    // Process a single step and update the state with the next input stage
    function processStep(currentGameState: GameState): GameState {
        if (stepIndex >= steps.length) {
            // All steps are done, execute the final callback
            return finalCallback(currentGameState, null, card);
        }

        const currentStep = steps[stepIndex];
        const filteredOptions = filterOptions(
            currentGameState,
            currentStep.options
        );

        // Set the next input stage for the current step
        useGameStore.setState(
            {
                inputStage: {
                    prompt: currentStep.prompt,
                    options: filteredOptions,
                    stepIndex, // Track the current step
                    callback: selectedOption => {
                        useGameStore.setState(
                            state => {
                                if (!isCard(selectedOption)) {
                                    console.error("Invalid option selected.");
                                    return state;
                                }
                                // Apply the effect for the current step
                                const updatedGameState = applyEffect(
                                    state,
                                    currentStep.effect,
                                    selectedOption
                                );

                                stepIndex++; // Move to the next step

                                // Continue processing the next step or finalize
                                return processStep(updatedGameState);
                            },
                            false,
                            { type: `RESOLVED STEP ${stepIndex + 1}` }
                        );
                    },
                },
            },
            false,
            { type: `INITIATE MULTI-PART ACTION STEP ${stepIndex + 1}` }
        );

        return currentGameState;
    }

    // Start processing the first step and return the final game state
    return processStep(currentGameState);
}

function processChallenge(gameState: GameState, thisCard: Card) {
    if (thisCard.exerted) {
        console.error(`${thisCard.name} is exerted, cannot attack.`);
        return gameState;
    }

    const potentialTargets = findPotentialTargets(gameState, thisCard);

    gameState.inputStage = {
        prompt: "Select a target to challenge:",
        options: potentialTargets,
        callback: targetCard => {
            useGameStore.setState(
                state => {
                    if (
                        typeof targetCard !== "object" ||
                        !("willpower" in targetCard)
                    ) {
                        console.error("No valid target for challenge.");
                        return state;
                    }

                    state.inputStage = null; // SET NULL HERE INCASE TRIGGERS ADD NEW INPUT STAGE

                    state = checkTriggers(state, "challenge", targetCard);

                    // Apply modifiers to the strength and willpower stats before calculating damage
                    const thisCardStrengthModifier = applyModifiers(
                        thisCard,
                        "challenge",
                        "strength"
                    );
                    const thisCardResistModifier = applyModifiers(
                        thisCard,
                        "challenge",
                        "resist"
                    );
                    const thisCardWillpowerModifier = applyModifiers(
                        thisCard,
                        "challenge",
                        "willpower"
                    );

                    const targetCardWillpowerModifier = applyModifiers(
                        targetCard,
                        "challenged",
                        "willpower"
                    );
                    const targetCardResistModifier = applyModifiers(
                        targetCard,
                        "challenged",
                        "resist"
                    );
                    const targetCardStrengthModifier = applyModifiers(
                        targetCard,
                        "challenged",
                        "strength"
                    );

                    // Calculate the damage dealt
                    const damageDealt =
                        targetCardStrengthModifier +
                        targetCardResistModifier -
                        (thisCard.willpower + thisCardWillpowerModifier);

                    // Calculate the damage received
                    const damageReceived =
                        thisCardStrengthModifier +
                        thisCardResistModifier -
                        (targetCard.willpower + targetCardWillpowerModifier);

                    // Apply the damage to the cards
                    thisCard.strengthModifier += damageReceived;
                    targetCard.strengthModifier += damageDealt;

                    // Log the combat result
                    state.debugLogs.push({
                        type: "Combat",
                        attacker: thisCard,
                        defender: targetCard,
                    });
                    console.info("Combat", damageReceived, damageDealt);

                    thisCard.exerted = true;

                    // Remove defeated cards
                    if (
                        targetCard.strength + targetCard.strengthModifier <=
                        0
                    ) {
                        state.players = moveToDiscard(state, targetCard);
                    }
                    if (thisCard.strength + thisCard.strengthModifier <= 0) {
                        state.players = moveToDiscard(state, thisCard);
                    }

                    state.inputStage = null;

                    return { ...state };
                },
                false,
                { type: "challenge", card: thisCard }
            );
        },
    };
    return gameState;
}

// HELPER FUNCTIONS __________________________________________________________

function checkTriggers(
    gameState: GameState,
    eventType: Event,
    eventCard: Card | null
): GameState {
    gameState.players.forEach(player => {
        console.groupCollapsed("Triggers");
        player.field.forEach(card => {
            // Iterate over the abilities array for each card
            card.abilities.forEach(ability => {
                // Check if this ability is a triggered ability and if the trigger matches the event
                if (
                    ability.type === "triggered" &&
                    ability.trigger === eventType
                ) {
                    if (!ability.condition(gameState, eventCard, card)) {
                        console.info(
                            `Trigger condition not met for ${card.name} on event: ${eventType}`
                        );
                        return; // Skip if condition not met
                    }

                    if (isInputAbility(ability)) {
                        // If the trigger requires input (target selection), process it
                        gameState = processInput(gameState, card, ability);
                    } else if (ability.effect) {
                        // Otherwise, apply the effect directly
                        gameState = applyEffect(
                            gameState,
                            ability.effect,
                            eventCard
                        );
                    }

                    console.info(
                        `Trigger executed for ${card.name} on event: ${eventType}`
                    );
                }
            });
        });
        console.groupEnd();
    });

    return { ...gameState };
}

// Filter options based on zone and matching criteria
function filterOptions(
    gameState: GameState,
    options: UserInitiatedInteractiveCardAbility["options"]
): Card[] {
    if (!options) {
        return [];
    }
    const { zone, player, match } = options;

    const filteredCards = gameState.players
        .find(p => p.id === gameState[player])
        ?.[zone].filter(card => {
            return Object.keys(match).every(
                key => card[key as keyof Card] === match[key as keyof Card]
            );
        })
        .slice(0, options.count || Infinity);

    return filteredCards || [];
}

// Apply effect to the selected card
function applyEffect(
    gameState: GameState,
    effect: Effect,
    targetCard: Card | null
): GameState {
    // Utility to find cards based on target criteria
    const findTargetCards = (effect: Effect) => {
        if (!effect.target) return [];

        const currentPlayer = gameState.players[gameState.currentPlayer];
        const opponentPlayer =
            gameState.players[(gameState.currentPlayer + 1) % 2];

        let cards: Card[] = [];
        switch (effect.target.owner) {
            case "self":
                cards = currentPlayer.field.filter(card =>
                    matchCard(card, effect.filter)
                );
                break;
            case "opponent":
                cards = opponentPlayer.field.filter(card =>
                    matchCard(card, effect.filter)
                );
                break;
            case "both":
                cards = [
                    ...currentPlayer.field.filter(card =>
                        matchCard(card, effect.filter)
                    ),
                    ...opponentPlayer.field.filter(card =>
                        matchCard(card, effect.filter)
                    ),
                ];
                break;
            default:
                break;
        }
        return cards;
    };

    // Helper to match cards based on a filter
    const matchCard = (card: Card, filter?: Partial<Card>): boolean => {
        if (!filter) return true;
        return Object.keys(filter).every(
            key => card[key as keyof Card] === filter[key as keyof Card]
        );
    };

    // Process the effect based on its type
    switch (effect.type) {
        case "draw":
            const currentPlayer = gameState.players[gameState.currentPlayer];
            gameState = drawCard(gameState, effect.amount, currentPlayer.id);
            break;

        case "damage":
            const damageTargets = targetCard
                ? [targetCard]
                : findTargetCards(effect);
            damageTargets.forEach(target => {
                gameState = damageCard(gameState, target, effect.amount);
            });
            break;

        case "heal":
            const healTargets = targetCard
                ? [targetCard]
                : findTargetCards(effect);
            healTargets.forEach(target => {
                target.strengthModifier += effect.amount;
            });
            break;

        case "buff":
            const buffTargets = targetCard
                ? [targetCard]
                : findTargetCards(effect);
            buffTargets.forEach(target => {
                if (effect.duration !== "permanent") {
                    target.modifiers.push({
                        type: effect.modifierType,
                        stat: effect.stat,
                        value: effect.amount,
                        duration: effect.duration,
                        hasTriggered: false,
                        turnApplied: gameState.turn,
                    });
                } else {
                    const statModifier =
                        effect.stat === "strength"
                            ? "strengthModifier"
                            : "willpowerModifier";
                    target[statModifier] += effect.amount;
                }
            });
            break;

        case "lore":
            gameState.players[gameState.currentPlayer].lore += effect.amount;
            break;

        case "play":
            // Prompt user for input to play a card
            const availablePlayCards = gameState.players[
                gameState.currentPlayer
            ].hand.filter(card => canPlayCard(gameState, card));
            gameState.inputStage = {
                prompt: "Select a card to play",
                options: availablePlayCards,
                callback: selectedCard => {
                    if (isCard(selectedCard)) {
                        gameState = moveCardToZoneReturnState(
                            gameState,
                            "hand",
                            "field",
                            selectedCard
                        );
                    }
                },
            };
            break;

        default:
            console.error("Unknown effect type:", effect);
            break;
    }

    return { ...gameState, inputStage: null };
}

export function chooseTarget(gameState: GameState): Card | null {
    const opponent = gameState.players[gameState.currentPlayer === 0 ? 1 : 0];
    return opponent.field.length > 0 ? opponent.field[0] : null;
}

export function moveToDiscard(
    gameState: GameState,
    defeatedCard: Card
): Player[] {
    return gameState.players.map(player => {
        if (player.id === defeatedCard.owner) {
            player.field = player.field.filter(
                card => card.id !== defeatedCard.id
            );
            player.discard.push({ ...defeatedCard, zone: "discard" });
        }

        checkTriggers(gameState, "discard", defeatedCard);
        return player;
    });
}

export const shuffleDeck = (playerId: string) => {
    useGameStore.setState(
        gameState => {
            gameState.players.forEach(p =>
                p.id === playerId
                    ? {
                          ...p,
                          deck: shuffle(p.deck),
                      }
                    : p
            );
            return gameState;
        },
        false,
        { type: `SHUFFLE DECK` }
    );
};

export function shuffle<T>(array: Array<T>): Array<T> {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function damageCard(
    state: GameState,
    card: Card,
    damage: number
): GameState {
    const target = findCardInPlay(state, card.id);
    if (!target) return state;

    target.strengthModifier -= damage;

    // Check if card should be moved to discard
    if (target.strength + target.strengthModifier <= 0) {
        state.players = moveToDiscard(state, target);
    }

    state.inputStage = null;
    return { ...state };
}

export function effectModifier(
    gameState: GameState,
    card: Card,
    stat: "willpower" | "strength" | "lore",
    amount: number
) {
    const target = findCardInPlay(gameState, card.id);
    if (!target) return gameState;

    // Apply the stat modifier
    if (stat === "strength") {
        target.strengthModifier += amount;
    } else if (stat === "willpower") {
        target.willpowerModifier += amount;
    } else if (stat === "lore") {
        target.loreModifier += amount;
    }

    // Check if the card needs to be discarded due to 0 strength
    if (target.strength + target.strengthModifier <= 0) {
        gameState.players = moveToDiscard(gameState, target);
    }

    gameState.inputStage = null;
    return { ...gameState };
}

function findCardInPlay(gameState: GameState, cardId: string): Card | null {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const opponentPlayer = gameState.players[(gameState.currentPlayer + 1) % 2];

    return (
        currentPlayer.field.find(card => card.id === cardId) ||
        opponentPlayer.field.find(card => card.id === cardId) ||
        null
    );
}
function questCard(gameState: GameState, card: Card): GameState {
    const player = gameState.players[gameState.currentPlayer];
    const target = player.field.find(c => c.id === card.id);
    if (!target) return gameState;
    target.exerted = true;
    player.lore += target.lore;
    gameState.inputStage = null;

    return { ...gameState };
}
function inkCard(gameState: GameState, card: Card): GameState {
    const player = gameState.players[gameState.currentPlayer];
    const target = player.hand.find(c => c.id === card.id);
    if (!target) return gameState;

    const movedCardState = moveCardToZoneReturnState(
        gameState,
        "hand",
        "inkwell",
        target
    );

    movedCardState.players = movedCardState.players.map(p => {
        if (p.id === player.id) {
            p.availableInk += 1;
        }
        return p;
    });

    movedCardState.inputStage = null;

    return { ...movedCardState };
}
export function exertCard(state: GameState, card: Card): GameState {
    const player = state.players[state.currentPlayer];
    const target = player.field.find(c => c.id === card.id);
    if (!target) return state;
    target.exerted = true;
    state.inputStage = null;

    return { ...state };
}
export function moveCardToZoneReturnState(
    state: GameState,
    sourceZone: Zone,
    targetZone: Zone,
    card: Card
) {
    const player = state.players.find(p =>
        p[sourceZone].some(c => c.id === card.id)
    );
    if (!player) return state;

    state.players = state.players.map(p => {
        if (p.id === player.id) {
            p[sourceZone] = p[sourceZone].filter(c => c.id !== card.id);
            p[targetZone].push({ ...card, zone: targetZone });
        }
        return p;
    });

    return { ...state };
}
export function moveCardToZone(
    sourceZone: "inkwell" | "hand" | "field",
    targetZone: "inkwell" | "hand" | "field",
    card: Card
) {
    useGameStore.setState(
        state => {
            const player = state.players.find(p =>
                p[sourceZone].some(c => c.id === card.id)
            );
            if (!player) return state;

            state.players = state.players.map(p => {
                if (p.id === player.id) {
                    p[sourceZone] = p[sourceZone].filter(c => c.id !== card.id);
                    p[targetZone].push({ ...card, zone: targetZone });
                }
                return p;
            });

            return { ...state };
        },
        false,
        { type: `MOVE CARD TO ZONE`, sourceZone, targetZone, card }
    );
}
