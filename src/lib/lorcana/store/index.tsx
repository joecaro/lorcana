import { create } from "zustand";
import { devtools } from "zustand/middleware";
import cards from "./test-cards";
import { GameState, Player, CardAction } from "../types/game";
import { shuffle } from "./actions";
import { createCards } from "./utils/cards";

const player1 = generatePlayerState("player1");
const player2 = generatePlayerState("player2", true);

const useGameStore = create<GameState>()(
    devtools(
        set => ({
            attacker: player1.id,
            defender: player2.id,
            players: [player1, player2],
            currentPlayer: 0,
            lastAction: null as CardAction | null,
            turn: 0,
            endOfTurnCallbacks: [],
            debugLogs: [],
            phase: "start_phase",
            inputStage: null,
            turnFlags: {
                ink: false,
                play: false,
                ability: false,
                challenge: false,
            },
            initializePlayerDecks: () => {
                set(state => ({
                    ...state,
                    players: state.players.map(p => initializePlayerDeck(p)),
                }));
            },
        }),
        {
            anonymousActionType: "GAME STORE ACTION",
            name: "lorcanito",
        }
    )
);

export default useGameStore;

// Helper function to generate a player's initial state
function generatePlayerState(playerId: string, bot: boolean = false): Player {
    return {
        id: playerId,
        hand: [], // Initially empty hand
        deck: shuffle(createCards(cards, playerId)), // Shuffled deck
        inkwell: [],
        discard: [],
        field: [],
        availableInk: 0,
        lore: 0,
        isHuman: !bot,
        name: playerId,
        numCardsPerTurn: 1,
        stateNumInked: 0,
        statePlayedThisTurn: [],
        stateQuestedThisTurn: [],
    };
}

export function initializePlayerDeck(player: Player) {
    const deck = shuffle(createCards(cards, player.id));
    return {
        ...player,
        hand: deck.slice(0, 5).map(c => ({ ...c, zone: "hand" })),
        deck: deck.slice(5),
    } as Player;
}
