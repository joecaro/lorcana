import Game from "@/components/lorcana";
import { Toaster } from "sonner";

export default function Page({
    searchParams,
}: {
    searchParams: Record<string, string>;
}) {
    const player1 = searchParams.player1 || "player1";
    const player2 = searchParams.player2 || "player2";
    const player1is = searchParams.player1is || "human";
    const player2is = searchParams.player2is || "ai";
    const player1deck = searchParams.player1deck || "";
    const player2deck = searchParams.player2deck || "";

    const player1Deck = player1deck.split(",");
    const player2Deck = player2deck.split(",");

    const player1isHuman = player1is.toLowerCase().trim().startsWith("h");

    const player2isHuman = player2is.toLowerCase().trim().startsWith("h");

    return (
        <div className='h-screen max-h-screen overflow-hidden'>
            <Game
                player1={{
                    name: player1,
                    isHuman: player1isHuman,
                    sluggyDeck: player1Deck,
                }}
                player2={{
                    name: player2,
                    isHuman: player2isHuman,
                    sluggyDeck: player2Deck,
                }}
            />
            <Toaster />
        </div>
    );
}
