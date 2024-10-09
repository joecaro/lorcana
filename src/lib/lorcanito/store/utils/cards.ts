import { applyModifiers, findPontentialTargets } from ".";
import useGameStore from "..";
import {
    Action,
    BaseCard,
    Card,
    CardAction,
    Event,
    GameState,
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
                (thisCard.roundPlayed !== null &&
                    thisCard.roundPlayed >= _.round)
            ) {
                return null;
            }
            return { type: "quest", card: thisCard };
        },
        challenge: (_: GameState, thisCard: Card) => {
            if (thisCard.exerted) {
                return null;
            }

            const potentialTargets = findPontentialTargets(_);

            if (potentialTargets.length === 0) {
                return null;
            }

            return { type: "challenge", card: thisCard };
        },
        ink: (_: GameState, thisCard: Card) => {
            if (!thisCard.inkwell) {
                return null;
            }
            return { type: "ink", card: thisCard };
        },
        ability: (_: GameState, thisCard: Card) => {
            const inkDrying =
                thisCard.roundPlayed !== null &&
                thisCard.roundPlayed >= _.round;
            const isAction = thisCard.type === "action";
            const player = _.players[_.currentPlayer];

            if (isAction && player.availableInk < thisCard.cost) {
                return { type: "ability", card: thisCard };
            }
            if (thisCard.exerted || inkDrying || thisCard.zone !== "field") {
                return null;
            }
            return { type: "ability", card: thisCard };
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
                        roundPlayed: gameState.round,
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

            const potentialTargets = findPontentialTargets(gameState);

            gameState.inputStage = {
                prompt: "Select a target to challenge:",
                type: "challenge",
                options: potentialTargets,
                callback: targetCard => {
                    useGameStore.setState(state => {
                        if (
                            typeof targetCard !== "object" ||
                            !("willpower" in targetCard)
                        ) {
                            console.error("No valid target for challenge.");
                            return state;
                        }

                        // Apply modifiers to the strength and willpower stats before calculating damage
                        const modifiedStrength = applyModifiers(
                            thisCard,
                            "challenge",
                            thisCard.strength,
                            "strength"
                        );
                        const modifiedWillpower = applyModifiers(
                            targetCard,
                            "challenge",
                            targetCard.willpower,
                            "willpower"
                        );

                        const modifiedTargetWillpower = applyModifiers(
                            targetCard,
                            "challenged",
                            targetCard.willpower,
                            "willpower"
                        );
                        const modifiedTargetStrength = applyModifiers(
                            targetCard,
                            "challenged",
                            targetCard.strength,
                            "strength"
                        );

                        // Calculate the damage dealt and taken
                        const damageDealt =
                            modifiedStrength - modifiedTargetWillpower;
                        const damageTaken =
                            modifiedTargetStrength - modifiedWillpower;

                        // Apply damage to the target and attacker
                        targetCard.strength -= damageDealt;
                        thisCard.strength -= damageTaken;

                        // Log the combat result
                        state.debugLogs.push({
                            type: "Combat",
                            attacker: thisCard,
                            defender: targetCard,
                            damageDealt,
                            damageTaken,
                        });

                        // Mark the attacker as exerted
                        thisCard.exerted = true;

                        // Remove defeated cards (optional: handle graveyard logic)
                        if (targetCard.strength <= 0) {
                            state.players = moveToDiscard(state, targetCard);
                        }
                        if (thisCard.strength <= 0) {
                            state.players = moveToDiscard(state, thisCard);
                        }

                        state.inputStage = null;

                        return { ...state };
                    });
                },
            };
            return gameState;
        },
        discard: (gameState: GameState, thisCard: Card) => {
            gameState.inputStage = null;
            return gameState;
        },
        ability: (gameState: GameState, thisCard: Card) => {
            gameState.inputStage = null;
            return gameState;
        },
        draw: (gameState: GameState, thisCard: Card) => {
            gameState.inputStage = null;
            return gameState;
        },
        end_game: (gameState: GameState, thisCard: Card) => {
            gameState.inputStage = null;
            return gameState;
        },
        pass: (gameState: GameState, thisCard: Card) => {
            gameState.inputStage = null;
            return gameState;
        },
        cancel: (gameState: GameState, thisCard: Card) => {
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
            (gameState: GameState, thisCard: Card, thatCard?: Card) => GameState
        >
    > = {}
): Card["triggers"] {
    return {
        play: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        quest: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        challenge: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        discard: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        ink: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        ability: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        draw: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        end_game: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        pass: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        cancel: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        start_phase: (
            gameState: GameState,
            thisCard: Card,
            thatCard?: Card
        ) => {
            return gameState;
        },
        main_phase: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        end_phase: (gameState: GameState, thisCard: Card, thatCard?: Card) => {
            return gameState;
        },
        ...overrides,
    };
}

export function create(card: BaseCard, ownerId: string): Card {
    return {
        ...card,
        id: Math.random().toString(36),
        owner: ownerId,
        exerted: false,
        zone: "deck",
        roundPlayed: null,
        strengthModifier: 0,
        willpowerModifier: 0,
        isFoil: Math.random() < 0.4,
    };
}

export function createCards(cards: BaseCard[], ownerId: string): Card[] {
    return cards.map(c => create(c, ownerId));
}
