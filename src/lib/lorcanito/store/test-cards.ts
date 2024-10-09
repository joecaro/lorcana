import {
    generateActionChecks,
    generateActions,
    generateTriggers,
} from "./utils/cards";
import { BaseCard, Card, GameState } from "../types/game";
import { drawCard, findHealableCards } from "./utils";
import useGameStore from ".";
import { moveToDiscard } from "./actions";

const cards: BaseCard[] = [
    {
        implemented: true,
        url: "/cards/rainey.webp",
        name: "RAINEY",
        title: "Gentle Fetcher",
        characteristics: ["princess", "good girl"],
        text: [
            "**Fetch** - When this character enters play, draw a card.",
            "**Rainey Day** - ->: Heal 1 damage for target character.",
        ],
        type: "character",
        flavour:
            "Rainy is a gentle fetcher, always ready to lend a helping paw.",
        inkwell: true,
        color: "amber",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 2,
        actionChecks: generateActionChecks({}),
        actions: generateActions({
            ability: (gameState: GameState, thisCard: Card) => {
                const healabeCards = findHealableCards(gameState);
                if (healabeCards.length === 0) return gameState;
                gameState.inputStage = {
                    type: "play",
                    options: healabeCards,
                    prompt: "Choose a card to heal",
                    callback: choice => {
                        useGameStore.setState(
                            state => {
                                if (typeof choice === "string") return state;
                                const player =
                                    state.players[state.currentPlayer];
                                const target = player[choice.zone].find(
                                    card => card.id === choice.id
                                );
                                if (!target) return state;

                                player[choice.zone] = player[choice.zone].map(
                                    card =>
                                        card.id === choice.id
                                            ? {
                                                  ...card,
                                                  strength: card.strength + 1,
                                              }
                                            : card
                                );

                                state.inputStage = null;
                                return { ...state };
                            },
                            false,
                            { type: "Rainey Day" }
                        );
                    },
                };
                return gameState;
            },
        }),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    return drawCard(gameState, 1, gameState.attacker);
                }
                return gameState;
            },
        }),
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "JSC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        url: "/cards/storm-enchanter.webp",
        name: "STORM ENCHANTER",
        title: "Master of the Elements",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "**Stormborn** - This character gains +1 willpower when challenging.",
        ],
        type: "character",
        flavour:
            "The Storm Enchanter is a master of the elements, able to command the very skies.",
        inkwell: true,
        color: "amethyst",
        cost: 5,
        strength: 4,
        willpower: 3,
        lore: 2,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({}),
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        modifiers: [
            {
                value: 1,
                duration: "until_action",
                stat: "willpower",
                type: "challenge",
            },
        ],
    },
    {
        implemented: true,
        url: "/cards/dark-ritual.webp",
        name: "DARK RITUAL",
        title: "Sinister Spell",
        characteristics: ["arcane", "dark magic"],
        text: [
            "**Life Drain** - Sacrifice 2 strength from an allied character to deal 4 damage to an enemy character.",
        ],
        type: "action",
        flavour:
            "The price of power is always steep, demanding sacrifice for greater destruction.",
        inkwell: false,
        color: "amethyst",
        cost: 5,
        strength: 0, // Actions do not have inherent strength
        willpower: 0, // Actions do not have inherent willpower
        lore: 0, // Actions generally do not contribute to lore directly
        actionChecks: generateActionChecks({
            ability: (gameState, thisCard) => {
                if (
                    gameState.players[gameState.currentPlayer].field.length <
                        2 ||
                    gameState.players[(gameState.currentPlayer + 1) % 2].field
                        .length === 0
                ) {
                    console.log("Not enough characters to sacrifice");

                    return null;
                }
                return {
                    type: "ability",
                    card: thisCard,
                };
            },
        }),
        actions: generateActions({
            ability: (gameState, thisCard) => {
                gameState.inputStage = {
                    type: "ability",
                    options: gameState.players[gameState.currentPlayer].field,
                    maxSelections: 1,
                    prompt: "Choose a character to sacrifice",
                    callback: choice => {
                        useGameStore.setState(
                            state => {
                                if (typeof choice === "string") return state;
                                const player =
                                    state.players[state.currentPlayer];
                                const target = player[choice.zone].find(
                                    card => card.id === choice.id
                                );
                                if (!target) return state;

                                player[choice.zone] = player[choice.zone].map(
                                    card =>
                                        card.id === choice.id
                                            ? {
                                                  ...card,
                                                  strength: card.strength - 2,
                                              }
                                            : card
                                );

                                state.inputStage = {
                                    type: "play",
                                    options:
                                        state.players[
                                            (state.currentPlayer + 1) % 2
                                        ].field,
                                    maxSelections: 1,
                                    prompt: "Choose a character to damage",
                                    callback: choice => {
                                        useGameStore.setState(
                                            state => {
                                                if (typeof choice === "string")
                                                    return state;
                                                const target = state.players[
                                                    (state.currentPlayer + 1) %
                                                        2
                                                ].field.find(
                                                    card =>
                                                        card.id === choice.id
                                                );
                                                if (!target) return state;

                                                target.strength -= 4;

                                                if (target.strength <= 0) {
                                                    state.players =
                                                        moveToDiscard(
                                                            state,
                                                            target
                                                        );
                                                }

                                                return { ...state };
                                            },
                                            false,
                                            { type: "Life Drain Attack" }
                                        );
                                    },
                                };
                                return { ...state };
                            },
                            false,
                            { type: "Life Drain Sacrifice" }
                        );
                    },
                };

                return { ...gameState };
            },
        }),
        triggers: generateTriggers({}),
        illustrator: "GPT4o",
        language: "EN",
        number: 9,
        set: "JSC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        // TODO: add field modifiers
        implemented: true,
        url: "/cards/celestial-beacon.webp",
        name: "CELESTIAL BEACON",
        title: "Radiant Artifact",
        characteristics: ["artifact", "celestial"],
        text: [
            "**Radiant Light** - All allies gain +1 lore while this item remains on the field.",
        ],
        type: "item",
        flavour:
            "A guiding light from the heavens, shining hope upon all who see it.",
        inkwell: true,
        color: "sapphire",
        cost: 4,
        strength: 0, // Items do not have inherent strength
        willpower: 0, // Items do not have inherent willpower
        lore: 0, // Items generally do not contribute to lore directly
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    gameState.players[gameState.currentPlayer].field.forEach(
                        card => {
                            card.lore += 1;
                        }
                    );
                }
                return { ...gameState };
            },
            discard: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    gameState.players[gameState.currentPlayer].field.forEach(
                        card => {
                            card.lore -= 1;
                        }
                    );
                }
                return { ...gameState };
            },
        }),
        illustrator: "GPT4o",
        language: "EN",
        number: 8,
        set: "JSC",
        rarity: "rare",
        modifiers: [],
    },
    {
        implemented: true,
        url: "/cards/elven-scout.webp",
        name: "ELVEN SCOUT",
        title: "Nimble Tracker",
        characteristics: ["storyborn", "scout"],
        text: [
            "**Warning Call** - When this character is played, look at the top 3 cards of your deck and move one to your hand.",
        ],
        type: "character",
        flavour:
            "Quick to find and quicker to warn, the Elven Scout is always one step ahead.",
        inkwell: true,
        color: "emerald",
        cost: 2,
        strength: 1,
        willpower: 2,
        lore: 1,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    // Look at the top 3 cards of your deck
                    const top3Cards = gameState.players[
                        gameState.currentPlayer
                    ].deck.slice(0, 3);

                    gameState.inputStage = {
                        type: "play",
                        options: top3Cards,
                        maxSelections: 1,
                        showDialogue: true,
                        prompt: "Choose a card to move to your hand",
                        callback: choice => {
                            useGameStore.setState(
                                state => {
                                    if (typeof choice === "string")
                                        return gameState;
                                    state.players[
                                        state.currentPlayer
                                    ].hand.push(choice);
                                    state.players[state.currentPlayer].deck =
                                        state.players[
                                            state.currentPlayer
                                        ].deck.filter(
                                            card => card.id !== choice.id
                                        );
                                    state.inputStage = null;

                                    return { ...state };
                                },
                                false,
                                { type: "Warning Call" }
                            );
                        },
                    };
                }
                return { ...gameState };
            },
        }),
        illustrator: "GPT4o",
        language: "EN",
        number: 7,
        set: "JSC",
        rarity: "common",
        modifiers: [],
    },
    {
        implemented: true,
        url: "/cards/knight-of-valor.webp",
        name: "KNIGHT OF VALOR",
        title: "Noble Warrior",
        characteristics: ["storyborn", "knight"],
        text: [
            "**Valor** - Charcter gains **Challenger +1** (Challenger willpower increases by 1 when challenging)",
        ],
        type: "character",
        flavour:
            "The Knight of Valor is a noble warrior, always ready to defend the innocent.",
        inkwell: true,
        color: "amber",
        cost: 3,
        strength: 3,
        willpower: 3,
        lore: 2,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({}),
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        modifiers: [
            {
                value: 1,
                duration: "until_end_of_turn",
                stat: "willpower",
                type: "challenge",
            },
        ],
    },
    {
        implemented: true,
        url: "/cards/blade-of-fury.webp",
        name: "BLADE OF FURY",
        title: "Enchanted Weapon",
        characteristics: ["enchanted", "weapon"],
        text: [
            "**Empower** - Exert this item to give a friendly character +3 strength for this turn.",
        ],
        type: "item",
        flavour:
            "The edge of this blade thirsts for battle, igniting its wielder’s fury.",
        inkwell: false,
        color: "ruby",
        cost: 3,
        strength: 0, // Item cards typically do not have inherent strength
        willpower: 0, // Item cards typically do not have inherent willpower
        lore: 0, // Items generally do not contribute to lore directly
        actionChecks: generateActionChecks({
            ability: (gameState, thisCard) => {
                // TODO: IMPLEMENT TEMP BUFFS
                return null;
            },
        }),
        actions: generateActions({
            ability: (gameState, thisCard) => {
                gameState.inputStage = {
                    type: "ability",
                    options: gameState.players[gameState.currentPlayer].field,
                    prompt: "Choose a character to empower",
                    callback: choice => {
                        useGameStore.setState(
                            state => {
                                if (typeof choice === "string") return state;
                                const player =
                                    state.players[state.currentPlayer];
                                const target = player[choice.zone].find(
                                    card => card.id === choice.id
                                );
                                if (!target) return state;

                                player[choice.zone] = player[choice.zone].map(
                                    card =>
                                        card.id === choice.id
                                            ? {
                                                  ...card,
                                                  strength: card.strength + 3,
                                              }
                                            : card
                                );

                                state.inputStage = null;
                                return { ...state };
                            },
                            false,
                            { type: "EMPOWER" }
                        );
                    },
                };
                return gameState;
            },
        }),
        triggers: generateTriggers({}),
        illustrator: "GPT4o",
        language: "EN",
        number: 6,
        set: "JSC",
        rarity: "rare",
        modifiers: [],
    },
    {
        implemented: true,
        url: "/cards/ancient-protector.webp",
        name: "ANCIENT PROTECTOR",
        title: "Guardian of the Old Realms",
        text: [
            "**Rooted Defense** - All friendly characters gain +1 willpower as long as this character is on the field.",
        ],
        characteristics: ["storyborn", "guardian"],
        flavour:
            "A silent sentinel of nature, unwavering in its protection of the land.",
        type: "character",
        inkwell: true,
        color: "emerald",
        cost: 6,
        strength: 5,
        willpower: 7,
        lore: 3,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    gameState.players[gameState.currentPlayer].field.forEach(
                        card => {
                            card.willpower += 1;
                        }
                    );
                }
                return { ...gameState };
            },

            discard: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    gameState.players[gameState.currentPlayer].field.forEach(
                        card => {
                            card.willpower -= 1;
                        }
                    );
                }
                return { ...gameState };
            },
        }),
        illustrator: "GPT4o",
        language: "EN",
        number: 5,
        set: "JSC",
        rarity: "rare",
        modifiers: [],
    },
    {
        implemented: true,
        url: "/cards/arcane-aprentice.webp",
        name: "ARCANE APRENTICE",
        title: "Mystic Mage",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "**Arcane Knowledge** - When this character enters play, draw a card.",
        ],
        type: "character",
        flavour:
            "The Arcane Aprentice is a young mage, eager to learn the secrets of the universe.",
        inkwell: true,
        color: "amber",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 2,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    return drawCard(gameState, 1, gameState.attacker);
                }
                return gameState;
            },
        }),
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        url: "/cards/flamecaster.webp",
        name: "FLAMECASTER",
        title: "Fiery Fiend",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "**Fiery Plume** - When this character enters play, deal 1 damage to target character.",
        ],
        type: "character",
        flavour:
            "Only those who have seen the flames of the Phoenix can truly understand the power of the Fireborn.",
        inkwell: true,
        color: "amber",
        cost: 4,
        strength: 3,
        willpower: 4,
        lore: 2,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    useGameStore.setState(
                        state => {
                            state.inputStage = {
                                type: "ability",
                                options:
                                    state.players[(state.currentPlayer + 1) % 2]
                                        .field,
                                prompt: "Choose a character to damage",
                                callback: choice => {
                                    if (typeof choice === "string")
                                        return state;
                                    const target = state.players[
                                        (state.currentPlayer + 1) % 2
                                    ].field.find(card => card.id === choice.id);
                                    if (!target) return state;
                                    target.strength -= 1;
                                    if (target.strength <= 0) {
                                        state.players = moveToDiscard(
                                            state,
                                            target
                                        );
                                    }
                                    state.inputStage = null;
                                    return { ...state };
                                },
                            };

                            return { ...state };
                        },
                        false,
                        { type: "FIERY PLUME" }
                    );
                }

                return { ...gameState };
            },
        }),
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "TFC",
        rarity: "uncommon",
        modifiers: [],
    },
    {
        implemented: true,
        url: "/cards/beacon.webp",
        name: "BEACON",
        title: "Guiding Light",
        characteristics: ["storyborn", "puppy"],
        text: [
            "**Soothing Light** - When this character enters play, heal 1 damage from target character.",
            "**Loyal** - This character can't attack.",
            "**Teef** - ->: Take 1 ITEM from any player",
        ],
        type: "character",
        flavour:
            "The Beacon is a loyal companion, always ready to lend a helping paw.",
        inkwell: true,
        color: "amber",
        cost: 4,
        strength: 3,
        willpower: 4,
        lore: 2,
        actionChecks: generateActionChecks({}),
        actions: generateActions({
            ability: (gameState, thisCard) => {
                const options = gameState.players[
                    (gameState.currentPlayer + 1) % 2
                ].field.filter(card => card.type === "item");
                if (options.length === 0) return gameState;
                gameState.inputStage = {
                    type: "ability",
                    options: options,
                    prompt: "Choose an item to steal",
                    callback: choice => {
                        useGameStore.setState(
                            state => {
                                if (typeof choice === "string") return state;
                                const target = state.players[
                                    state.currentPlayer === 0 ? 1 : 0
                                ].field.find(card => card.id === choice.id);
                                if (!target) return state;

                                state.players = state.players.map(player => {
                                    if (player.id === state.attacker) {
                                        return {
                                            ...player,
                                            field: player.field.concat({
                                                ...target,
                                                owner: player.id,
                                            }),
                                        };
                                    } else {
                                        return {
                                            ...player,
                                            field: player.field.filter(
                                                card => card.id !== choice.id
                                            ),
                                        };
                                    }
                                });

                                return { ...state };
                            },
                            false,
                            { type: "TEEF" }
                        );
                    },
                };

                return gameState;
            },
        }),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    gameState.inputStage = {
                        type: "ability",
                        options: gameState.players[
                            gameState.currentPlayer
                        ].field.filter(card => card.id !== thisCard.id),
                        prompt: "Choose a character to heal",
                        callback: choice => {
                            useGameStore.setState(state => {
                                if (typeof choice === "string") return state;
                                const target = state.players[
                                    state.currentPlayer
                                ].field.find(card => card.id === choice.id);
                                if (!target) return state;
                                target.strength += 1;
                                state.inputStage = null;
                                return { ...state };
                            });
                        },
                    };
                }
                return { ...gameState };
            },
        }),
        illustrator: "GPT4o",
        language: "EN",
        number: 2,
        set: "JSC",
        rarity: "legendary",
        modifiers: [],
    },
];

export default cards;
