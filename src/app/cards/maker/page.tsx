"use client";
import { MagicCard } from "@/components/card-maker";
import CardComp from "@/components/lorcanito/card";
import React from "react";

const MyApp = () => {
    return (
        <div className='p-10'>
            <MagicCard
                cardColor='amber'
                rarity='rare'
                name='ANCIENT PROTECTOR'
                title='Beloved Hero'
                strength={6}
                strengthModifier={-2}
                willpower={5}
                willpowerModifier={1}
                descriptions={[
                    "**Bodygaurd** (this character may enter play exerted and opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
                    "**Resist** +1 (damage deal to this character is reduced by 1.)",
                ]}
                artUrl='/herc.jpeg'
                type='Storyborn - Hero'
                footerLeftText={[
                    "OGW &#x2022; EN Wesley Burt",
                    "180/204 - EN - 4",
                ]}
                footerRightText={["Disney Lorcana &#169;Disney"]}
                lore={2}
                cardCost='4'
            />
            <CardComp
                // @ts-expect-error - this is a test card
                card={{
                    implemented: true,
                    id: "1",
                    url: "/cards/storm-enchanter.webp",
                    name: "STORM ENCHANTER",
                    title: "Master of the Elements",
                    characteristics: ["storyborn", "sorcerer"],
                    text: [
                        "**Stormborn** - This character gains +1 willpower when attacking.",
                    ],
                    type: "character",
                    flavour:
                        "The Storm Enchanter is a master of the elements, able to command the very skies.",
                    inkwell: true,
                    color: "amethyst",
                    cost: 5,
                    strength: 4,
                    willpower: 3,
                    willpowerModifier: -1,
                    strengthModifier: 2,
                    lore: 2,
                    illustrator: "GPT4o",
                    language: "EN",
                    number: 1,
                    set: "TFC",
                    rarity: "uncommon",
                }}
            />
        </div>
    );
};

export default MyApp;
