import { BaseCard } from "../../types/game";
import {
    evasiveText,
    generateActionChecks,
    generateActions,
    generateTriggers,
} from "../utils/cards";

const RubyCards: BaseCard[] = [
    {
        implemented: true,
        url: "/cards/pongo-ol-rascal.jpg",
        name: "Pongo",
        title: "Ol' Rascal",
        characteristics: ["hero", "storyborn"],
        text: [evasiveText],
        type: "character",
        flavour:
            "“At first I had no particular plan, just anything to attract attention. You know, stir things up a bit.”",
        inkwell: true,
        color: "ruby",
        cost: 4,
        strength: 2,
        willpower: 3,
        lore: 2,
        language: "EN",
        illustrator: "Brian Weisz",
        number: 120,
        set: "TFC",
        rarity: "common",
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({}),
        modifiers: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: true },
            resist: { active: false },
            sing: { active: true },
        },
    },
];

export default RubyCards;
