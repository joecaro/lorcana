import { BaseCard } from "../../types/game";
import {
    createChallengerText,
} from "../utils/cards";

const AmethystCards: BaseCard[] = [
    {
        implemented: true,
        slug: "dr-facilier-charlatan",
        url: "/cards/dr-facilier-charlatan.jpg",
        name: "Dr. Facilier",
        title: "Charlatan",
        characteristics: ["sorcerer", "storyborn", "villain"],
        text: [createChallengerText(2)],
        type: "character",
        strength: 0,
        flavour: "“Enchant\xe9e. A tip of the hat from Dr. Facilier.”",
        inkwell: true,
        color: "amethyst",
        cost: 2,
        willpower: 4,
        lore: 1,
        language: "EN",
        illustrator: "Grace Tran",
        number: 38,
        set: "TFC",
        rarity: "common",
        modifiers: [
            {
                type: "challenge",
                stat: "willpower",
                value: 2,
                duration: "permanent",
                turnApplied: 0,
                hasTriggered: true,
            },
        ],
        abilities: [],
        staticAbilities: {
            challenger: { active: true, value: 2 },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless : { active: false },
        },
    },
];

export default AmethystCards;
