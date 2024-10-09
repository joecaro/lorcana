import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import cards from "./test-cards";
import { GameState, Player } from "../types/game";
import { shuffle } from "./actions";
import { createCards } from "./utils/cards";

const player1 = generatePlayerState("player1");
const player2 = generatePlayerState("player2");

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
function generatePlayerState(playerId: string): Player {
    return {
        id: playerId,
        hand: [],
        deck: shuffle(createCards(cards, playerId)),
        inkwell: [],
        discard: [],
        field: [],
        availableInk: 0,
        lore: 0,
        isHuman: true,
        name: playerId,
        numCardsPerTurn: 1,
        stateNumInked: 0,
        statePlayedThisTurn: [],
        stateQuestedThisTurn: [],
    };
}
