import useGameStore from ".";
import { Action, Card, GameState, Player, Zone } from "../types/game";
import { checkTriggers, drawCard } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PLAYER_ACTIONS: Record<Action, (...ags: any) => void> = {
    play: choosePlayCard,
    draw: chooseDrawCard,
    quest: chooseQuest,
    challenge: chooseChallenge,
    discard: () => console.log("Discarding"),
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
            const playableCards = player.hand
                .filter(card => card.cost <= player.availableInk)
                .filter(
                    card => card.actionChecks.play(gameState, card) !== null
                );

            gameState.inputStage = {
                prompt: "Select a card to play:",
                type: "play",
                options: playableCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (typeof targetCard !== "object") {
                                console.error("No valid target for attack.");
                                return gameState;
                            }

                            const newGameState = targetCard.actions.play(
                                gameState,
                                targetCard
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
            const questableCards = player.field.filter(
                card => card.actionChecks.quest(gameState, card) !== null
            );

            gameState.inputStage = {
                prompt: "Select a card to quest:",
                type: "quest",
                options: questableCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (typeof targetCard !== "object") {
                                console.error("No valid target for attack.");
                                return gameState;
                            }

                            const newGameState = targetCard.actions.quest(
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
                card => card.actionChecks.challenge(gameState, card) !== null
            );

            gameState.inputStage = {
                prompt: "Select a card to challenge:",
                type: "challenge",
                options: challengeableCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (typeof targetCard !== "object") {
                                console.error("No valid target for attack.");
                                return gameState;
                            }

                            const newGameState = targetCard.actions.challenge(
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
            const abilityCards = player.field.filter(
                card => card.actionChecks.ability(gameState, card) !== null
            );

            gameState.inputStage = {
                prompt: "Select a card to exert:",
                type: "ability",
                options: abilityCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (typeof targetCard !== "object") {
                                console.error("No valid target for attack.");
                                return gameState;
                            }

                            const newGameState = targetCard.actions.ability(
                                gameState,
                                targetCard
                            );

                            return { ...newGameState };
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

function chooseInkCard() {
    useGameStore.setState(
        gameState => {
            const player = gameState.players[gameState.currentPlayer];
            const inkableCards = player.hand.filter(
                card => card.actionChecks.ink(gameState, card) !== null
            );

            gameState.inputStage = {
                prompt: "Select a card to ink:",
                type: "ink",
                options: inkableCards,
                callback: targetCard => {
                    useGameStore.setState(
                        gameState => {
                            if (typeof targetCard !== "object") {
                                console.error("No valid target for attack.");
                                return gameState;
                            }

                            const newGameState = targetCard.actions.ink(
                                gameState,
                                targetCard
                            );

                            return { ...newGameState };
                        },
                        false,
                        { type: `INK CARD` }
                    );
                },
            };

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
            gameState.round += 1;
            gameState.players = gameState.players.map(p => {
                if (p.id === gameState.attacker) {
                    p.availableInk = p.inkwell.length;
                    p.field = p.field.map(card => {
                        card.exerted = false;
                        return card;
                    });
                }
                return p;
            });
            gameState.phase = "main_phase";
            return { ...gameState };
        },
        false,
        { type: `PASS ACTION` }
    );
}

// HELPER FUNCTIONS __________________________________________________________

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
        return player;
    });
}

export const shuffleDeck = (playerId: string) => {
    useGameStore.setState(gameState => {
        gameState.players.forEach(p =>
            p.id === playerId
                ? {
                      ...p,
                      deck: shuffle(p.deck),
                  }
                : p
        );
        return gameState;
    });
};

// Helper function to shuffle an array
export function shuffle<T>(array: Array<T>): Array<T> {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
