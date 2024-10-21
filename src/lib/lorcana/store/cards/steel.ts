import { BaseCard } from "../../types/game";

const SteelCards: BaseCard[] = [
    {
        implemented: true,
        slug: "aladdin-cornered-swordsman",
        url: "/cards/aladdin-cornered-swordsman.jpg",
        name: "Aladdin",
        title: "Cornered Swordsman",
        characteristics: ["hero", "storyborn"],
        type: "character",
        text: [],
        flavour:
            "“Oh ho! So the street rat found a sword and a backbone!” \n−Razoul",
        inkwell: true,
        color: "steel",
        cost: 2,
        strength: 2,
        willpower: 1,
        lore: 2,
        language: "EN",
        illustrator: "Randy Bishop",
        number: 171,
        set: "TFC",
        rarity: "common",
        abilities: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        modifiers: [],
    },
];

export default SteelCards;
