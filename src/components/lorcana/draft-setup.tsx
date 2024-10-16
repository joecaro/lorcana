"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import useGameStore from "@/lib/lorcana/store";
import DeckStats from "./deck-stats";
import CardComp from "./card";
import { shuffle } from "@/lib/lorcana/store/actions";
import { BaseCard } from "@/lib/lorcana/types/game";

type PlayerDeck = { [key: string]: number };

export default function DraftSetup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        player1is: "human",
        player1deck: {} as PlayerDeck,
        player2is: "ai",
        player2deck: {} as PlayerDeck,
    });
    const [activePlayer, setActivePlayer] = useState<"player1" | "player2">(
        "player1"
    );

    const cards = useGameStore(state => state.allCards);

    const [currentList, setCurrentList] = useState<BaseCard[]>([]);
    const setRandomCardList = useCallback(() => {
        setCurrentList(shuffle(cards).slice(0, 10));
    }, [cards]);
    const hyrdated = useRef(false);
    useEffect(() => {
        if (hyrdated.current) return;
        hyrdated.current = true;
        setRandomCardList();
    }, [setRandomCardList]);

    const handleCardSelect = useCallback(
        (player: "player1" | "player2", card: string) => {
            const currentDeck = { ...formData[`${player}deck`] };
            currentDeck[card] = (currentDeck[card] || 0) + 1;
            setFormData({ ...formData, [`${player}deck`]: currentDeck });
            setCurrentList(prev => prev.filter(c => c.slug !== card));
            setActivePlayer(prev =>
                prev === "player1" ? "player2" : "player1"
            );

            if (currentList.length === 1) {
                setRandomCardList();
            }
        },
        [formData, setRandomCardList, currentList]
    );

    const handleCardClick = useCallback(
        (card: string) => {
            console.log("handleCardClick", activePlayer, card);

            handleCardSelect(activePlayer, card);
        },
        [activePlayer, handleCardSelect]
    );

    const adjustCardCount = (
        player: "player1" | "player2",
        card: string,
        adjustment: number
    ) => {
        const currentDeck = { ...formData[`${player}deck`] };
        const newCount = (currentDeck[card] || 0) + adjustment;
        if (newCount <= 0) delete currentDeck[card];
        else currentDeck[card] = newCount;
        setFormData({ ...formData, [`${player}deck`]: currentDeck });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            Object.keys(formData.player1deck).length < 10 ||
            Object.keys(formData.player2deck).length < 10
        ) {
            toast(
                "Invalid Deck. Please select at least 10 cards for each player."
            );
            return;
        }

        const player1DeckString = Object.entries(formData.player1deck)
            .flatMap(([card, count]) => Array(count).fill(card))
            .join(",");
        const player2DeckString = Object.entries(formData.player2deck)
            .flatMap(([card, count]) => Array(count).fill(card))
            .join(",");

        const queryParams = new URLSearchParams({
            player1is: formData.player1is,
            player1deck: player1DeckString,
            player2is: formData.player2is,
            player2deck: player2DeckString,
        }).toString();
        router.push(`/game?${queryParams}`);
    };

    return (
        <div className='p-4 h-full w-full overflow-y-auto'>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='flex justify-between'>
                    <h1 className='text-2xl font-bold mb-4'>Game Setup</h1>
                    <Button
                        className='bg-blue-700 hover:bg-blue-500'
                        type='submit'
                    >
                        Start Game
                    </Button>
                </div>
                <div className='space-y-4 flex flex-col'>
                    <div className='flex-1 basis-full'>
                        <h2 className='text-xl font-semibold'>
                            {activePlayer === "player1"
                                ? "Player 1"
                                : "Player 2"}
                        </h2>
                        <div className='flex gap-2 flex-wrap [perspective:1000px] min-h-96 mb-12 border rounded p-2'>
                            {currentList.map(card => (
                                <CardComp
                                    key={card.slug}
                                    onClick={() => handleCardClick(card.slug)}
                                    // @ts-expect-error - just need the card ui
                                    card={card}
                                />
                            ))}
                        </div>
                    </div>

                    <div className='flex-1 flex'>
                        <div className='mt-2 flex flex-wrap gap-2 w-full'>
                            {Object.entries(
                                formData[`${activePlayer}deck`]
                            ).map(([cardSlug, count]) => {
                                const card = cards.find(
                                    c => c.slug === cardSlug
                                );
                                return card ? (
                                    <div className='relative' key={card.slug}>
                                        <CardComp
                                            onClick={() =>
                                                handleCardClick(card.slug)
                                            }
                                            // @ts-expect-error - just need the card ui
                                            card={card}
                                        />
                                        <span className='absolute top-0 right-0 px-3 py-1 bg-neutral-700 text-white rounded-full'>
                                            {count}
                                        </span>
                                    </div>
                                ) : null;
                            })}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <DeckStats deck={formData[`${activePlayer}deck`]} />
                            <div className='mt-2 flex flex-wrap gap-2 content-start w-full'>
                                {Object.entries(
                                    formData[`${activePlayer}deck`]
                                ).map(([card, count]) => (
                                    <div
                                        key={card}
                                        className='flex items-center rounded-lg px-3 py-1 text-sm bg-neutral-800 shadow-md h-fit'
                                    >
                                        {card} ({count})
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            className='p-0 aspect-square'
                                            onClick={e => {
                                                e.preventDefault();
                                                adjustCardCount(
                                                    activePlayer,
                                                    card,
                                                    -1
                                                );
                                            }}
                                        >
                                            <Minus className='h-3 w-3' />
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={e => {
                                                e.preventDefault();
                                                adjustCardCount(
                                                    activePlayer,
                                                    card,
                                                    1
                                                );
                                            }}
                                        >
                                            <Plus className='h-3 w-3' />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
