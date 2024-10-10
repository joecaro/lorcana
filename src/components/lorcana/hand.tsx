"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Card } from "@/lib/lorcana/types/game";
import CardComp from "./card";
import useGameStore from "@/lib/lorcana/store";

type DropZoneProps = {
    className?: string;
};

const Hand: React.FC<DropZoneProps> = ({ className }) => {
    const { setNodeRef } = useDroppable({
        id: "hand",
    });

    const players = useGameStore(state => state.players);
    const currentPlayerIndex = useGameStore(state => state.currentPlayer);
    const hand = players[currentPlayerIndex].hand;

    const cardCount = hand.length;
    const maxRotation = 15; // Maximum rotation angle for the cards
    const maxOffset = 20; // Maximum Y offset
    // const spacing = 60; // Adjust this for card spacing

    return (
        <motion.div
            ref={setNodeRef}
            className={`translate-y-3 flex flex-1 justify-center items-end space-x-[-40px] p-4 ${className}`} // Space between cards overlaps
            style={{ height: "200px" }} // Container height can be adjusted
        >
            {hand.map((card, index) => {
                const rotation =
                    ((index - cardCount / 2) / cardCount) * maxRotation;
                const yOffset =
                    Math.abs((index - cardCount / 2) / cardCount) * maxOffset;

                return (
                    <motion.div
                        key={"hand" + card.id}
                        initial={{ opacity: 0, left: -300 }}
                        animate={{ opacity: 1, left: 0 }}
                        exit={{ opacity: 0, top: -500 }}
                        style={{
                            transform: `rotate(${rotation}deg) translateY(${yOffset}px)`,
                            zIndex: index,
                            perspective: "500px",
                        }}
                        whileHover={{
                            transform: `rotate(0deg) translateY(${
                                yOffset - 20
                            }px) scale(1.1)`,
                            zIndex: 10,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                    >
                        <CardComp
                            card={card}
                        />
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

export default Hand;
