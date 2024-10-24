"use client";

import React, { useState } from "react";
import CardComp from "@/components/lorcana/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/lib/lorcana/types/game";

export default function Page() {
    const [card, setCard] = useState<Card>({
        implemented: true,
        slug: "card",
        id: "1",
        url: "/cards/vinebound-titan.jpg",
        name: "VINEBOUND TITAN",
        title: "Master of the Elements",
        characteristics: ["storyborn", "sorcerer"],
        text: [],
        type: "character",
        flavor:
            "The Storm Enchanter is a master of the elements, able to command very skies.",
        inkwell: true,
        color: "amethyst",
        cost: 5,
        strength: 4,
        willpower: 3,
        willpowerModifier: -1,
        strengthModifier: 2,
        loreModifier: 1,
        lore: 2,
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        isFoil: true,
        foilUrl: "/foil/splatter.jpg",
        abilities: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        exerted: false,
        zone: "deck",
        owner: "player",
        modifiers: [],
        turnPlayed: null,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setCard(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string) => (checked: boolean) => {
        setCard(prev => ({ ...prev, [name]: checked }));
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setCard(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange =
        (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.split(",").map(item => item.trim());
            setCard(prev => ({ ...prev, [name]: value }));
        };

    return (
        <div className='flex flex-col md:flex-row gap-8 p-8'>
            <div className='w-full md:w-1/2 space-y-4'>
                <h2 className='text-2xl font-bold mb-4'>Card Editor</h2>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <Label htmlFor='name'>Name</Label>
                        <Input
                            id='name'
                            name='name'
                            value={card.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='title'>Title</Label>
                        <Input
                            id='title'
                            name='title'
                            value={card.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='characteristics'>
                            Characteristics (comma-separated)
                        </Label>
                        <Input
                            id='characteristics'
                            name='characteristics'
                            value={card.characteristics.join(", ")}
                            onChange={handleArrayChange("characteristics")}
                        />
                    </div>
                    <div>
                        <Label htmlFor='type'>Type</Label>
                        <Input
                            id='type'
                            name='type'
                            value={card.type}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='col-span-2'>
                        <Label htmlFor='text'>
                            Text (comma-separated for multiple lines)
                        </Label>
                        <Input
                            id='text'
                            name='text'
                            value={card.text.join(", ")}
                            onChange={handleArrayChange("text")}
                        />
                    </div>
                    <div className='col-span-2'>
                        <Label htmlFor='flavor'>flavor Text</Label>
                        <Textarea
                            id='flavor'
                            name='flavor'
                            value={card.flavor}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='color'>Color</Label>
                        <Select
                            name='color'
                            value={card.color}
                            onValueChange={handleSelectChange("color")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select color' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='amber'>Amber</SelectItem>
                                <SelectItem value='amethyst'>
                                    Amethyst
                                </SelectItem>
                                <SelectItem value='emerald'>Emerald</SelectItem>
                                <SelectItem value='ruby'>Ruby</SelectItem>
                                <SelectItem value='sapphire'>
                                    Sapphire
                                </SelectItem>
                                <SelectItem value='steel'>Steel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor='cost'>Cost</Label>
                        <Input
                            id='cost'
                            name='cost'
                            type='number'
                            value={card.cost}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='strength'>Strength</Label>
                        <Input
                            id='strength'
                            name='strength'
                            type='number'
                            value={card.strength}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='willpower'>Willpower</Label>
                        <Input
                            id='willpower'
                            name='willpower'
                            type='number'
                            value={card.willpower}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='strengthModifier'>
                            Strength Modifier
                        </Label>
                        <Input
                            id='strengthModifier'
                            name='strengthModifier'
                            type='number'
                            value={card.strengthModifier}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='willpowerModifier'>
                            Willpower Modifier
                        </Label>
                        <Input
                            id='willpowerModifier'
                            name='willpowerModifier'
                            type='number'
                            value={card.willpowerModifier}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='lore'>Lore</Label>
                        <Input
                            id='lore'
                            name='lore'
                            type='number'
                            value={card.lore}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='illustrator'>Illustrator</Label>
                        <Input
                            id='illustrator'
                            name='illustrator'
                            value={card.illustrator}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='language'>Language</Label>
                        <Input
                            id='language'
                            name='language'
                            value={card.language}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='number'>Number</Label>
                        <Input
                            id='number'
                            name='number'
                            type='number'
                            value={card.number}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='set'>Set</Label>
                        <Input
                            id='set'
                            name='set'
                            value={card.set}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='rarity'>Rarity</Label>
                        <Select
                            name='rarity'
                            value={card.rarity}
                            onValueChange={handleSelectChange("rarity")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select rarity' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='common'>Common</SelectItem>
                                <SelectItem value='uncommon'>
                                    Uncommon
                                </SelectItem>
                                <SelectItem value='rare'>Rare</SelectItem>
                                <SelectItem value='super rare'>
                                    Super Rare
                                </SelectItem>
                                <SelectItem value='legendary'>
                                    Legendary
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor='url'>Image URL</Label>
                        <Input
                            id='url'
                            name='url'
                            value={card.url}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor='foilUrl'>Foil Image URL</Label>
                        <Input
                            id='foilUrl'
                            name='foilUrl'
                            value={card.foilUrl}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='flex items-center space-x-2'>
                    <Switch
                        id='inkwell'
                        checked={card.inkwell}
                        onCheckedChange={handleSwitchChange("inkwell")}
                    />
                    <Label htmlFor='inkwell'>Inkwell</Label>
                </div>
                <div className='flex items-center space-x-2'>
                    <Switch
                        id='isFoil'
                        checked={card.isFoil}
                        onCheckedChange={handleSwitchChange("isFoil")}
                    />
                    <Label htmlFor='isFoil'>Is Foil</Label>
                </div>
            </div>
            <div className='w-full md:w-1/2'>
                <h2 className='text-2xl font-bold mb-4'>Card Preview</h2>
                <div className='w-full h-full flex justify-center items-center [perspective:800px]'>
                    <CardComp style={{ scale: 3 }} card={card} />
                </div>
            </div>
        </div>
    );
}
