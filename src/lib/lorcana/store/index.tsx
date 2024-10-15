import { create } from "zustand";
import { devtools } from "zustand/middleware";
import cards from "./test-cards";
import { GameState, Player, CardAction, ParamPlayer } from "../types/game";
import { shuffle } from "./actions";
import { createCards } from "./utils/cards";

const player1 = generatePlayerState("player1");
const player2 = generatePlayerState("player2");

const useGameStore = create<GameState>()(
    devtools(
        set => ({
            attacker: "",
            defender: "",
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
            allCards: cards,
            initializeParamPlayers: (players: ParamPlayer[]) => {
                const generatedPlayers = players.map(p =>
                    initializeParamPlayer(p)
                );
                set(
                    state => ({
                        ...state,
                        players: generatedPlayers,
                        attacker: generatedPlayers[0].id,
                        defender: generatedPlayers[1].id,
                    }),
                    false,
                    "Initialize Param Players"
                );
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
        id: (Math.random() * 1000000).toString(),
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

function initializeParamPlayer(player: ParamPlayer): Player {
    const generatedPlayer = generatePlayerState(player.name, !player.isHuman);
    const playerCards = player.sluggyDeck
        .map(slug => cards.find(c => c.slug === slug))
        .filter(c => c !== undefined);
    const deck = shuffle(
        createCards(
            playerCards.length > 0 ? playerCards : cards,
            generatedPlayer.id,
            !playerCards
        )
    );
    return {
        ...generatedPlayer,
        hand: deck.slice(0, 5).map(c => ({ ...c, zone: "hand" })),
        deck: deck.slice(5),
    };
}
