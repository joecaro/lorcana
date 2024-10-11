import { BaseCard } from "../../types/game";
import {
    createChallengerText,
    generateActionChecks,
    generateActions,
    generateTriggers,
} from "../utils/cards";

const AmethystCards: BaseCard[] = [
    {
        implemented: true,
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
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({}),
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
        staticAbilities: {
            challenger: { active: true, value: 2 },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: true },
        },
    },
];

export default AmethystCards;
