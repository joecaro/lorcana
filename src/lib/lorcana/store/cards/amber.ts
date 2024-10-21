import { BaseCard } from "../../types/game";
import { moveCardToZoneReturnState } from "../actions";
import { chooseCardFromZonToZone } from "../utils/abilities";
import { createSingerText } from "../utils/cards";

const AmberCards: BaseCard[] = [
    {
        url: "/cards/ariel-on-human-legs.jpg",
        slug: "ariel-on-human-legs",
        name: "Ariel",
        title: "On Human Legs",
        characteristics: ["hero", "storyborn", "princess"],
        text: ["**VOICELESS** This character can't ↷ to sing songs."],
        type: "character",
        flavour: '". . ."',
        inkwell: true,
        color: "amber",
        cost: 4,
        strength: 3,
        willpower: 4,
        lore: 2,
        language: "EN",
        illustrator: "Matthew Robert Davies",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        implemented: true,
        modifiers: [],
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        implemented: true,
        slug: "ariel-spectacular-singer",
        url: "/cards/ariel-spectacular-singer.jpg",
        name: "Ariel",
        title: "Spectacular Singer",
        characteristics: ["hero", "storyborn", "princess"],
        text: [
            createSingerText(5),
            // "~~MUSICAL DEBUT~~ When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
        ],
        type: "character",
        inkwell: true,
        color: "amber",
        cost: 3,
        strength: 2,
        willpower: 3,
        lore: 1,
        language: "EN",
        illustrator: "Alice Pisoni",
        set: "TFC",
        rarity: "super rare",
        modifiers: [],
        number: 2,
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true, value: 5 },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        implemented: true,
        slug: "hades-lord-of-the-underworld",
        url: "/cards/hades-lord-of-the-underworld.jpg",
        name: "Hades",
        title: "Lord of the Underworld",
        characteristics: ["storyborn", "villain", "deity"],
        text: [
            "~~WELL OF SOULS~~ When you play this character, return a character card from your discard to your hand.",
        ],
        type: "character",
        inkwell: false,
        flavour:
            '"Production is up, costs are down, the rivers are full. Time to talk expansion."',
        color: "amber",
        cost: 4,
        strength: 3,
        willpower: 2,
        lore: 1,
        language: "EN",
        illustrator: "Randy Bishop",
        number: 6,
        set: "TFC",
        rarity: "rare",
        modifiers: [],
        abilities: [chooseCardFromZonToZone("discard", "hand", "play")],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        implemented: true,
        slug: "dalmation-puppy-tail-wagger",
        url: "/cards/dalmation-puppy-tail-wagger.jpg",
        name: "Dalmatian Puppy",
        title: "Tail Wagger",
        characteristics: ["storyborn", "puppy"],
        text: [
            "**WHERE DID THEY ALL COME FROM?** You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.",
        ],
        type: "character",
        flavour: "First they steal your heart. Then they steal your chair.",
        inkwell: true,
        color: "amber",
        cost: 2,
        strength: 2,
        willpower: 3,
        lore: 1,
        language: "EN",
        illustrator: "Kapik",
        number: 4,
        set: "ITI",
        rarity: "common",
        modifiers: [],
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        implemented: true,
        slug: "perdita-devoted-mother",
        url: "/cards/perdita-devoted-mother.jpg",
        name: "Perdita",
        title: "Devoted Mother",
        characteristics: ["hero", "storyborn"],
        text: [
            "~~COME ALONG, CHILDREN~~ When you play this character and whenever she quests, you may play a character with cost 2 or less from your discard for free.",
        ],
        type: "character",
        inkwell: false,
        flavour: "Her pups will follow her anywhere.",
        color: "amber",
        cost: 6,
        strength: 1,
        willpower: 6,
        lore: 2,
        language: "EN",
        illustrator: "Defne T\xf6z\xfcm / Livio Cacciatore",
        number: 15,
        set: "ITI",
        rarity: "legendary",
        modifiers: [],
        abilities: [
            {
                type: "triggered",
                trigger: "play",
                options: {
                    zone: "discard",
                    player: "attacker",
                    match: { type: "character", cost: 2 },
                },
                condition: () => {
                    return true;
                },
                callback: (gameState, selectedCard) => {
                    const newGameState = selectedCard
                        ? moveCardToZoneReturnState(
                              gameState,
                              "discard",
                              "field",
                              selectedCard
                          )
                        : { ...gameState };
                    return { ...newGameState };
                },
            },
            {
                type: "triggered",
                trigger: "quest",
                options: {
                    zone: "discard",
                    player: "attacker",
                    match: { type: "character", cost: 2 },
                },
                condition: (_, eventCard, thisCard) => {
                    return eventCard?.id === thisCard.id;
                },
                callback: (gameState, selectedCard) => {
                    const newGameState = selectedCard
                        ? moveCardToZoneReturnState(
                              gameState,
                              "discard",
                              "field",
                              selectedCard
                          )
                        : { ...gameState };
                    return { ...newGameState };
                },
            },
        ],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        implemented: true,
        slug: "patch-little-menace",
        url: "/cards/patch-intimidating-puppy.jpg",
        name: "Patch",
        title: "Little Menace",
        characteristics: ["storyborn", "puppy"],
        text: [
            "~~BARK~~ ↷ – Chosen character gets -2 ※ until the start of your next turn.",
        ],
        type: "character",
        flavour: "Fast like lightning, and ready to take on any bad guy.",
        inkwell: true,
        color: "amber",
        cost: 4,
        strength: 3,
        willpower: 4,
        lore: 1,
        language: "EN",
        illustrator: "Ellie Horie",
        number: 14,
        set: "ITI",
        rarity: "common",
        modifiers: [],
        abilities: [
            {
                type: "user-initiated",
                name: "BARK",
                prompt: "Choose a character to effect",
                options: {
                    zone: "field",
                    player: "defender",
                    match: { type: "character" },
                },
                actionCheck: () => {
                    return true;
                },
                callback: (gameState, selectedCard) => {
                    selectedCard?.modifiers.push({
                        type: "challenge",
                        stat: "willpower",
                        value: -2,
                        duration: "until_end_of_next_turn",
                        turnApplied: gameState.turn,
                        hasTriggered: false,
                    });

                    return { ...gameState, inputStage: null };
                },
            },
        ],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        implemented: false,
        slug: "goofy-musketeer",
        url: "https://six-inks.pages.dev/assets/images/cards/EN/001/4.webp",
        name: "Goofy",
        title: "Musketeer",
        characteristics: ["hero", "dreamborn", "musketeer"],
        text: [
            "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
            "~~AND TWO FOR TEA!~~ When you play this character, you may remove up to 2 damage from each of your Musketeer characters.",
        ],
        type: "character",
        abilities: [
            {
                type: "triggered",
                trigger: "play",
                condition: (_, eventCard, thisCard) => {
                    return eventCard?.id === thisCard.id;
                },
                effect: {
                    type: "heal",
                    amount: 2,
                    target: {
                        type: "character",
                        owner: "self",
                    },
                    filter: {
                        characteristics: ["musketeer"],
                    },
                },
            },
        ],
        flavour: "„En gawrsh!“",
        inkwell: true,
        color: "amber",
        cost: 5,
        strength: 3,
        willpower: 6,
        lore: 1,
        language: "EN",
        illustrator: "Jochem Van Gool",
        number: 4,
        set: "TFC",
        rarity: "uncommon",
        staticAbilities: {
            evasive: { active: false },
            resist: { active: false },
            challenger: { active: false },
            sing: { active: true },
            bodyguard: { active: true },
            reckless: { active: false },
        },
        modifiers: [],
    },
    {
        implemented: false,
        slug: "heihei-boat-snack",
        url: "https://six-inks.pages.dev/assets/images/cards/EN/001/7.webp",
        name: "Heihei",
        title: "Boat Snack",
        characteristics: ["storyborn", "ally"],
        text: [
            "**Support** _(Whenever this character quests, you may add their ※ to another chosen character's ※ this turn.)_",
        ],
        type: "character",
        flavour:
            "Sometimes, our strengths lie beneath the surface.\x03Far beneath, in some cases. . . .“<br />\x03−Moana",
        inkwell: true,
        color: "amber",
        cost: 1,
        strength: 1,
        willpower: 2,
        lore: 1,
        language: "EN",
        illustrator: "Jenna Gray",
        number: 7,
        set: "TFC",
        rarity: "common",
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        modifiers: [],
    },
];

export default AmberCards;
