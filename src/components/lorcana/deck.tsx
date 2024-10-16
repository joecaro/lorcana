import useGameStore from "@/lib/lorcana/store";
import { PLAYER_ACTIONS } from "@/lib/lorcana/store/actions";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Deck() {
    const players = useGameStore(state => state.players);
    const currentPlayerIndex = useGameStore(state => state.currentPlayer);

    const deck = players[currentPlayerIndex].deck;
    const slicedDeck = deck.slice(-15);
    return (
        <motion.div className='w-10 h-16 lg:w-32 lg:h-52 relative'>
            {slicedDeck.map((card, idx) => (
                <motion.div
                    key={card.id}
                    layout
                    className='w-10 h-16 lg:w-32 lg:h-48 border rounded border-neutral-500'
                    style={{
                        position: "absolute",
                        bottom: `${idx}px`,
                    }}
                >
                    {idx === slicedDeck.length - 1 && (
                        <Image
                            priority
                            alt='deck card'
                            src='/card-back.jpg'
                            width={700}
                            height={1000}
                            className='border rounded border-neutral-500 cursor-pointer object-cover w-10 h-16 lg:w-32 lg:h-48'
                            onClick={() =>
                                PLAYER_ACTIONS.draw(
                                    1,
                                    players[currentPlayerIndex].id
                                )
                            }
                        />
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
}
