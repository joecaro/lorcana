"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Minus, Plus } from "lucide-react";
import useGameStore from "@/lib/lorcana/store";
import { GameCard } from "../card-maker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeckStats from "./deck-stats";

type PlayerDeck = { [key: string]: number };

export function GameSetupComponent() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        player1is: "human",
        player1deck: {} as PlayerDeck,
        player2is: "ai",
        player2deck: {} as PlayerDeck,
    });
    const [activePlayer, setActivePlayer] = useState("player1");
    const [cardSearch, setCardSearch] = useState("");

    const cards = useGameStore(state => state.allCards);

    const handleSelectChange = (name: string, value: string) =>
        setFormData({ ...formData, [name]: value });

    const handleCardSelect = (player: "player1" | "player2", card: string) => {
        const currentDeck = { ...formData[`${player}deck`] };
        currentDeck[card] = (currentDeck[card] || 0) + 1;
        setFormData({ ...formData, [`${player}deck`]: currentDeck });
    };

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
        // if (
        //     Object.keys(formData.player1deck).length < 10 ||
        //     Object.keys(formData.player2deck).length < 10
        // ) {
        //     toast(
        //         "Invalid Deck. Please select at least 10 cards for each player."
        //     );
        //     return;
        // }

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

    const renderPlayerTab = (player: "player1" | "player2") => (
        <div className='md:flex'>
            <div className='flex-1'>
                <Label>Deck (select cards)</Label>
                <Input
                    type='text'
                    className="my-2"
                    onChange={e => setCardSearch(e.currentTarget.value)}
                />
                <div className='h-80 overflow-y-auto grid grid-cols-2 gap-2'>
                    {cards
                        .filter(
                            card =>
                                card.name
                                    .toLowerCase()
                                    .includes(cardSearch.toLowerCase()) ||
                                card.slug
                                    .toLowerCase()
                                    .includes(cardSearch.toLowerCase())
                        )
                        .map(card => (
                            <Button
                                key={card.slug}
                                onClick={() =>
                                    handleCardSelect(player, card.slug)
                                }
                                className='h-40 w-28 p-0'
                            >
                                <GameCard
                                    {...card}
                                    id=''
                                    owner=''
                                    exerted={false}
                                    zone='hand'
                                    turnPlayed={0}
                                    strengthModifier={0}
                                    willpowerModifier={0}
                                    isFoil={false}
                                />
                            </Button>
                        ))}
                </div>
            </div>
            <div className='flex-1 flex justify-between'>
                <div className='flex-1 w-full border p-1'>
                    <h2 className='text-xl font-semibold'>
                        {player === "player1" ? "Player 1" : "Player 2"}
                    </h2>
                    <div>
                        <Label>Player Type</Label>
                        <RadioGroup
                            value={formData[`${player}is`]}
                            onValueChange={value =>
                                handleSelectChange(`${player}is`, value)
                            }
                        >
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem
                                    value='human'
                                    id={`${player}-human`}
                                    className='bg-neutral-300'
                                    checked={
                                        formData[`${player}is`] === "human"
                                    }
                                />
                                <Label htmlFor={`${player}-human`}>Human</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem
                                    value='ai'
                                    id={`${player}-ai`}
                                    className='bg-neutral-300'
                                    checked={formData[`${player}is`] === "ai"}
                                />
                                <Label htmlFor={`${player}-ai`}>AI</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className='mt-2 h-80 overflow-y-auto  flex flex-wrap content-start gap-2'>
                        {Object.entries(formData[`${player}deck`]).map(
                            ([card, count]) => (
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
                                            adjustCardCount(player, card, -1);
                                        }}
                                    >
                                        <Minus className='h-3 w-3' />
                                    </Button>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={e => {
                                            e.preventDefault();
                                            adjustCardCount(player, card, 1);
                                        }}
                                    >
                                        <Plus className='h-3 w-3' />
                                    </Button>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <DeckStats deck={formData[`${player}deck`]} />
            </div>
        </div>
    );

    return (
        <div className='container p-4 mx-auto'>
            <h1 className='text-2xl font-bold mb-4'>Game Setup</h1>
            <Tabs value={activePlayer} onValueChange={setActivePlayer}>
                <TabsList className='grid grid-cols-2 bg-neutral-900'>
                    <TabsTrigger
                        className='bg-neutral-900 text-white data-[state=active]:bg-neutral-600 data-[state=active]:text-white'
                        value='player1'
                    >
                        Player 1
                    </TabsTrigger>
                    <TabsTrigger
                        className='bg-neutral-900 text-white data-[state=active]:bg-neutral-600 data-[state=active]:text-white'
                        value='player2'
                    >
                        Player 2
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='player1'>
                    {renderPlayerTab("player1")}
                </TabsContent>
                <TabsContent value='player2'>
                    {renderPlayerTab("player2")}
                </TabsContent>
            </Tabs>
            <Button type='submit' onClick={handleSubmit} className='w-full'>
                Start Game
            </Button>
        </div>
    );
}
