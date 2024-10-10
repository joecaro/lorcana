"use client";
import CardComp from "@/components/lorcana/card";
import React from "react";

const MyApp = () => {
    return (
        <div className='w-screen h-screen flex justify-center items-center [perspective:800px]'>
            <CardComp
                // @ts-expect-error - this is a test card
                card={{
                    implemented: true,
                    id: "1",
                    url: "/cards/ancient-protector.webp",
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
                    isFoil: true,
                    // foilUrl: "/foil/storm-enchanter.jpg",
                }}
            />
        </div>
    );
};

export default MyApp;
