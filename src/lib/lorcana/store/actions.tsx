import useGameStore from ".";
import { executeBotAction } from "../bot";
import {
    Action,
    Card,
    CardAbility,
    Effect,
    Event,
    GameState,
    InputStage,
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
                card: null,
                prompt: "Select a card to play:",
                options: {
                    match: { zone: "hand" },
                    player: "self",
                    zone: "hand",
                },
                computedOptions: playableCards,
                callback: abilityCallback((gameState, targetCard) => {
                    if (!isCard(targetCard)) {
                        console.error("No valid target for playing.");
                        return gameState;
                    }

                    const newGameState = moveCardToZoneReturnState(
                        gameState,
                        "hand",
                        "field",
                        targetCard
                    );

                    // decrease player available ink
                    newGameState.players = newGameState.players.map(p => {
                        if (p.id === player.id) {
                            p.availableInk -= targetCard.cost;
                        }
                        return p;
                    });

                    const resolvedGameState = checkTriggers(
                        newGameState,
                        "play",
                        targetCard
                    );

                    const nextAction = resolvedGameState.inputQueue.shift();

                    if (nextAction) {
                        resolvedGameState.inputStage = {
                            ...nextAction,
                            computedOptions: filterOptions(
                                resolvedGameState,
                                nextAction.card,
                                nextAction.options
                            ),
                        };
                    }

                    return { ...resolvedGameState };
                }, "PLAY CARD"),
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
                card: null,
                prompt: "Select a card to quest:",
                options: {
                    match: { zone: "field" },
                    player: "self",
                    zone: "field",
                },
                computedOptions: questableCards,
                callback: targetCard => {
                    const gameState = useGameStore.getState();
                    if (!isCard(targetCard)) {
                        console.error("No valid target for quest.");
                        return gameState;
                    }
                    const newGameState = questCard(gameState, targetCard);

                    return { ...newGameState };
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
                card: null,
                prompt: "Select a card to challenge:",
                options: {
                    match: { type: "character", exerted: false },
                    player: "self",
                    zone: "field",
                },
                computedOptions: challengeableCards,
                callback: abilityCallback((state, targetCard) => {
                    if (!isCard(targetCard)) {
                        console.error("No valid target for attack.");
                        return state;
                    }

                    const newGameState = processChallenge(state, targetCard);

                    return { ...newGameState };
                }, `CHALLENGE CARD`),
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
                card: null,
                prompt: "Select a card to exert:",
                options: {
                    match: { zone: "field" },
                    player: "self",
                    zone: "field",
                },
                computedOptions: [...abilityCards, ...actionCards],
                callback: abilityCallback((gameState, targetCard) => {
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
                }, "ABILITY CARD"),
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
                card: null,
                prompt: "Select a card to ink:",
                options: {
                    match: { zone: "hand", inkwell: true },
                    player: "self",
                    zone: "hand",
                },
                computedOptions: inkableCards,
                callback: abilityCallback((gameState, targetCard) => {
                    if (!isCard(targetCard)) {
                        console.error("No valid target for attack.");
                        return gameState;
                    }

                    const newGameState = inkCard(gameState, targetCard);

                    return { ...newGameState };
                }, "INK CARD"),
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
        card,
        prompt: "Select an ability to use:",
        options: {
            match: { zone: "field" },
            player: "self",
            zone: "field",
        },
        computedOptions: filteredAbilities,
        showDialogue: true,
        callback: abilityCallback((gameState, selectedOption) => {
            if (!selectedOption || !isInputAbility(selectedOption)) {
                console.error("No valid option selected.");
                return gameState;
            }

            return processInput(gameState, card, selectedOption);
        }, "ABILITY SELECT"),
    };

    return { ...gameState };
}

// ACTION PROCESSOR __________________________________________________________
export function processOptionSelect(
    selectedOption: Card | CardAbility,
    inputStage: InputStage
) {
    useGameStore.setState(
        gameState => {
            gameState = inputStage.callback(selectedOption);
            return { ...gameState };
        },
        false,
        { type: `OPTION SELECT - ${inputStage.prompt} - QUEUE ACTION` }
    );
}

function processInput(
    gameState: GameState,
    card: Card,
    ability: UserInitiatedCardAbility | TriggeredCardAbility
): GameState {
    if (!ability) {
        console.error("No ability found.");
        return gameState;
    }

    if (isEffectAbility(ability)) {
        return applyEffect(gameState, ability.effect, card);
    }

    if (!isInputAbility(ability)) {
        return ability.callback({
            gameState,
            selectedOption: null,
            thisCard: card,
            eventDetails: {},
        });
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

    const filteredOptions = filterOptions(gameState, card, ability.options);

    if (filteredOptions.length === 0) {
        console.error("No valid options for selection.");
        return { ...gameState, inputStage: null };
    }

    gameState.inputQueue.push({
        card,
        prompt: ability.prompt || "Select an option",
        options: ability.options,
        computedOptions: filteredOptions,
        showDialogue: ability.showDialog,
        callback: selectedOption => {
            const gameState = useGameStore.getState();
            if (!isCard(selectedOption)) {
                console.error("Invalid option selected.");
                return gameState;
            }

            return ability.callback
                ? ability.callback({
                      gameState,
                      selectedOption,
                      thisCard: card,
                      eventDetails: {},
                  })
                : gameState;
        },
    });

    return { ...gameState };
}

function handleMultiPartInput(
    gameState: GameState,
    multiPart: UserInitiatedInteractiveCardAbility["multiPart"],
    finalCallback: UserInitiatedInteractiveCardAbility["callback"],
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
            return finalCallback({
                gameState: currentGameState,
                selectedOption: null,
                thisCard: card,
                eventDetails: {},
            });
        }

        const currentStep = steps[stepIndex];
        const filteredOptions = filterOptions(
            currentGameState,
            card,
            currentStep.options
        );

        // Set the next input stage for the current step
        currentGameState.inputQueue.unshift({
            card,
            prompt: currentStep.prompt,
            options: currentStep.options,
            computedOptions: filteredOptions,
            stepIndex, // Track the current step
            callback: selectedOption => {
                const state = useGameStore.getState();

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
        });

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

    gameState.inputQueue.unshift({
        card: thisCard,
        prompt: "Select a target to challenge:",
        options: {
            match: { type: "character", exerted: true },
            player: "opponent",
            zone: "field",
        },
        computedOptions: [],
        callback: abilityCallback((state, targetCard) => {
            if (
                typeof targetCard !== "object" ||
                !("willpower" in targetCard)
            ) {
                console.error("No valid target for challenge.");
                return state;
            }

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
            if (targetCard.strength + targetCard.strengthModifier <= 0) {
                state = moveToDiscard(state, targetCard);
            }
            if (thisCard.strength + thisCard.strengthModifier <= 0) {
                state = moveToDiscard(state, thisCard);
            }

            return { ...state };
        }, "CHALLENGE CARD"),
    });
    return gameState;
}

// HELPER FUNCTIONS __________________________________________________________

function nextQueueAction(gameState: GameState): GameState {
    const nextAction = gameState.inputQueue.shift();

    console.log("Next action:", nextAction);

    gameState.inputStage = nextAction
        ? {
              ...nextAction,
              computedOptions: filterOptions(
                  gameState,
                  nextAction.card,
                  nextAction.options
              ),
          }
        : null;
    return { ...gameState };
}

function checkTriggers(
    gameState: GameState,
    eventType: Event,
    eventCard: Card | null
): GameState {
    console.groupCollapsed("Triggers - ", eventType);
    gameState.players.forEach(player => {
        player.field.forEach(card => {
            // Iterate over the abilities array for each card
            card.abilities.forEach(ability => {
                // Check if this ability is a triggered ability and if the trigger matches the event
                if (
                    ability.type === "triggered" &&
                    ability.trigger === eventType
                ) {
                    console.groupCollapsed(
                        "Triggers - ",
                        eventType,
                        " - ",
                        eventCard?.name
                    );
                    if (!ability.condition(gameState, eventCard, card)) {
                        console.log(
                            `Trigger condition not met for ${card.name} on event: ${eventType}`
                        );
                        return; // Skip if condition not met
                    }

                    if (isInputAbility(ability)) {
                        gameState = processInput(gameState, card, ability);
                    } else if (isEffectAbility(ability)) {
                        gameState = applyEffect(
                            gameState,
                            ability.effect,
                            eventCard
                        );
                    } else {
                        gameState = ability.callback({
                            gameState,
                            selectedOption: eventCard,
                            thisCard: card,
                            eventDetails: {},
                        });
                    }

                    console.log(
                        `Trigger executed for ${card.name} on event: ${eventType}`
                    );
                    console.groupEnd();
                }
            });
        });
    });
    console.groupEnd();

    return { ...gameState };
}

// Filter options based on zone and matching criteria
export function filterOptions(
    gameState: GameState,
    card: Card | null,
    options: UserInitiatedInteractiveCardAbility["options"]
): Card[] {
    if (!options || !card) {
        return [];
    }
    const { zone, player, match } = options;

    const playerMatch = gameState.players.find(p =>
        player === "self" ? p.id === card.owner : p.id !== card.owner
    );

    const filteredCards = playerMatch?.[zone]
        .filter(card => {
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
    console.info("Effect:", effect.type);

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
            const loreTargets = targetCard
                ? [targetCard]
                : findTargetCards(effect);

            loreTargets.forEach(target => {
                const updatedTarget = {
                    ...target,
                    loreModifier: target.loreModifier + effect.amount,
                };
                gameState = updateCardInState(gameState, updatedTarget);
            });

            break;

        case "play":
            // Prompt user for input to play a card
            const availablePlayCards = gameState.players[
                gameState.currentPlayer
            ].hand.filter(card => canPlayCard(gameState, card));
            gameState.inputQueue.push({
                card: null,
                prompt: "Select a card to play",
                options: {
                    match: { zone: "hand" },
                    player: "self",
                    zone: "hand",
                },
                computedOptions: availablePlayCards,
                callback: selectedCard => {
                    if (isCard(selectedCard)) {
                        return moveCardToZoneReturnState(
                            gameState,
                            "hand",
                            "field",
                            selectedCard
                        );
                    }
                    return gameState;
                },
            });
            break;

        default:
            console.error("Unknown effect type:", effect);
            break;
    }

    return { ...gameState };
}

export function chooseTarget(gameState: GameState): Card | null {
    const opponent = gameState.players[gameState.currentPlayer === 0 ? 1 : 0];
    return opponent.field.length > 0 ? opponent.field[0] : null;
}

export function moveToDiscard(
    gameState: GameState,
    defeatedCard: Card
): GameState {
    gameState = checkTriggers(gameState, "discard", defeatedCard);
    gameState.players = gameState.players.map(player => {
        if (player.id === defeatedCard.owner) {
            player.field = player.field.filter(
                card => card.id !== defeatedCard.id
            );
            player.discard.push({ ...defeatedCard, zone: "discard" });
        }

        return player;
    });

    return gameState;
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
        state = moveToDiscard(state, target);
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
        gameState = moveToDiscard(gameState, target);
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
    player.lore += target.lore + target.loreModifier;
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

export function updateCardInState(
    gameState: GameState,
    updatedCard: Card
): GameState {
    return {
        ...gameState,
        players: gameState.players.map(player => ({
            ...player,
            field: player.field.map(card =>
                card.id === updatedCard.id ? updatedCard : card
            ),
        })),
    };
}

export function abilityCallback(
    cb: (state: GameState, choice: Card | CardAbility) => GameState,
    type: string
) {
    return (choice: Card | CardAbility) => {
        const state = useGameStore.getState();
        console.log("abilityCallback", type, choice);
        return nextQueueAction(cb(state, choice));
    };
}
