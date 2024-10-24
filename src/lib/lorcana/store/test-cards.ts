import {
    baseAbilityCheck,
    createChallengerText,
    getAttackerFieldCharacters,
    getDefenderFieldCharacters,
    getDefenderFieldItems,
} from "./utils/cards";
import { BaseCard } from "../types/game";
import { findHealableCards } from "./utils";
import { damageCard, moveCardToZoneReturnState } from "./actions";
import AmberCards from "./cards/amber";
import AmethystCards from "./cards/amethyst";
import EmeraldCards from "./cards/emerald";
import RubyCards from "./cards/ruby";
import SteelCards from "./cards/steel";
import SapphireCards from "./cards/sapphire";
import {
    dealXDamageOnPlay,
    drawXCardOnPlay,
    healXDamageOnPlay,
} from "./utils/abilities";

const cards: BaseCard[] = [
    {
        implemented: true,
        slug: "rainey",
        url: "/cards/rainey.jpg",
        name: "RAINEY",
        title: "Gentle Fetcher",
        characteristics: ["princess", "good girl"],
        text: [
            "~~Fetch~~ - When this character enters play, draw a card.",
            "~~Rainey Day~~ ↷: Heal 1 damage for target character.",
        ],
        type: "character",
        flavor: "Rainey is a gentle fetcher, always ready to lend a helping paw.",
        inkwell: true,
        color: "amber",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 2,
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "JSC",
        rarity: "legendary",
        modifiers: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        abilities: [
            {
                type: "triggered",
                trigger: "play",
                condition: (_, eventCard, thisCard) =>
                    eventCard?.id === thisCard.id,
                effect: {
                    type: "draw",
                    amount: 1, // Draw 1 card
                    options: 1, // Draw 1 card from the deck
                    target: { type: "character", owner: "self" }, // Draw card effect
                },
            },
            {
                type: "user-initiated",
                name: "Rainey Day",
                prompt: "Choose a character to heal",
                options: {
                    zone: "field",
                    player: "self",
                    match: { type: "character" },
                },
                actionCheck: (gameState, thisCard) => {
                    if (!baseAbilityCheck(gameState, thisCard)) {
                        return false;
                    }
                    const healableCards = findHealableCards(gameState);
                    if (healableCards.length === 0) {
                        return false;
                    }
                    return true;
                },
                callback: (gameState, selectedCard) => {
                    if (selectedCard) {
                        selectedCard.strengthModifier = Math.min(
                            0,
                            (selectedCard.strengthModifier += 1)
                        );
                    }
                    return { ...gameState, inputStage: null };
                },
            },
        ],
    },
    {
        implemented: true,
        slug: "storm-enchanter",
        url: "/cards/storm-enchanter.jpg",
        name: "STORM ENCHANTER",
        title: "Master of the Elements",
        foilUrl: "/foil/storm-enchanter.jpg",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "~~Stormborn~~ - This character gains +1 willpower when challenging.",
        ],
        type: "character",
        flavor: "The Storm Enchanter is a master of the elements, able to command the very skies.",
        inkwell: true,
        color: "amethyst",
        cost: 5,
        strength: 4,
        willpower: 3,
        lore: 2,
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        abilities: [],
        modifiers: [
            {
                value: 1,
                duration: "permanent",
                stat: "willpower",
                type: "challenge",
                turnApplied: 0,
                hasTriggered: false,
            },
        ],
    },
    {
        implemented: true,
        slug: "dark-ritual",
        url: "/cards/dark-ritual.jpg",
        name: "DARK RITUAL",
        title: "Sinister Spell",
        characteristics: ["arcane", "dark magic"],
        text: [
            "~~Life Drain~~ - Sacrifice 2 strength from an allied character to deal 4 damage to an enemy character.",
        ],
        type: "action",
        flavor: "The price of power is always steep, demanding sacrifice for greater destruction.",
        inkwell: false,
        color: "amethyst",
        cost: 5,
        strength: 0, // Actions do not have inherent strength
        willpower: 0, // Actions do not have inherent willpower
        lore: 0, // Actions generally do not contribute to lore directly
        abilities: [
            {
                type: "user-initiated",
                name: "Life Drain",
                prompt: "Choose a character to sacrifice",
                options: {
                    zone: "field",
                    player: "self",
                    match: { type: "character" },
                },
                actionCheck: (gameState, thisCard) => {
                    if (!baseAbilityCheck(gameState, thisCard)) {
                        return false;
                    }
                    if (getAttackerFieldCharacters(gameState).length === 0) {
                        console.info("No characters to sacrifice");
                        return false;
                    }
                    return true; // Can trigger ability if there are characters to sacrifice
                },
                effect: {
                    type: "damage",
                    amount: 2,
                    target: { type: "character", owner: "self" },
                },
                multiPart: {
                    steps: [
                        {
                            effect: {
                                type: "damage",
                                amount: 4,
                                target: {
                                    type: "character",
                                    owner: "opponent",
                                },
                            },
                            prompt: "Choose a character to damage",
                            options: {
                                zone: "field",
                                player: "opponent",
                                match: { type: "character" },
                            },
                        },
                    ],
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
        illustrator: "GPT4o",
        language: "EN",
        number: 9,
        set: "JSC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "celestial-beacon",
        url: "/cards/celestial-beacon.jpg",
        name: "CELESTIAL BEACON",
        title: "Radiant Artifact",
        characteristics: ["artifact", "celestial"],
        text: [
            "~~Radiant Light~~ - All allies gain +1 lore while this item remains on the field.",
        ],
        type: "item",
        flavor: "A guiding light from the heavens, shining hope upon all who see it.",
        inkwell: true,
        color: "sapphire",
        cost: 4,
        strength: 0,
        willpower: 0,
        lore: 0,
        abilities: [
            {
                type: "triggered",
                trigger: "play",
                condition: (_, eventCard, thisCard) =>
                    !!eventCard && eventCard.id === thisCard.id,
                effect: {
                    type: "lore",
                    amount: 1,
                    target: { type: "character", owner: "self" },
                },
            },
            {
                type: "triggered",
                trigger: "discard",
                condition: (_, eventCard, thisCard) =>
                    !!eventCard && eventCard.id === thisCard.id,
                effect: {
                    type: "lore",
                    amount: -1,
                    target: { type: "character", owner: "self" },
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
        illustrator: "GPT4o",
        language: "EN",
        number: 8,
        set: "JSC",
        rarity: "rare",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "elven-scout",
        url: "/cards/elven-scout.jpg",
        name: "ELVEN SCOUT",
        title: "Nimble Tracker",
        characteristics: ["storyborn", "scout"],
        text: [
            "~~Warning Call~~ - When this character is played, look at the top 3 cards of your deck and move one to your hand.",
        ],
        type: "character",
        flavor: "Quick to find and quicker to warn, the Elven Scout is always one step ahead.",
        inkwell: true,
        color: "emerald",
        cost: 2,
        strength: 1,
        willpower: 2,
        lore: 1,
        abilities: [
            {
                type: "triggered",
                trigger: "play",
                condition: (_, eventCard, thisCard) =>
                    !!eventCard && eventCard.id === thisCard.id,
                options: {
                    match: { type: "character" },
                    zone: "deck",
                    player: "self",
                    count: 3,
                },
                prompt: "Choose a card to move to your hand",
                showDialog: true,
                callback: (gameState, selectedCard) => {
                    if (selectedCard) {
                        gameState = moveCardToZoneReturnState(
                            gameState,
                            "deck",
                            "hand",
                            selectedCard
                        );
                    }
                    gameState.inputStage = null;
                    return { ...gameState };
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
        illustrator: "GPT4o",
        language: "EN",
        number: 7,
        set: "JSC",
        rarity: "common",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "knight-of-valor",
        url: "/cards/knight-of-valor.jpg",
        name: "KNIGHT OF VALOR",
        title: "Noble Warrior",
        characteristics: ["storyborn", "knight"],
        text: [`~~Valor~~ - Charcter gains ${createChallengerText(1)}`],
        type: "character",
        flavor: "The Knight of Valor is a noble warrior, always ready to defend the innocent.",
        inkwell: true,
        color: "amber",
        cost: 3,
        strength: 3,
        willpower: 3,
        lore: 2,
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        modifiers: [
            {
                value: 1,
                duration: "permanent",
                stat: "willpower",
                type: "challenge",
                turnApplied: 0,
                hasTriggered: false,
            },
        ],
    },
    {
        implemented: true,
        slug: "blade-of-fury",
        url: "/cards/blade-of-fury.jpg",
        name: "BLADE OF FURY",
        title: "Enchanted Weapon",
        characteristics: ["enchanted", "weapon"],
        text: [
            "~~Empower~~ - Exert this item to give a friendly character +3 willpower for this turn.",
        ],
        type: "item",
        flavor: "The edge of this blade thirsts for battle, igniting its wielder’s fury.",
        inkwell: false,
        color: "ruby",
        cost: 3,
        strength: 0, // Item cards typically do not have inherent strength
        willpower: 0, // Item cards typically do not have inherent willpower
        lore: 0, // Items generally do not contribute to lore directly
        abilities: [
            {
                type: "user-initiated",
                name: "Empower",
                prompt: "Choose a character to empower",
                options: {
                    zone: "field",
                    player: "self",
                    match: { type: "character" },
                },
                actionCheck: (gameState, thisCard) => {
                    if (!baseAbilityCheck(gameState, thisCard)) {
                        return false;
                    }
                    if (getAttackerFieldCharacters(gameState).length === 0) {
                        console.info("No characters to empower");
                        return false;
                    }
                    return true;
                },
                effect: {
                    type: "buff",
                    modifierType: "challenge",
                    amount: 3,
                    stat: "willpower",
                    duration: "until_end_of_turn",
                    target: { type: "character", owner: "self" },
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
        illustrator: "GPT4o",
        language: "EN",
        number: 6,
        set: "JSC",
        rarity: "rare",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "ancient-protector",
        url: "/cards/ancient-protector.jpg",
        name: "ANCIENT PROTECTOR",
        title: "Guardian of the Old Realms",
        text: [
            "~~Rooted Defense~~ - All friendly characters gain Resist +1 as long as this character is on the field.",
        ],
        characteristics: ["storyborn", "guardian"],
        flavor: "A silent sentinel of nature, unwavering in its protection of the land.",
        type: "character",
        inkwell: true,
        color: "emerald",
        cost: 6,
        strength: 5,
        willpower: 7,
        lore: 3,
        abilities: [
            {
                type: "triggered",
                condition: (_, __, thisCard) => thisCard.zone === "field",
                trigger: "start_phase",
                effect: {
                    type: "buff",
                    modifierType: "challenged",
                    stat: "resist",
                    amount: 1,
                    duration: "until_end_of_turn",
                    target: { type: "character", owner: "self" },
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
        illustrator: "GPT4o",
        language: "EN",
        number: 5,
        set: "JSC",
        rarity: "rare",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "arcane-aprentice",
        url: "/cards/arcane-aprentice.jpg",
        name: "ARCANE APRENTICE",
        title: "Mystic Mage",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "~~Arcane Knowledge~~ - When this character enters play, draw a card.",
            "**Evasive** - Only characters with Evasive can challenge this character.",
        ],
        type: "character",
        flavor: "The Arcane Aprentice is a young mage, eager to learn the secrets of the universe.",
        inkwell: true,
        color: "amber",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 2,
        abilities: [drawXCardOnPlay(1)],
        staticAbilities: {
            evasive: { active: true },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "flamecaster",
        url: "/cards/flamecaster.jpg",
        name: "FLAMECASTER",
        title: "Fiery Fiend",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "~~Fiery Plume~~ - When this character enters play, deal 1 damage to target character.",
        ],
        type: "character",
        flavor: "Only those who have seen the flames of the Phoenix can truly understand the power of the Fireborn.",
        inkwell: true,
        color: "amber",
        cost: 4,
        strength: 3,
        willpower: 4,
        lore: 2,
        abilities: [dealXDamageOnPlay(1)],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "beacon",
        url: "/cards/beacon.jpg",
        name: "BEACON",
        title: "Guiding Light",
        characteristics: ["storyborn", "puppy"],
        text: [
            "~~Soothing Light~~ - When this character enters play, heal 1 damage from target character.",
            "**Loyal** - This character can't attack.",
            "~~Teef~~ - ↷: Take 1 ITEM from any player",
        ],
        type: "character",
        flavor: "The Beacon is a loyal companion, always ready to lend a helping paw.",
        inkwell: true,
        color: "amber",
        cost: 4,
        strength: 3,
        willpower: 4,
        lore: 2,
        abilities: [
            healXDamageOnPlay(1),
            {
                type: "user-initiated",
                name: "Teef",
                prompt: "Choose an item to steal",
                options: {
                    zone: "field",
                    player: "opponent",
                    match: { type: "item" },
                },
                actionCheck: (gameState, thisCard) => {
                    if (!baseAbilityCheck(gameState, thisCard)) {
                        return false;
                    }
                    if (getDefenderFieldItems(gameState).length === 0) {
                        console.info("No items to steal");
                        return false;
                    }
                    return true;
                },
                callback: (gameState, selectedCard) => {
                    if (selectedCard) {
                        gameState = moveCardToZoneReturnState(
                            gameState,
                            "field",
                            "hand",
                            selectedCard
                        );
                    }
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
        illustrator: "GPT4o",
        language: "EN",
        number: 2,
        set: "JSC",
        rarity: "legendary",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "theo",
        url: "/cards/theo.webp",
        name: "THEO",
        title: "Foot Licker",
        characteristics: [],
        text: ["~~Lick Feet~~ ↷ Gross out 1 character and deal 1 damage"],
        type: "character",
        flavor: "",
        color: "emerald",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
        inkwell: true,
        abilities: [
            {
                type: "user-initiated",
                name: "Lick Feet",
                prompt: "Choose a Character to Damage",
                actionCheck: (gameState, thisCard) => {
                    if (!baseAbilityCheck(gameState, thisCard)) {
                        return false;
                    }

                    return getDefenderFieldCharacters(gameState).length > 0;
                },
                options: {
                    match: { type: "character" },
                    player: "opponent",
                    zone: "field",
                },
                callback: (gameState, selectedCard) => {
                    return selectedCard
                        ? {
                              ...damageCard(gameState, selectedCard, 1),
                              inputStage: null,
                          }
                        : { ...gameState, inputStage: null };
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
        illustrator: "GPT4o",
        language: "EN",
        number: 10,
        set: "JSC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "sora",
        url: "/cards/sora.webp",
        name: "SORA",
        title: "Headstrong Pup",
        characteristics: [],
        text: [
            "~~Beach Zoomies~~ ↷ deal 3 damage to any character, but take 1 damage.",
            // TODO: Implement support for multiple abilities
            // "~~Sleep~~ ↷ to heal 1 strength.",
        ],
        type: "character",
        flavor: "",
        color: "steel",
        cost: 1,
        strength: 6,
        willpower: 1,
        lore: 1,
        inkwell: true,
        abilities: [
            {
                type: "user-initiated",
                name: "Beach Zoomies",
                prompt: "Choose a character to damage",
                options: {
                    match: { type: "character" },
                    player: "opponent",
                    zone: "field",
                },
                actionCheck: (gameState, thisCard) => {
                    if (!baseAbilityCheck(gameState, thisCard)) {
                        return false;
                    }

                    return getDefenderFieldCharacters(gameState).length > 0;
                },
                callback: (gameState, selectedCard, thisCard) => {
                    return selectedCard
                        ? {
                              ...damageCard(
                                  damageCard(gameState, selectedCard, 3),
                                  thisCard,
                                  1
                              ),
                              inputStage: null,
                          }
                        : { ...gameState, inputStage: null };
                },
            },
            {
                type: "user-initiated",
                name: "Sleep",
                actionCheck: (gameState, thisCard) => {
                    if (!baseAbilityCheck(gameState, thisCard)) {
                        return false;
                    }

                    return thisCard.strengthModifier < 0;
                },
                options: {
                    match: { name: "Sora" },
                    player: "self",
                    zone: "field",
                },
                effect: {
                    type: "heal",
                    amount: 1,
                    target: { type: "character", owner: "self", self: true },
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
        illustrator: "GPT4o",
        language: "EN",
        number: 10,
        set: "JSC",
        rarity: "uncommon",
        modifiers: [],
        // actionChecks: generateActionChecks({
        //     ability: (state, thisCard) => {
        //         if (!baseAbilityCheck(state, thisCard)) {
        //             return null;
        //         }

        //         return getDefenderFieldCharacters(state).length > 0
        //             ? {
        //                   type: "ability",
        //                   card: thisCard,
        //               }
        //             : null;
        //     },
        // }),
        // actions: generateActions({
        //     ability: (gameState, thisCard) => {
        //         useGameStore.setState(
        //             state => {
        //                 if (getDefenderFieldCharacters(state).length === 0) {
        //                     console.info("No characters to damage");
        //                     return state;
        //                 }

        //                 state.inputStage = {
        //                     type: "ability",
        //                     options: getDefenderFieldCharacters(state),
        //                     prompt: "Choose a character to damage",
        //                     callback: choice => {
        //                         useGameStore.setState(
        //                             state => {
        //                                 if (
        //                                     typeof choice === "string" ||
        //                                     Array.isArray(choice)
        //                                 ) {
        //                                     return state;
        //                                 }

        //                                 state.inputStage = null;

        //                                 return exertCard(
        //                                     damageCard(
        //                                         damageCard(state, choice, 2),
        //                                         thisCard,
        //                                         1
        //                                     ),
        //                                     thisCard
        //                                 );
        //                             },
        //                             false,
        //                             { type: "BEACH ZOOMIES" }
        //                         );
        //                     },
        //                 };

        //                 return { ...state };
        //             },
        //             false,
        //             { type: "CHOOSE BEACH ZOOMIES" }
        //         );

        //         return { ...gameState };
        //     },
        // }),
        // triggers: generateTriggers(),
    },
    {
        implemented: true,
        slug: "frost-warden",
        url: "/cards/frost-warden.jpg",
        name: "FROST WARDEN",
        title: "Guardian of the Frozen Realm",
        characteristics: ["storyborn", "warden"],
        text: [
            "~~Frozen Shield~~ - When this character enters play, prevent the next 2 damage dealt to any friendly character.",
        ],
        type: "character",
        flavor: "Standing against the tide of chaos, the Frost Warden protects all under its watch.",
        inkwell: true,
        color: "sapphire",
        cost: 4,
        strength: 2,
        willpower: 5,
        lore: 2,
        // actionChecks: generateActionChecks({}),
        // actions: generateActions({}),
        // triggers: generateTriggers({
        //     play: (gameState, thisCard, thatCard) => {
        //         if (thatCard?.id === thisCard.id) {
        //             gameState.players[gameState.currentPlayer].field.forEach(
        //                 card => {
        //                     card.modifiers.push({
        //                         value: 2,
        //                         duration: "until_damage_received",
        //                         stat: "strength",
        //                         type: "challenge",
        //                         turnApplied: gameState.turn,
        //                         hasTriggered: false,
        //                     });
        //                 }
        //             );
        //         }
        //         return { ...gameState };
        //     },
        // }),
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 10,
        set: "JSC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "sunforged-armor",
        url: "/cards/sunforged-armor.jpg",
        name: "SUNFORGED ARMOR",
        title: "Radiant Shield",
        characteristics: ["artifact", "armor"],
        text: [
            "~~Solar Resilience~~ - Exert this item to give a character +2 strength until the end of turn.",
        ],
        type: "item",
        flavor: "Forged in the heart of a dying star, it glows with the warmth of a thousand suns.",
        inkwell: true,
        color: "amber",
        cost: 3,
        strength: 0,
        willpower: 0,
        lore: 0,
        // actionChecks: generateActionChecks({
        //     ability: (gameState, thisCard) => {
        //         if (!baseAbilityCheck(gameState, thisCard)) {
        //             return null;
        //         }

        //         if (getAttackerFieldCharacters(gameState).length === 0) {
        //             console.info("No characters to buff");
        //             return null;
        //         }

        //         return {
        //             type: "ability",
        //             card: thisCard,
        //         };
        //     },
        // }),
        // actions: generateActions({
        //     ability: (gameState, thisCard) => {
        //         gameState.inputStage = {
        //             type: "ability",
        //             options: getAttackerFieldCharacters(gameState),
        //             prompt: "Choose a character to boost",
        //             callback: choice => {
        //                 useGameStore.setState(state => {
        //                     if (
        //                         typeof choice === "string" ||
        //                         Array.isArray(choice)
        //                     ) {
        //                         return state;
        //                     }

        //                     const currentPlayerIndex = state.currentPlayer;
        //                     const player = state.players[currentPlayerIndex];

        //                     // Find the target card on the player's field
        //                     const target = player.field.find(
        //                         card => card.id === choice.id
        //                     );
        //                     if (!target) return state;

        //                     // Create a new field array with the updated card modifiers
        //                     const updatedField = player.field.map(card =>
        //                         card.id === choice.id
        //                             ? {
        //                                   ...card,
        //                                   modifiers: card.modifiers.concat({
        //                                       value: 2,
        //                                       duration: "until_end_of_turn",
        //                                       stat: "strength",
        //                                       type: "challenge",
        //                                       turnApplied: state.turn,
        //                                       hasTriggered: false,
        //                                   }),
        //                               }
        //                             : card
        //                     );

        //                     // Update the player object immutably
        //                     const updatedPlayer = exertPlayerCard(
        //                         {
        //                             ...player,
        //                             field: updatedField,
        //                         },
        //                         thisCard
        //                     );

        //                     // Create a new players array with the updated player object
        //                     const updatedPlayers = state.players.map(
        //                         (p, index) =>
        //                             index === currentPlayerIndex
        //                                 ? updatedPlayer
        //                                 : p
        //                     );

        //                     // Return a new state object with the updated players and cleared input stage
        //                     return {
        //                         ...state,
        //                         players: updatedPlayers,
        //                         inputStage: null,
        //                     };
        //                 });
        //             },
        //         };
        //         return gameState;
        //     },
        // }),
        // triggers: generateTriggers({}),
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 11,
        set: "JSC",
        rarity: "rare",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "cindershadow-sorcerer",
        url: "/cards/cindershadow-sorcerer.jpg",
        name: "CINDERSHADOW SORCERER",
        title: "Wielder of Flames",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "~~Flame Conjure~~ - When this character enters play, deal 2 damage to all enemy characters.",
        ],
        type: "character",
        flavor: "From the darkness of the ash, the Cindershadow rises to incinerate all that opposes it.",
        inkwell: true,
        color: "ruby",
        cost: 5,
        strength: 4,
        willpower: 2,
        lore: 2,
        // actionChecks: generateActionChecks({}),
        // actions: generateActions({}),
        // triggers: generateTriggers({
        //     play: (gameState, thisCard, thatCard) => {
        //         if (thatCard?.id === thisCard.id) {
        //             gameState.players[
        //                 (gameState.currentPlayer + 1) % 2
        //             ].field.forEach(card => {
        //                 card.strength -= 2;
        //                 if (card.strength <= 0) {
        //                     gameState.players = moveToDiscard(gameState, card);
        //                 }
        //             });
        //         }
        //         return { ...gameState };
        //     },
        // }),
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 12,
        set: "JSC",
        rarity: "legendary",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "mystic-elder",
        url: "/cards/mystic-elder.jpg",
        name: "MYSTIC ELDER",
        title: "Sage of the Ages",
        characteristics: ["storyborn", "mage"],
        text: [
            "~~Arcane Insight~~ - When this character is played, look at the top 5 cards of your deck and rearrange them.",
        ],
        type: "character",
        flavor: "Time bends and knowledge flows from the mind of the Mystic Elder.",
        inkwell: true,
        color: "amethyst",
        cost: 4,
        strength: 2,
        willpower: 4,
        lore: 3,
        // actionChecks: generateActionChecks({}),
        // actions: generateActions({}),
        // triggers: generateTriggers({
        //     play: (gameState, thisCard, thatCard) => {
        //         if (thatCard?.id === thisCard.id) {
        //             const top5Cards = gameState.players[
        //                 gameState.currentPlayer
        //             ].deck.slice(0, 5);
        //             gameState.inputStage = {
        //                 type: "play",
        //                 options: top5Cards,
        //                 maxSelections: 5,
        //                 prompt: "Rearrange the top 5 cards of your deck",
        //                 // TODO: make this work plz
        //                 callback: newOrder => {
        //                     if (
        //                         typeof newOrder === "string" ||
        //                         !Array.isArray(newOrder) ||
        //                         newOrder.length !== 5
        //                     )
        //                         return gameState;
        //                     useGameStore.setState(state => {
        //                         state.players[state.currentPlayer].deck = [
        //                             ...newOrder,
        //                             ...state.players[
        //                                 state.currentPlayer
        //                             ].deck.slice(5),
        //                         ];
        //                         state.inputStage = null;
        //                         return { ...state };
        //                     });
        //                 },
        //             };
        //         }
        //         return { ...gameState };
        //     },
        // }),
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 13,
        set: "JSC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        slug: "vinebound-titan",
        url: "/cards/vinebound-titan.jpg",
        foilUrl: "/foil/vinebound-titan.jpg",
        name: "VINEBOUND TITAN",
        title: "Earthbound Juggernaut",
        characteristics: ["storyborn", "giant"],
        text: [
            "~~Entangling Vines~~ - When this character challenges, reduce the target's willpower by 2.",
        ],
        type: "character",
        flavor: "The Vinebound Titan crushes its foes with nature's unyielding force.",
        inkwell: false,
        color: "emerald",
        cost: 7,
        strength: 6,
        willpower: 6,
        lore: 1,
        abilities: [],
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 14,
        set: "JSC",
        rarity: "rare",
        modifiers: [
            {
                value: 3,
                duration: "permanent",
                stat: "strength",
                type: "challenge",
                turnApplied: 0,
                hasTriggered: false,
            },
        ],
    },
];

const mergedCards = [
    ...cards,
    ...AmberCards,
    ...AmethystCards,
    ...EmeraldCards,
    ...RubyCards,
    ...SapphireCards,
    ...SteelCards,
];
export default mergedCards;
