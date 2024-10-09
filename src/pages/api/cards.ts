// basic nextjs api route

import { NextApiRequest, NextApiResponse } from "next";

const RUBY = [
    {
        Nickname: "Sisu - Daring Visitor",
    },
    {
        Nickname: "Goofy - Super Goof",
    },
    {
        Nickname: "Prince Eric - Expert Helmsman",
    },
    {
        Nickname: "Tong - Survivor",
    },
    {
        Nickname: "Rancis Fluggerbutter - Chocolate Charger",
    },
    {
        Nickname: "Scar - Betrayer",
    },
    {
        Nickname: "Hercules - Daring Demigod",
    },
    {
        Nickname: "Beast - Wounded",
    },
    {
        Nickname: "A Pirates Life",
    },
    {
        Nickname: "Vitalisphere",
    },
    {
        Nickname: "Training Grounds - Impossible Pillar",
    },
    {
        Nickname: "Training Grounds - Impossible Pillar",
    },
    {
        Nickname: "Snuggly Duckling - Disreputable Pub",
    },
    {
        Nickname: "Lumiere - Fiery Friend",
    },
    {
        Nickname: "Lumiere - Fiery Friend",
    },
    {
        Nickname: "Milo Thatch - Spirited Scholar",
    },
    {
        Nickname: "Li Shang - Imperial Captain",
    },
    {
        Nickname: "Aladdin - Street Rat",
    },
    {
        Nickname: "Fa Zhou - Mulan's Father",
    },
    {
        Nickname: "Pegasus - Flying Steed",
    },
    {
        Nickname: "The Plank",
    },
];

const EMERALD = [
    {
        Nickname: "Zeus - Mr. Lightning Bolts",
    },
    {
        Nickname: "Zazu - Advisor to Mufasa",
    },
    {
        Nickname: "Panic - Immortal Sidekick",
    },
    {
        Nickname: "Airfoil",
    },
    {
        Nickname: "The Fates - Only One Eye",
    },
    {
        Nickname: "The Fates - Only One Eye",
    },
    {
        Nickname: "The Fates - Only One Eye",
    },
    {
        Nickname: "Signed Contract",
    },
    {
        Nickname: "Diablo - Maleficents Spy",
    },
    {
        Nickname: "Hidden Inkcaster",
    },
    {
        Nickname: "Hera - Queen of the Gods",
    },
    {
        Nickname: "Flynn Rider - Charming Rogue",
    },
    {
        Nickname: "Flynn Rider - Confident Vagabond",
    },
    {
        Nickname: "We Dont Talk About Bruno",
    },
    {
        Nickname: "Megara - Liberated One",
    },
    {
        Nickname: "Megara - Pulling the Strings",
    },
    {
        Nickname: "Pegasus - Cloud Racer",
    },
    {
        Nickname: "Jasmine - Desert Warrior",
    },
    {
        Nickname: "Tor - Florist",
    },
    {
        Nickname: "Dodge!",
    },
    {
        Nickname: "Ursulas Trickery",
    },
];

const AMBER = [
    {
        Nickname: "Daisy Duck - Lovely Lady",
    },
    {
        Nickname: "Miss Bianca - Rescue Aid Society Agent",
    },
    {
        Nickname: "Donald Duck - Musketeer Soldier",
    },
    {
        Nickname: "Mickey Mouse - Friendly Face",
    },
    {
        Nickname: "Simba - Protective Cub",
    },
    {
        Nickname: "Ariel - Singing Mermaid",
    },
    {
        Nickname: "Max - Loyal Sheepdog",
    },
    {
        Nickname: "Max - Loyal Sheepdog",
    },
    {
        Nickname: "Mickey Mouse - Leader of the Band",
    },
    {
        Nickname: "Agustin Madrigal - Clumsy Dad",
    },
    {
        Nickname: "Agustin Madrigal - Clumsy Dad",
    },
    {
        Nickname: "Prince Eric - Seafaring Prince",
    },
    {
        Nickname: "Mirabel Madrigal - Prophecy Finder",
    },
    {
        Nickname: "Félix Madrigal - Fun-Loving Family Man",
    },
    {
        Nickname: "Julieta Madrigal - Excellent Cook",
    },
    {
        Nickname: "Cogsworth - Majordomo",
    },
    {
        Nickname: "Atlantica - Concert Hall",
    },
    {
        Nickname: "Atlantica - Concert Hall",
    },
];

const SAPPHIRE = [
    {
        Nickname: "Wendy Darling - Authority on Peter Pan",
    },
    {
        Nickname: "Maleficent - Sinister Visitor",
    },
    {
        Nickname: "Pascal - Inquisitive Pet",
    },
    {
        Nickname: "Tuk Tuk - Curious Partner",
    },
    {
        Nickname: "Hades - Meticulous Plotter",
    },
    {
        Nickname: "Hades - Meticulous Plotter",
    },
    {
        Nickname: "Hans - Noble Scoundrel",
    },
    {
        Nickname: "Anna - Braving the Storm",
    },
    {
        Nickname: "Anna - Braving the Storm",
    },
    {
        Nickname: "Ice Block",
    },
    {
        Nickname: "Ice Block",
    },
    {
        Nickname: "Scuttle - Expert on Humans",
    },
    {
        Nickname: "Rapunzel - Appreciative Artist",
    },
    {
        Nickname: "Ever as Before",
    },
    {
        Nickname: "Aurora - Tranquil Princess",
    },
    {
        Nickname: "Aurora - Tranquil Princess",
    },
    {
        Nickname: "Sisu - Wise Friend",
    },
    {
        Nickname: "Ariel - Treasure Collector",
    },
    {
        Nickname: "Caterpillar - Calm and Collected",
    },
    {
        Nickname: "Captain Amelia - First In Command",
    },
];

const AMETHYST = [
    {
        Nickname: "Casa Madrigal - Casita",
    },
    {
        Nickname: "Peter Pan - Shadow Finder",
    },
    {
        Nickname: "Elsa - Storm Chaser",
    },
    {
        Nickname: "Magic Broom - Lively Sweeper",
    },
    {
        Nickname: "Magical Maid - Feather Duster",
    },
    {
        Nickname: "Magic Broom - Illuminary Keeper",
    },
    {
        Nickname: "Magic Broom - Illuminary Keeper",
    },
    {
        Nickname: "Bruno Madrigal - Undetected Uncle",
    },
    {
        Nickname: "Archimedes - Electrified Owl",
    },
    {
        Nickname: "Peter Pans Shadow - Not Sewn On",
    },
    {
        Nickname: "Befuddle",
    },
    {
        Nickname: "Antonio Madrigal - Animal Expert",
    },
    {
        Nickname: "Croquet Mallet",
    },
    {
        Nickname: "Belle - Accomplished Mystic",
    },
    {
        Nickname: "Reflection",
    },
    {
        Nickname: "Isabela Madrigal - Golden Child",
    },
    {
        Nickname: "Swing Into Action",
    },
    {
        Nickname: "Ursula - Mad Sea Witch",
    },
    {
        Nickname: "Belle - Untrained Mystic",
    },
    {
        Nickname: "Rose Lantern",
    },
    {
        Nickname: "Flotsam & Jetsam - Entangling Eels",
    },
];

const STEEL = [
    {
        Nickname: "Hercules - Beloved Hero",
    },
    {
        Nickname: "Mickey Mouse - Standard Bearer",
    },
    {
        Nickname: "Ariel - Sonic Warrior",
    },
    {
        Nickname: "Ariel - Determined Mermaid",
    },
    {
        Nickname: "Li Shang - General's Son",
    },
    {
        Nickname: "Beast - Thick-Skinned",
    },
    {
        Nickname: "Beast - Thick-Skinned",
    },
    {
        Nickname: "Beast - Thick-Skinned",
    },
    {
        Nickname: "Luisa Madrigal - Rock of the Family",
    },
    {
        Nickname: "Mulan - Armored Fighter",
    },
    {
        Nickname: "Chien-Po - Imperial Soldier",
    },
    {
        Nickname: "Aladdin - Resolute Swordsman",
    },
    {
        Nickname: "Aladdin - Brave Rescuer",
    },
    {
        Nickname: "Last Cannon",
    },
    {
        Nickname: "I Find Em, I Flatten Em",
    },
    {
        Nickname: "Tritons Decree",
    },
    {
        Nickname: "Tritons Decree",
    },
    {
        Nickname: "Tritons Decree",
    },
    {
        Nickname: "Steel Chromicon",
    },
    {
        Nickname: "The Wall - Border Fortress",
    },
];

const colors: Record<string, { Nickname: string }[]> = {
    ruby: RUBY,
    emerald: EMERALD,
    amber: AMBER,
    sapphire: SAPPHIRE,
    amethyst: AMETHYST,
    steel: STEEL,
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const colorList = Array.isArray(req.query.color)
        ? req.query.color.filter(c => c && c in colors)
        : [req.query.color];

    if (!Array.isArray(colorList) || !colorList.every(c => c && c in colors)) {
        res.status(404).send("Color not found");
        return;
    }

    const print = (
        cards: {
            Nickname: string;
        }[]
    ) => {
        let str = "";
        const cardMap: Record<string, number> = {};

        cards.forEach(card => {
            if (cardMap[card.Nickname]) {
                cardMap[card.Nickname] += 1;
            } else {
                cardMap[card.Nickname] = 1;
            }
        });

        for (const card in cardMap) {
            str += `${cardMap[card]} ${card}\n`;
        }

        return str;
    };

    res.status(200).send(
        colorList.map(c => print(colors[c as keyof typeof colors])).join("")
    );
};

export default handler;
