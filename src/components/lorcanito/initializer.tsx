import { useEffect } from "react";
import useGameStore from "@/lib/lorcanito/store";
import { shuffle } from "@/lib/lorcanito/store/actions";
import { createCards } from "@/lib/lorcanito/store/utils/cards";
import { Card } from "@/lib/lorcanito/types/game";
import cards from "@/lib/lorcanito/store/test-cards";

// Function to shuffle and set the initial deck and hand for the player
function initializePlayerDeck(playerId: string) {
    const deck = shuffle(createCards(cards, playerId));
    return {
        hand: deck.slice(0, 5).map(c => ({ ...c, zone: "hand" })) as Card[],
        deck: deck.slice(5),
    };
}

export default function useGameInitializer() {
    useEffect(() => {
        const initialPlayer1State = initializePlayerDeck("player1");
        const initialPlayer2State = initializePlayerDeck("player2");

        useGameStore.setState(state => ({
            ...state,
            players: [
                {
                    ...state.players[0],
                    ...initialPlayer1State,
                },
                {
                    ...state.players[1],
                    ...initialPlayer2State,
                },
            ],
        }));
    }, []);

    return null;
}
