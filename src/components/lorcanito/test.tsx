"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useGameStore from "@/lib/lorcanito/store";
import { PLAYER_ACTIONS } from "@/lib/lorcanito/store/actions";
// import CardComp from "./card";
import { cn } from "@/lib/utils";
import { computeAvailableActions } from "@/lib/lorcanito/store/utils";

export default function TestPage() {
    const players = useGameStore(state => state.players);
    const currentPlayer = useGameStore(state => state.currentPlayer);
    const attackingPlayer = useGameStore(state => state.attacker);
    const inputStage = useGameStore(state => state.inputStage);

    const availableActions = computeAvailableActions(useGameStore.getState());

    return (
        <div>
            <h1>Test</h1>
            <p>Current player: {currentPlayer}</p>
            <p>Input State: {inputStage?.prompt}</p>
            <p>Players:</p>
            <div className='grid grid-cols-2 gap-6'>
                {players.map(player => (
                    <div key={player.id}>
                        <Card className='bg-black text-white p-4'>
                            <CardHeader>
                                <CardTitle>Player {player.id}</CardTitle>
                            </CardHeader>
                            <CardContent className='grid gap-4'>
                                <p>Deck: {player.deck.length} cards</p>
                                <p>Hand: {player.hand.length} cards</p>
                                <div className='flex flex-col items-stretch'>
                                    {player.hand.map(card => {
                                        const highlighted =
                                            inputStage &&
                                            inputStage.options.find(
                                                c =>
                                                    typeof c === "object" &&
                                                    c.id === card.id
                                            );
                                        return (
                                            // <CardComp key={card.id} card={card} />
                                            <Button
                                                key={card.id}
                                                className={cn(
                                                    "p-2 border border-neutral-100 rounded",
                                                    highlighted &&
                                                        "border-green-500"
                                                )}
                                                onClick={() => {
                                                    if (!inputStage) return;

                                                    if (highlighted) {
                                                        inputStage.callback(
                                                            card
                                                        );
                                                    }
                                                }}
                                            >
                                                <span>
                                                    {card.cost}--{card.name}--
                                                    {card.willpower}--
                                                    {card.strength}
                                                </span>
                                            </Button>
                                        );
                                    })}
                                </div>
                                <p>Inkwell: {player.availableInk}</p>
                                <p>Field: {player.field.length} cards</p>
                                <div className='flex flex-col items-stretch'>
                                    {player.field.map(card => {
                                        const highlighted =
                                            inputStage &&
                                            inputStage.options.find(
                                                c =>
                                                    typeof c === "object" &&
                                                    c.id === card.id
                                            );
                                        return (
                                            // <CardComp key={card.id} card={card} />
                                            <Button
                                                key={card.id}
                                                className={cn(
                                                    highlighted &&
                                                        "border-green-500"
                                                )}
                                                onClick={() => {
                                                    if (!inputStage) return;

                                                    if (highlighted) {
                                                        inputStage.callback(
                                                            card
                                                        );
                                                    }
                                                }}
                                            >
                                                <span>
                                                    {card.cost}--{card.name}--
                                                    {card.willpower}--
                                                    {card.strength}
                                                </span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
                <Card className='bg-black p-4 text-white flex flex-col gap-2 items-stretch absolute left-10 bottom-10'>
                    <div>
                        <h2>Actions</h2>
                        <ul className='w-full flex flex-col items-stretch'>
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
            </div>
        </div>
    );
}
