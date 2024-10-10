import { create } from "zustand";
import { devtools } from "zustand/middleware";
import cards from "./test-cards";
import { GameState, Player } from "../types/game";
import { shuffle } from "./actions";
import { createCards } from "./utils/cards";

const player1 = generatePlayerState("player1");
const player2 = generatePlayerState("player2", true);

const useGameStore = create<GameState>()(
    // persist(
    devtools(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (set, get) => ({
            attacker: player1.id,
            defender: player2.id,
            players: [player1, player2],
            currentPlayer: 0,
            lastAction: null,
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
        }),
        {
            anonymousActionType: "GAME STORE ACTION",
            name: "lorcanito", // unique name for storage
        }
    )
    //     {
    //         name: "lorcanito",
    //     }
    // )
);

export default useGameStore;

// Helper function to generate a player's initial state
function generatePlayerState(playerId: string, bot: boolean = false): Player {
    return {
        id: playerId,
        hand: [], // Initially empty hand
        deck: [], // Initially empty deck
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

export function initializePlayerDeck(playerId: string) {
    const deck = shuffle(createCards(cards, playerId));
    return {
        hand: deck.slice(0, 5).map(c => ({ ...c, zone: 'hand' })),
        deck: deck.slice(5),
    };
}