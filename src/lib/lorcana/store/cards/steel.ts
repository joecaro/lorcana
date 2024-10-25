import { BaseCard } from "../../types/game";
import { damageCard, moveCardToZoneReturnState } from "../actions";
import {
    baseAbilityCheck,
    createBodyguardText,
    createChallengerText,
    createResistText,
    getAttackerFieldCharacters,
} from "../utils/cards";

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
        flavor: "“Oh ho! So the street rat found a sword and a backbone!” \n−Razoul",
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
    {
        implemented: true,
        slug: "aladdin-resolute-swordsman",
        url: "/cards/aladdin-resolute-swordsman.jpg",
        name: "Aladdin",
        title: "Resolute Swordsman",
        characteristics: ["hero", "storyborn"],
        type: "character",
        text: [],
        flavor: "“How about we cut to the part where I make a quick escape and you yell after me? No? Can't say I didn't give you a chance.",
        inkwell: true,
        color: "steel",
        cost: 1,
        strength: 3,
        willpower: 1,
        lore: 1,
        language: "EN",
        illustrator: "Randy Bishop",
        number: 172,
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
    {
        implemented: true,
        slug: "beast-thick-skinned",
        url: "/cards/beast-thick-skinned.jpg",
        name: "Beast",
        title: "Thick Skinned",
        characteristics: ["storyborn", "hero", "prince"],
        type: "character",
        text: [createResistText(1)],
        flavor: "“He's even tougher than he looks",
        inkwell: true,
        color: "steel",
        cost: 3,
        strength: 3,
        willpower: 2,
        lore: 1,
        language: "EN",
        illustrator: "Simangaliso Sibaya",
        number: 176,
        set: "TFC",
        rarity: "common",
        abilities: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: true, value: 1 },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        modifiers: [],
    },
    {
        slug: "robin-hood-beloved-outlaw",
        implemented: true,
        url: "/cards/robin-hood-beloved-outlaw.jpg",
        name: "Robin Hood",
        title: "Beloved Outlaw",
        characteristics: ["hero", "storyborn"],
        text: [],
        type: "character",
        flavor: "“You call this an ambush? Tsk, tsk. It's barely a bushwhack.”",
        inkwell: !0,
        color: "steel",
        cost: 1,
        strength: 2,
        willpower: 2,
        lore: 1,
        language: "EN",
        illustrator: "Valerio Buonfantino",
        number: 189,
        set: "ITI",
        rarity: "common",
        abilities: [],
        modifiers: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        slug: "kida-royal-warrior",
        implemented: true,
        url: "/cards/kida-royal-warrior.jpg",
        name: "Kida",
        title: "Royal Warrior",
        characteristics: ["hero", "storyborn", "princess"],
        text: [
            "~~Bodyguard~~ _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
        ],
        type: "character",
        abilities: [],
        flavor: "She’s seen strange things before, but nothing like this.",
        inkwell: true,
        color: "steel",
        cost: 2,
        strength: 2,
        willpower: 3,
        lore: 1,
        language: "EN",
        illustrator: "Carlos Ruiz",
        number: 177,
        set: "ITI",
        rarity: "common",
        modifiers: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: true },
            reckless: { active: false },
        },
    },
    {
        slug: "mickey-mouse-food-fight-defender",
        implemented: !0,
        url: "/cards/mickey-mouse-food-fight-defender.jpg",
        name: "Mickey Mouse",
        title: "Food Fight Defender",
        characteristics: ["hero", "storyborn"],
        text: [
            "~~Resist~~ +1 _(Damage dealt to this character is reduced by 1.)_",
        ],
        type: "character",
        abilities: [],
        flavor: "Underestimating him is a recipe for disaster.",
        inkwell: !0,
        color: "steel",
        cost: 1,
        strength: 1,
        willpower: 2,
        lore: 1,
        language: "EN",
        illustrator: "Mariana Moreno",
        number: 176,
        set: "SSK",
        rarity: "common",
        modifiers: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: true, value: 1 },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        slug: "ba-boom",
        url: "/cards/ba-boom.jpg",
        name: "Ba-Boom!",
        title: "",
        characteristics: ["action"],
        type: "action",
        text: ["Deal 2 damage to chosen character or location."],
        flavor: "Bigger than you average boom!",
        abilities: [
            {
                type: "user-initiated",
                actionCheck: () => true,
                name: "Deal 2 damage to chosen character or location.",
                prompt: "Choose a character or location to deal 2 damage to.",
                options: {
                    player: "opponent",
                    zone: "field",
                    match: { type: "character" },
                },
                callback: ({ gameState, selectedOption, thisCard }) => {
                    if (!selectedOption) {
                        return { ...gameState };
                    }

                    gameState = damageCard(gameState, selectedOption, 2);

                    gameState = moveCardToZoneReturnState(
                        gameState,
                        "hand",
                        "discard",
                        thisCard
                    );

                    return { ...gameState };
                },
            },
        ],
        color: "steel",
        cost: 2,
        inkwell: true,
        illustrator: "Heidi Neunhoffer",
        implemented: true,
        language: "EN",
        lore: 0,
        modifiers: [],
        number: 196,
        rarity: "common",
        set: "ITI",
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: false },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        strength: 0,
        willpower: 0,
    },
    {
        slug: "lythos-rock-titan",
        implemented: !0,
        url: "/cards/lythos-rock-titan.jpg",
        name: "Lythos",
        title: "Rock Titan",
        characteristics: ["storyborn", "titan"],
        text: [
            "**Resist** +2 _(Damage dealt to this character is reduced by 2.)_",
            "~~STONE SKIN~~ ↷ − Chosen character gains **Resist** +2 this turn.",
        ],
        type: "character",
        abilities: [
            {
                type: "user-initiated",
                actionCheck: gameState => {
                    return getAttackerFieldCharacters(gameState).length > 0;
                },
                prompt: "Choose a character to gain **Resist** +2 this turn.",
                name: "Stone Skin",
                options: {
                    player: "self",
                    zone: "field",
                    match: { type: "character" },
                },
                callback: ({ gameState, selectedOption }) => {
                    if (!selectedOption) {
                        return { ...gameState };
                    }

                    selectedOption.modifiers.push({
                        type: "challenge",
                        duration: "until_end_of_turn",
                        hasTriggered: false,
                        stat: "resist",
                        turnApplied: gameState.turn,
                        value: 2,
                    });
                    selectedOption.modifiers.push({
                        type: "challenged",
                        duration: "until_end_of_turn",
                        hasTriggered: false,
                        stat: "resist",
                        turnApplied: gameState.turn,
                        value: 2,
                    });

                    return { ...gameState };
                },
            },
        ],
        flavor: "“Crush Zeus!”",
        inkwell: !0,
        color: "steel",
        cost: 4,
        strength: 4,
        willpower: 1,
        lore: 1,
        language: "EN",
        illustrator: "Alice Pisoni",
        number: 180,
        set: "ITI",
        rarity: "uncommon",
        modifiers: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: true, value: 2 },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        slug: "helga-sinclair-right-hand-woman",
        implemented: !0,
        url: "/cards/helga-sinclair-right-hand-woman.jpg",
        name: "Helga Sinclair",
        title: "Right-Hand Woman",
        characteristics: ["villain", "storyborn"],
        text: [createChallengerText(2)],
        type: "character",
        abilities: [],
        flavor: '"That was an order, not a suggestion. Let\'s go!"',
        inkwell: !0,
        color: "steel",
        cost: 3,
        strength: 4,
        willpower: 3,
        lore: 1,
        illustrator: "Hasia Brzenzinska",
        number: 175,
        set: "ITI",
        language: "EN",
        rarity: "common",
        modifiers: [],
        staticAbilities: {
            challenger: { active: true, value: 2 },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        slug: "rise-of-the-titans",
        implemented: !0,
        url: "/cards/rise-of-the-titans.jpg",
        name: "Rise of the Titans",
        title: "",
        characteristics: ["action"],
        type: "action",
        text: ["Banish chosen location or item"],
        flavor: "“Oh, we're in trouble, big trouble!”",
        abilities: [
            {
                type: "user-initiated",
                actionCheck: () => true,
                name: "Banish chosen location or item",
                prompt: "Choose a location or item to banish.",
                options: {
                    player: "opponent",
                    zone: "field",
                    match: { type: "item" },
                },
                callback: ({ gameState, selectedOption }) => {
                    if (!selectedOption) {
                        return { ...gameState };
                    }

                    return moveCardToZoneReturnState(
                        gameState,
                        "field",
                        "discard",
                        selectedOption
                    );
                },
            },
        ],
        color: "steel",
        cost: 3,
        inkwell: true,
        illustrator: "Nicalo Saviori",
        language: "EN",
        lore: 0,
        modifiers: [],
        number: 198,
        rarity: "uncommon",
        set: "ITI",
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: false },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        strength: 0,
        willpower: 0,
    },
    {
        slug: "steel-chromicron",
        implemented: !0,
        url: "/cards/steel-chromicron.jpg",
        name: "STEEL CHROMICRON",
        title: "",
        characteristics: ["item"],
        type: "item",
        text: ["~~STEEL LIGHT~~ ↷ - Deal 1 damage to chosen character."],
        flavor: "“Oh, we're in trouble, big trouble!”",
        abilities: [
            {
                type: "user-initiated",
                actionCheck: (gamestate, thisCard) =>
                    !!baseAbilityCheck(gamestate, thisCard),
                name: "STEEL LIGHT",
                prompt: "Choose a character to damage.",
                options: {
                    player: "opponent",
                    zone: "field",
                    match: { type: "character" },
                },
                callback: ({ gameState, selectedOption }) => {
                    if (!selectedOption) {
                        return { ...gameState };
                    }

                    return damageCard(gameState, selectedOption, 1);
                },
            },
        ],
        color: "steel",
        cost: 6,
        inkwell: true,
        illustrator: "Dustin Panzino",
        language: "EN",
        lore: 0,
        modifiers: [],
        number: 202,
        rarity: "uncommon",
        set: "ITI",
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: false },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        strength: 0,
        willpower: 0,
    },
    {
        slug: "hercules-beloved-hero",
        implemented: true,
        url: "/cards/hercules-beloved-hero.jpg",
        name: "Hercules",
        title: "Beloved Hero",
        characteristics: ["storyborn", "hero", "prince"],
        text: [createBodyguardText(), createResistText(1)],
        type: "character",
        abilities: [],
        flavor: "",
        inkwell: true,
        color: "steel",
        cost: 6,
        strength: 5,
        willpower: 6,
        lore: 1,
        language: "EN",
        illustrator: "Leonardo Giammichele",
        number: 180,
        set: "ITI",
        rarity: "rare",
        modifiers: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: true, value: 1 },
            sing: { active: true },
            bodyguard: { active: true },
            reckless: { active: false },
        },
    },
];

export default SteelCards;
