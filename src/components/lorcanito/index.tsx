"use client";
import React, { useEffect } from "react";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import CardComp from "./card";
import useGameStore from "@/lib/lorcanito/store";
import Hand from "./hand";
import { Shield } from "lucide-react";
import Deck from "./deck";
import { Action, Card as CardType, Player } from "@/lib/lorcanito/types/game";
import { computeAvailableActions } from "@/lib/lorcanito/store/utils";
import { PLAYER_ACTIONS } from "@/lib/lorcanito/store/actions";
import { Card } from "../ui/card";
import CardSelect from "./card-select";

type DropZoneProps = {
    id: string;
    cards: CardType[];
    className?: string;
    hideCardDetails?: boolean;
    square?: boolean;
    inkwell?: boolean;
};

const DropZone: React.FC<DropZoneProps> = ({
    id,
    cards,
    className,
    hideCardDetails,
    square,
    inkwell,
}) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });
    const players = useGameStore(state => state.players);
    const currentPlayerIndex = useGameStore(state => state.currentPlayer);
    const inputStage = useGameStore(state => state.inputStage);
    const availableInk = players[currentPlayerIndex].availableInk;

    const isOption = (card: CardType) =>
        !!inputStage &&
        !!inputStage.options.find(
            c => typeof c === "object" && c.id === card.id
        );

    return (
        <motion.div
            ref={setNodeRef}
            layout
            className={`h-32 m-2 p-2 rounded-lg flex flex-wrap gap-2 items-start ${className}`}
        >
            {cards.map((card, idx) => (
                <CardComp
                    key={"drop" + id + card.id}
                    card={card}
                    hideCardDetails={hideCardDetails}
                    square={square}
                    className={`${
                        cards.length - Math.abs(cards.length - availableInk) <
                            idx + 1 && inkwell
                            ? "opacity-30"
                            : ""
                    }`}
                />
            ))}
        </motion.div>
    );
};

export default function Board() {
    const players = useGameStore(state => state.players);
    const currentPlayerIndex = useGameStore(state => state.currentPlayer);
    const inputStage = useGameStore(state => state.inputStage);

    const currentPlayer = players[currentPlayerIndex];
    const opponent = players[currentPlayerIndex === 1 ? 0 : 1];

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return; // If no valid drop target, ignore the event

        const cardToMove =
            currentPlayer.hand.find(card => card.id === active.id) ||
            currentPlayer.field.find(card => card.id === active.id) ||
            currentPlayer.inkwell.find(card => card.id === active.id);

        if (!cardToMove) return; // No card found to move, do nothing

        const sourceZone = ["hand", "field", "inkwell"].find(zone =>
            (currentPlayer[zone as keyof Player] as CardType[]).some(
                card => card.id === active.id
            )
        );

        const targetZone = over.id as keyof Player;

        if (sourceZone && targetZone && sourceZone !== targetZone) {
            // Move card to a new zone
            // moveCardToZone(
            //     sourceZone as "inkwell" | "hand" | "field",
            //     targetZone as "inkwell" | "hand" | "field",
            //     cardToMove
            // );
        } else if (sourceZone) {
            // Card was dropped back into the same zone
            console.log("Card was dropped back into the same zone");
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className='h-screen max-h-screen overflow-hidden p-8'>
                <div className='grid'>
                    {/* opponent */}
                    <div className='flex'>
                        <span>
                            <Shield />
                            {opponent.lore}
                        </span>
                    </div>
                    {/* opponent field */}
                    <div>
                        <DropZone
                            id='none'
                            cards={opponent.field}
                            square
                            className='bg-green-100 bg-opacity-20'
                        />
                    </div>
                    {/* player field */}
                    <DropZone
                        id='field'
                        cards={currentPlayer.field}
                        square
                        className='bg-green-100 bg-opacity-20'
                    />
                    {/* player */}
                    <DropZone
                        id='inkwell'
                        cards={currentPlayer.inkwell}
                        hideCardDetails
                        square
                        inkwell
                        className='bg-purple-100 bg-opacity-20'
                    />
                </div>
                <div className='mt-8 text-center flex gap-2'>
                    <Deck />
                    <Hand />
                    <Options />
                </div>
            </div>
            {inputStage && inputStage.showDialogue ? (
                <CardSelect inputStage={inputStage} />
            ) : null}
        </DndContext>
    );
}

const OptionKeybinds: Record<string, Action> = {
    p: "play",
    i: "ink",
    e: "pass",
    a: "ability",
    c: "cancel",
    q: "quest",
    h: "challenge",
    x: "end_game",
};

const Options = () => {
    const attackingPlayer = useGameStore(state => state.attacker);
    const availableActions = computeAvailableActions(useGameStore.getState());
    const inputStage = useGameStore(state => state.inputStage);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const action = OptionKeybinds[e.key];
            if (action && availableActions?.find(a => a.type === action)) {
                PLAYER_ACTIONS[action]();
            }

            if (e.key === "d") {
                PLAYER_ACTIONS.draw(1, attackingPlayer);
            }

            inputStage?.options.forEach((option, index) => {
                if (
                    typeof option === "object" &&
                    index < 9 &&
                    e.key === String(index + 1)
                ) {
                    inputStage.callback(option);
                }
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [availableActions]);

    return (
        <Card className='bg-black p-4 text-white flex flex-col gap-2 items-stretch absolute right-10 bottom-10'>
            <div>
                <h2>Actions</h2>
                <ul className='w-full flex flex-col items-stretch gap-2'>
                    {availableActions?.map(action => (
                        <Button
                            key={action.type}
                            onClick={PLAYER_ACTIONS[action.type]}
                        >
                            {action.type}
                        </Button>
                    ))}
                </ul>
            </div>
            <Button onClick={() => PLAYER_ACTIONS.draw(1, attackingPlayer)}>
                Draw Card
            </Button>
        </Card>
    );
};

// function moveCardToZone(
//     sourceZone: "inkwell" | "hand" | "field",
//     targetZone: "inkwell" | "hand" | "field",
//     card: CardType
// ) {
//     switch (targetZone) {
//         case "hand":
//             addCardToHand(card, sourceZone);
//             break;
//         case "field":
//             playCard(card);
//             break;
//         case "inkwell":
//             addCardToInkwell(card);
//             break;
//     }
// }
