import { applyModifiers, checkTriggers, findPotentialTargets } from ".";
import useGameStore from "..";
import {
    Action,
    BaseCard,
    Card,
    CardAction,
    Event,
    GameState,
    Player,
} from "../../types/game";
import { moveToDiscard } from "../actions";

export function generateActionChecks(
    overrides: Partial<
        Record<
            Action,
            (gameState: GameState, thisCards: Card) => CardAction | null
        >
    > = {}
): Card["actionChecks"] {
    return {
        play: (gameState: GameState, thisCard: Card) => {
            const player = gameState.players[gameState.currentPlayer];

            if (player.availableInk < thisCard.cost) {
                return null;
            }

            return { type: "play", card: thisCard };
        },
        quest: (_: GameState, thisCard: Card) => {
            if (
                !thisCard.lore ||
                thisCard.exerted ||
                (thisCard.turnPlayed !== null && thisCard.turnPlayed >= _.turn)
            ) {
                return null;
            }
            return { type: "quest", card: thisCard };
        },
        challenge: (state: GameState, thisCard: Card) => {
            if (thisCard.exerted) {
                return null;
            }

            const potentialTargets = findPotentialTargets(state, thisCard);

            if (potentialTargets.length === 0) {
                return null;
            }

            return { type: "challenge", card: thisCard };
        },
        ink: (_: GameState, thisCard: Card) => {
            if (!thisCard.inkwell || thisCard.zone !== "hand") {
                return null;
            }
            return { type: "ink", card: thisCard };
        },
        sing: (_: GameState, thisCard: Card) => {
            if (
                thisCard.zone !== "hand" ||
                !thisCard.staticAbilities.sing.active
            ) {
                return null;
            }

            return { type: "sing", card: thisCard };
        },
        ability: () => {
            return null;
        },
        draw: (_: GameState, thisCard: Card) => {
            return { type: "draw", card: thisCard };
        },
        end_game: (_: GameState, thisCard: Card) => {
            return { type: "end_game", card: thisCard };
        },
        pass: (_: GameState, thisCard: Card) => {
            return { type: "pass", card: thisCard };
        },
        cancel: () => null,
        ...overrides,
    };
}

export function generateActions(
    overrides: Partial<
        Record<Action, (gameState: GameState, thisCard: Card) => GameState>
    > = {}
): Card["actions"] {
    return {
        ink: (gameState: GameState, thisCard: Card) => {
            const card = gameState.players[gameState.currentPlayer].hand.find(
                card => card.id === thisCard.id
            );

            if (!card) {
                console.error("Card not found in player's hand.");
                return gameState;
            }

            gameState.players = gameState.players.map(player => {
                if (player.id === gameState.attacker) {
                    player.inkwell.push({ ...card, zone: "inkwell" });
                    player.hand = gameState.players[
                        gameState.currentPlayer
                    ].hand.filter(card => card.id !== thisCard.id);
                    player.availableInk += 1;
                }
                return player;
            });

            gameState.inputStage = null;
            return gameState;
        },
        play: (gameState: GameState, thisCard: Card) => {
            gameState.inputStage = null;

            const card = gameState.players[gameState.currentPlayer].hand.find(
                card => card.id === thisCard.id
            );

            if (!card) {
                console.error("Card not found in player's hand.");
                return gameState;
            }

            gameState.players = gameState.players.map(player => {
                if (player.id === gameState.attacker) {
                    player.field.push({
                        ...card,
                        turnPlayed: gameState.turn,
                        zone: "field",
                    });
                    player.hand = gameState.players[
                        gameState.currentPlayer
                    ].hand.filter(card => card.id !== thisCard.id);
                    player.availableInk -= card.cost;
                }
                return player;
            });

            // Log the combat result
            gameState.debugLogs.push({
                type: "Play",
                card: thisCard,
                player: gameState.players[gameState.currentPlayer],
            });

            return gameState;
        },
        sing: (gameState: GameState) => {
            gameState.inputStage = null;

            return gameState;
        },
        quest: (gameState: GameState, thisCard: Card) => {
            const lore = thisCard.lore || 0;
            gameState.players[gameState.currentPlayer].lore += lore;
            thisCard.exerted = true;

            gameState.inputStage = null;
            return gameState;
        },
        challenge: (gameState: GameState, thisCard: Card) => {
            if (thisCard.exerted) {
                console.error(`${thisCard.name} is exerted, cannot attack.`);
                return gameState;
            }

            const potentialTargets = findPotentialTargets(gameState, thisCard);

            gameState.inputStage = {
                prompt: "Select a target to challenge:",
                type: "challenge",
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

                            state = checkTriggers(
                                state,
                                "challenge",
                                targetCard
                            );

                            // Apply modifiers to the strength and willpower stats before calculating damage
                            const thisCardStrengthModifier = applyModifiers(
                                thisCard,
                                "challenge",
                                "strength"
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
                            const targetCardStrengthModifier = applyModifiers(
                                targetCard,
                                "challenged",
                                "strength"
                            );

                            // Calculate the damage dealt
                            const damageDealt =
                                targetCardStrengthModifier -
                                (thisCard.willpower +
                                    thisCardWillpowerModifier);

                            // Calculate the damage received
                            const damageReceived =
                                thisCardStrengthModifier -
                                (targetCard.willpower +
                                    targetCardWillpowerModifier);

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
                                targetCard.strength +
                                    targetCard.strengthModifier <=
                                0
                            ) {
                                state.players = moveToDiscard(
                                    state,
                                    targetCard
                                );
                            }
                            if (
                                thisCard.strength + thisCard.strengthModifier <=
                                0
                            ) {
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
        },
        discard: (gameState: GameState) => {
            gameState.inputStage = null;
            return gameState;
        },
        ability: (gameState: GameState) => {
            gameState.inputStage = null;
            return gameState;
        },
        draw: (gameState: GameState) => {
            gameState.inputStage = null;
            return gameState;
        },
        end_game: (gameState: GameState) => {
            gameState.inputStage = null;
            return gameState;
        },
        pass: (gameState: GameState) => {
            gameState.inputStage = null;
            return gameState;
        },
        cancel: (gameState: GameState) => {
            gameState.inputStage = null;
            return gameState;
        },

        ...overrides,
    };
}

export function generateTriggers(
    overrides: Partial<
        Record<
            Event,
            (
                gameState: GameState,
                thisCard: Card,
                thatCard?: Card,
                target?: Card
            ) => GameState
        >
    > = {}
): Card["triggers"] {
    return {
        play: (gameState: GameState) => {
            return gameState;
        },
        quest: (gameState: GameState) => {
            return gameState;
        },
        challenge: (gameState: GameState) => {
            return gameState;
        },
        discard: (gameState: GameState) => {
            return gameState;
        },
        ink: (gameState: GameState) => {
            return gameState;
        },
        sing: (gameState: GameState) => {
            return gameState;
        },
        ability: (gameState: GameState) => {
            return gameState;
        },
        draw: (gameState: GameState) => {
            return gameState;
        },
        end_game: (gameState: GameState) => {
            return gameState;
        },
        pass: (gameState: GameState) => {
            return gameState;
        },
        cancel: (gameState: GameState) => {
            return gameState;
        },
        start_phase: (gameState: GameState) => {
            return gameState;
        },
        main_phase: (gameState: GameState) => {
            return gameState;
        },
        end_phase: (gameState: GameState) => {
            return gameState;
        },
        ...overrides,
    };
}

export function createSingerText(num: number) {
    return `**Singer ${num}**: This character counts as cost ${num} to sing songs.`;
}

export function createChallengerText(num: number) {
    return `**Challenger +${num}**: (Character willpower increases by 1 when challenging).`;
}

export const evasiveText = `**Evasive**: This character cannot be challenged.`;

export function create(card: BaseCard, ownerId: string): Card {
    return {
        ...card,
        id: Math.random().toString(36),
        owner: ownerId,
        exerted: false,
        zone: "deck",
        turnPlayed: null,
        strengthModifier: 0,
        willpowerModifier: 0,
        isFoil:
            card.rarity === "legendary" || card.rarity === "super rare"
                ? Math.random() < 0.4
                : Math.random() < 0.1,
    };
}

export function createCards(
    cards: BaseCard[],
    ownerId: string,
    fill?: boolean
): Card[] {
    return cards
        .reduce((acc: BaseCard[], card) => {
            // Set the probability factor based on the rarity of the card
            const rarityFactor = getRarityFactor(card.rarity);

            // Generate a random number of copies, weighted toward more copies for lower rarity
            const numCopies = fill
                ? Math.min(
                      Math.max(
                          1,
                          Math.floor(Math.random() ** (1 / rarityFactor) * 4)
                      ),
                      4
                  )
                : 1;

            return [...acc, ...Array(numCopies).fill(card)];
        }, [])
        .map(c => create(c, ownerId));
}

// Helper function to determine the rarity factor
function getRarityFactor(rarity: string): number {
    switch (rarity) {
        case "common":
            return 1.25;
        case "uncommon":
            return 1.5;
        case "rare":
            return 2;
        case "super rare":
            return 2.5;
        case "legendary":
            return 3;
        default:
            return 1.25; // Default factor for undefined rarities
    }
}
// check/action utils
export function getAttackerField(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].field;
}

export function getAttackerFieldCharacters(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].field.filter(
        card => card.type === "character"
    );
}

export function getAttackerFieldItems(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].field.filter(
        card => card.type === "item"
    );
}

export function getDefenderField(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer === 0 ? 1 : 0].field;
}

export function getDefenderFieldCharacters(gameState: GameState): Card[] {
    return gameState.players[
        gameState.currentPlayer === 0 ? 1 : 0
    ].field.filter(card => card.type === "character");
}

export function getDefenderFieldItems(gameState: GameState): Card[] {
    return gameState.players[
        gameState.currentPlayer === 0 ? 1 : 0
    ].field.filter(card => card.type === "item");
}

export function getAttackerHand(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].hand;
}

export function getDefenderHand(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer === 0 ? 1 : 0].hand;
}

export function getAttackerInkwell(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].inkwell;
}

export function getDefenderInkwell(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer === 0 ? 1 : 0].inkwell;
}

export function getAttackerDiscard(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].discard;
}

export function getDefenderDiscard(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer === 0 ? 1 : 0].discard;
}

export function getXCardFromPlayerDeck(
    gameState: GameState,
    playerIdx: number,
    num: number
): Card[] {
    return gameState.players[playerIdx].deck.slice(0, num);
}

export function exertPlayerCard(player: Player, card: Card) {
    player.field = player.field.map(c =>
        c.id === card.id ? { ...c, exerted: true } : c
    );
    return player;
}

export function baseAbilityCheck(
    gameState: GameState,
    thisCard: Card
): CardAction | null {
    const inkDrying =
        thisCard.turnPlayed !== null && thisCard.turnPlayed >= gameState.turn;
    const isAction = thisCard.type === "action";
    const player = gameState.players[gameState.currentPlayer];

    if (isAction && player.availableInk < thisCard.cost) {
        return { type: "ability", card: thisCard };
    }
    if (thisCard.exerted || inkDrying || thisCard.zone !== "field") {
        return null;
    }
    return { type: "ability", card: thisCard };
}
