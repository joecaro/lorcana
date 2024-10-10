import {
    baseAbilityCheck,
    exertPlayerCard,
    generateActionChecks,
    generateActions,
    generateTriggers,
    getAttackerFieldCharacters,
    getDefenderFieldCharacters,
    getDefenderFieldItems,
    getXCardFromPlayerDeck,
} from "./utils/cards";
import { BaseCard } from "../types/game";
import { drawCard, findHealableCards } from "./utils";
import useGameStore from ".";
import { damageCard, moveToDiscard } from "./actions";

const cards: BaseCard[] = [
    {
        implemented: true,
        url: "/cards/rainey.webp",
        name: "RAINEY",
        title: "Gentle Fetcher",
        characteristics: ["princess", "good girl"],
        text: [
            "~~Fetch~~ - When this character enters play, draw a card.",
            "~~Rainey Day~~ - ->: Heal 1 damage for target character.",
        ],
        type: "character",
        flavour:
            "Rainey is a gentle fetcher, always ready to lend a helping paw.",
        inkwell: true,
        color: "amber",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 2,
        actionChecks: generateActionChecks({
            ability: (gameState, thisCard) => {
                if (!baseAbilityCheck(gameState, thisCard)) {
                    return null;
                }
                const healabeCards = findHealableCards(gameState);
                if (healabeCards.length === 0) {
                    console.info("No healable cards");
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
                const healabeCards = findHealableCards(gameState);
                gameState.inputStage = {
                    type: "play",
                    options: healabeCards,
                    prompt: "Choose a card to heal",
                    callback: choice => {
                        useGameStore.setState(
                            state => {
                                if (
                                    typeof choice === "string" ||
                                    Array.isArray(choice)
                                ) {
                                    return state;
                                }

                                const currentPlayerIndex = state.currentPlayer;
                                const player =
                                    state.players[currentPlayerIndex];

                                // Create a new copy of the target zone with the updated card
                                const updatedZone = player[choice.zone].map(
                                    card =>
                                        card.id === choice.id
                                            ? {
                                                  ...card,
                                                  strength: card.strength + 1,
                                              }
                                            : card
                                );

                                // Create a new copy of the player's hand with the exerted card
                                const updatedHand = player.hand.map(card =>
                                    card.id === thisCard.id
                                        ? { ...card, exerted: true }
                                        : card
                                );

                                // Return a new state object with all changes applied immutably
                                const updatedPlayers = state.players.map(
                                    (p, index) =>
                                        index === currentPlayerIndex
                                            ? {
                                                  ...p,
                                                  [choice.zone]: updatedZone,
                                                  hand: updatedHand,
                                              }
                                            : p
                                );

                                return {
                                    ...state,
                                    players: updatedPlayers,
                                    inputStage: null,
                                };
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
        },
        illustrator: "GPT4o",
        language: "EN",
        number: 1,
        set: "JSC",
        rarity: "legendary",
        modifiers: [],
    },
    {
        implemented: true,
        url: "/cards/storm-enchanter.webp",
        name: "STORM ENCHANTER",
        title: "Master of the Elements",
        foilUrl: "/foil/storm-enchanter.jpg",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "~~Stormborn~~ - This character gains +1 willpower when challenging.",
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/dark-ritual.webp",
        name: "DARK RITUAL",
        title: "Sinister Spell",
        characteristics: ["arcane", "dark magic"],
        text: [
            "~~Life Drain~~ - Sacrifice 2 strength from an allied character to deal 4 damage to an enemy character.",
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
                if (!baseAbilityCheck(gameState, thisCard)) {
                    return null;
                }
                if (
                    getAttackerFieldCharacters(gameState).length < 2 ||
                    getDefenderFieldCharacters(gameState).length === 0
                ) {
                    console.info("Not enough characters to sacrifice");

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
                                if (
                                    typeof choice === "string" ||
                                    Array.isArray(choice)
                                ) {
                                    return state;
                                }

                                const currentPlayerIndex = state.currentPlayer;
                                const player =
                                    state.players[currentPlayerIndex];

                                // Create a new copy of the target zone with the updated card's strength reduced
                                const updatedZone = player[choice.zone].map(
                                    card =>
                                        card.id === choice.id
                                            ? {
                                                  ...card,
                                                  strength: card.strength - 2,
                                              }
                                            : card
                                );

                                // Move the target to the discard pile if its strength is zero or less
                                const updatedPlayers = player[choice.zone].some(
                                    card =>
                                        card.id === choice.id &&
                                        card.strength - 2 <= 0
                                )
                                    ? moveToDiscard(
                                          { ...state, players: state.players },
                                          player[choice.zone].find(
                                              card => card.id === choice.id
                                          )!
                                      )
                                    : state.players.map(p =>
                                          p.id === player.id
                                              ? {
                                                    ...p,
                                                    [choice.zone]: updatedZone,
                                                }
                                              : p
                                      );

                                return {
                                    ...state,
                                    players: updatedPlayers,
                                    inputStage: {
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
                                                    if (
                                                        typeof choice ===
                                                            "string" ||
                                                        Array.isArray(choice)
                                                    ) {
                                                        return state;
                                                    }

                                                    const opponentIndex =
                                                        (state.currentPlayer +
                                                            1) %
                                                        2;
                                                    const target =
                                                        state.players[
                                                            opponentIndex
                                                        ].field.find(
                                                            card =>
                                                                card.id ===
                                                                choice.id
                                                        );

                                                    if (!target) return state;

                                                    // Update the target's strength immutably
                                                    const updatedOpponentField =
                                                        state.players[
                                                            opponentIndex
                                                        ].field.map(card =>
                                                            card.id ===
                                                            choice.id
                                                                ? {
                                                                      ...card,
                                                                      strength:
                                                                          card.strength -
                                                                          4,
                                                                  }
                                                                : card
                                                        );

                                                    // Move target to discard if its strength falls to zero or below
                                                    const updatedPlayers =
                                                        target.strength - 4 <= 0
                                                            ? moveToDiscard(
                                                                  {
                                                                      ...state,
                                                                      players:
                                                                          state.players,
                                                                  },
                                                                  target
                                                              )
                                                            : state.players.map(
                                                                  (
                                                                      player,
                                                                      idx
                                                                  ) =>
                                                                      idx ===
                                                                      opponentIndex
                                                                          ? {
                                                                                ...player,
                                                                                field: updatedOpponentField,
                                                                            }
                                                                          : player
                                                              );

                                                    // Exert the thisCard on the field of its owner immutably
                                                    const exertedPlayers =
                                                        updatedPlayers.map(
                                                            player =>
                                                                player.id ===
                                                                thisCard.owner
                                                                    ? {
                                                                          ...player,
                                                                          field: player.field.map(
                                                                              card =>
                                                                                  card.id ===
                                                                                  thisCard.id
                                                                                      ? {
                                                                                            ...card,
                                                                                            exerted:
                                                                                                true,
                                                                                        }
                                                                                      : card
                                                                          ),
                                                                      }
                                                                    : player
                                                        );

                                                    return {
                                                        ...state,
                                                        players: exertedPlayers,
                                                        inputStage: null,
                                                    };
                                                },
                                                false,
                                                { type: "Life Drain Attack" }
                                            );
                                        },
                                    },
                                };
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/celestial-beacon.webp",
        name: "CELESTIAL BEACON",
        title: "Radiant Artifact",
        characteristics: ["artifact", "celestial"],
        text: [
            "~~Radiant Light~~ - All allies gain +1 lore while this item remains on the field.",
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/elven-scout.webp",
        name: "ELVEN SCOUT",
        title: "Nimble Tracker",
        characteristics: ["storyborn", "scout"],
        text: [
            "~~Warning Call~~ - When this character is played, look at the top 3 cards of your deck and move one to your hand.",
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
                    const top3Cards = getXCardFromPlayerDeck(
                        gameState,
                        gameState.currentPlayer,
                        3
                    );

                    gameState.inputStage = {
                        type: "play",
                        options: top3Cards,
                        maxSelections: 1,
                        showDialogue: true,
                        prompt: "Choose a card to move to your hand",
                        callback: choice => {
                            useGameStore.setState(
                                state => {
                                    if (
                                        typeof choice === "string" ||
                                        Array.isArray(choice)
                                    ) {
                                        return { ...state };
                                    }

                                    const currentPlayerIndex =
                                        state.currentPlayer;

                                    const updatedHand = [
                                        ...state.players[currentPlayerIndex]
                                            .hand,
                                        choice,
                                    ];

                                    const updatedDeck = state.players[
                                        currentPlayerIndex
                                    ].deck.filter(
                                        card => card.id !== choice.id
                                    );

                                    const updatedPlayers = state.players.map(
                                        (player, index) =>
                                            index === currentPlayerIndex
                                                ? {
                                                      ...player,
                                                      hand: updatedHand,
                                                      deck: updatedDeck,
                                                  }
                                                : player
                                    );

                                    return {
                                        ...state,
                                        players: updatedPlayers,
                                        inputStage: null,
                                    };
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/knight-of-valor.webp",
        name: "KNIGHT OF VALOR",
        title: "Noble Warrior",
        characteristics: ["storyborn", "knight"],
        text: [
            "~~Valor~~ - Charcter gains **Challenger +1** (Challenger willpower increases by 1 when challenging)",
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/blade-of-fury.webp",
        name: "BLADE OF FURY",
        title: "Enchanted Weapon",
        characteristics: ["enchanted", "weapon"],
        text: [
            "~~Empower~~ - Exert this item to give a friendly character +3 willpower for this turn.",
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
                if (!baseAbilityCheck(gameState, thisCard)) {
                    return null;
                }

                if (getAttackerFieldCharacters(gameState).length === 0) {
                    console.info("No characters to empower");
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
                    options: getAttackerFieldCharacters(gameState),
                    prompt: "Choose a character to empower",
                    callback: choice => {
                        useGameStore.setState(
                            state => {
                                if (
                                    typeof choice === "string" ||
                                    Array.isArray(choice)
                                ) {
                                    return state;
                                }

                                const currentPlayerIndex = state.currentPlayer;
                                const player =
                                    state.players[currentPlayerIndex];

                                // Create a new copy of the target zone with the updated card that has the new modifier
                                const updatedZone = player[choice.zone].map(
                                    card =>
                                        card.id === choice.id
                                            ? {
                                                  ...card,
                                                  modifiers:
                                                      card.modifiers.concat({
                                                          value: 3,
                                                          duration:
                                                              "until_end_of_turn",
                                                          stat: "willpower",
                                                          type: "challenge",
                                                          turnApplied:
                                                              state.turn,
                                                          hasTriggered: false,
                                                      }),
                                              }
                                            : card
                                );

                                // Create a new player object with the updated zone
                                const updatedPlayer = {
                                    ...player,
                                    [choice.zone]: updatedZone,
                                };

                                const exertedPlayer = exertPlayerCard(
                                    updatedPlayer,
                                    thisCard
                                );

                                const updatedPlayers = state.players.map(
                                    (p, index) =>
                                        index === currentPlayerIndex
                                            ? exertedPlayer
                                            : p
                                );

                                return {
                                    ...state,
                                    players: updatedPlayers,
                                    inputStage: null,
                                };
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/ancient-protector.webp",
        name: "ANCIENT PROTECTOR",
        title: "Guardian of the Old Realms",
        text: [
            "~~Rooted Defense~~ - All friendly characters gain +1 willpower as long as this character is on the field.",
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
                            card.willpowerModifier += 1;
                        }
                    );
                }
                return { ...gameState };
            },

            discard: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    gameState.players[gameState.currentPlayer].field.forEach(
                        card => {
                            card.willpowerModifier -= 1;
                        }
                    );
                }
                return { ...gameState };
            },
        }),
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/arcane-aprentice.webp",
        name: "ARCANE APRENTICE",
        title: "Mystic Mage",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "~~Arcane Knowledge~~ - When this character enters play, draw a card.",
            "**Evasive** - Only characters with Evasive can challenge this character.",
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
        staticAbilities: {
            evasive: { active: true },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/flamecaster.webp",
        name: "FLAMECASTER",
        title: "Fiery Fiend",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "~~Fiery Plume~~ - When this character enters play, deal 1 damage to target character.",
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
                            if (
                                getDefenderFieldCharacters(state).length === 0
                            ) {
                                console.info("No characters to damage");
                                return state;
                            }

                            state.inputStage = {
                                type: "ability",
                                options: getDefenderFieldCharacters(state),
                                prompt: "Choose a character to damage",
                                callback: choice => {
                                    if (
                                        typeof choice === "string" ||
                                        Array.isArray(choice)
                                    ) {
                                        return state;
                                    }

                                    return damageCard(state, choice, 1);
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/beacon.webp",
        name: "BEACON",
        title: "Guiding Light",
        characteristics: ["storyborn", "puppy"],
        text: [
            "~~Soothing Light~~ - When this character enters play, heal 1 damage from target character.",
            "**Loyal** - This character can't attack.",
            "~~Teef~~ - ->: Take 1 ITEM from any player",
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
        actionChecks: generateActionChecks({
            ability: (gameState, thisCard) => {
                if (!baseAbilityCheck(gameState, thisCard)) {
                    return null;
                }

                if (getDefenderFieldItems(gameState).length === 0) {
                    console.info("No items to steal");
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
                    options: getDefenderFieldItems(gameState),
                    prompt: "Choose an item to steal",
                    callback: choice => {
                        useGameStore.setState(
                            state => {
                                if (
                                    typeof choice === "string" ||
                                    Array.isArray(choice)
                                ) {
                                    return state;
                                }

                                const opponentIndex =
                                    state.currentPlayer === 0 ? 1 : 0;
                                const target = state.players[
                                    opponentIndex
                                ].field.find(card => card.id === choice.id);

                                if (!target) return state;

                                // Create a new players array with the updated player states
                                const updatedPlayers = state.players.map(
                                    player => {
                                        if (player.id === state.attacker) {
                                            // Add the target card to the attacker's field
                                            return {
                                                ...player,
                                                field: player.field.concat({
                                                    ...target,
                                                    owner: player.id,
                                                }),
                                            };
                                        } else {
                                            // Remove the target card from the opponent's field
                                            return {
                                                ...player,
                                                field: player.field.filter(
                                                    card =>
                                                        card.id !== choice.id
                                                ),
                                            };
                                        }
                                    }
                                );

                                // Create a new players array with the exerted card state update
                                const exertedPlayers = updatedPlayers.map(
                                    player =>
                                        player.id === thisCard.owner
                                            ? exertPlayerCard(player, thisCard)
                                            : player
                                );

                                // Return a new state object with the updated players
                                return {
                                    ...state,
                                    players: exertedPlayers,
                                };
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
                                if (
                                    typeof choice === "string" ||
                                    Array.isArray(choice)
                                )
                                    return state;
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/frost-warden.webp",
        name: "FROST WARDEN",
        title: "Guardian of the Frozen Realm",
        characteristics: ["storyborn", "warden"],
        text: [
            "~~Frozen Shield~~ - When this character enters play, prevent the next 2 damage dealt to any friendly character.",
        ],
        type: "character",
        flavour:
            "Standing against the tide of chaos, the Frost Warden protects all under its watch.",
        inkwell: true,
        color: "sapphire",
        cost: 4,
        strength: 2,
        willpower: 5,
        lore: 2,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    gameState.players[gameState.currentPlayer].field.forEach(
                        card => {
                            card.modifiers.push({
                                value: 2,
                                duration: "until_damage_received",
                                stat: "strength",
                                type: "challenge",
                                turnApplied: gameState.turn,
                                hasTriggered: false,
                            });
                        }
                    );
                }
                return { ...gameState };
            },
        }),
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/sunforged-armor.webp",
        name: "SUNFORGED ARMOR",
        title: "Radiant Shield",
        characteristics: ["artifact", "armor"],
        text: [
            "~~Solar Resilience~~ - Exert this item to give a character +2 strength until the end of turn.",
        ],
        type: "item",
        flavour:
            "Forged in the heart of a dying star, it glows with the warmth of a thousand suns.",
        inkwell: true,
        color: "amber",
        cost: 3,
        strength: 0,
        willpower: 0,
        lore: 0,
        actionChecks: generateActionChecks({
            ability: (gameState, thisCard) => {
                if (!baseAbilityCheck(gameState, thisCard)) {
                    return null;
                }

                if (getAttackerFieldCharacters(gameState).length === 0) {
                    console.info("No characters to buff");
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
                    options: getAttackerFieldCharacters(gameState),
                    prompt: "Choose a character to boost",
                    callback: choice => {
                        useGameStore.setState(state => {
                            if (
                                typeof choice === "string" ||
                                Array.isArray(choice)
                            ) {
                                return state;
                            }

                            const currentPlayerIndex = state.currentPlayer;
                            const player = state.players[currentPlayerIndex];

                            // Find the target card on the player's field
                            const target = player.field.find(
                                card => card.id === choice.id
                            );
                            if (!target) return state;

                            // Create a new field array with the updated card modifiers
                            const updatedField = player.field.map(card =>
                                card.id === choice.id
                                    ? {
                                          ...card,
                                          modifiers: card.modifiers.concat({
                                              value: 2,
                                              duration: "until_end_of_turn",
                                              stat: "strength",
                                              type: "challenge",
                                              turnApplied: state.turn,
                                              hasTriggered: false,
                                          }),
                                      }
                                    : card
                            );

                            // Update the player object immutably
                            const updatedPlayer = exertPlayerCard(
                                {
                                    ...player,
                                    field: updatedField,
                                },
                                thisCard
                            );

                            // Create a new players array with the updated player object
                            const updatedPlayers = state.players.map(
                                (p, index) =>
                                    index === currentPlayerIndex
                                        ? updatedPlayer
                                        : p
                            );

                            // Return a new state object with the updated players and cleared input stage
                            return {
                                ...state,
                                players: updatedPlayers,
                                inputStage: null,
                            };
                        });
                    },
                };
                return gameState;
            },
        }),
        triggers: generateTriggers({}),
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/cindershadow-sorcerer.webp",
        name: "CINDERSHADOW SORCERER",
        title: "Wielder of Flames",
        characteristics: ["storyborn", "sorcerer"],
        text: [
            "~~Flame Conjure~~ - When this character enters play, deal 2 damage to all enemy characters.",
        ],
        type: "character",
        flavour:
            "From the darkness of the ash, the Cindershadow rises to incinerate all that opposes it.",
        inkwell: true,
        color: "ruby",
        cost: 5,
        strength: 4,
        willpower: 2,
        lore: 2,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    gameState.players[
                        (gameState.currentPlayer + 1) % 2
                    ].field.forEach(card => {
                        card.strength -= 2;
                        if (card.strength <= 0) {
                            gameState.players = moveToDiscard(gameState, card);
                        }
                    });
                }
                return { ...gameState };
            },
        }),
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/mystic-elder.webp",
        name: "MYSTIC ELDER",
        title: "Sage of the Ages",
        characteristics: ["storyborn", "mage"],
        text: [
            "~~Arcane Insight~~ - When this character is played, look at the top 5 cards of your deck and rearrange them.",
        ],
        type: "character",
        flavour:
            "Time bends and knowledge flows from the mind of the Mystic Elder.",
        inkwell: true,
        color: "amethyst",
        cost: 4,
        strength: 2,
        willpower: 4,
        lore: 3,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    const top5Cards = gameState.players[
                        gameState.currentPlayer
                    ].deck.slice(0, 5);
                    gameState.inputStage = {
                        type: "play",
                        options: top5Cards,
                        maxSelections: 5,
                        prompt: "Rearrange the top 5 cards of your deck",
                        callback: newOrder => {
                            if (
                                typeof newOrder === "string" ||
                                !Array.isArray(newOrder) ||
                                newOrder.length !== 5
                            )
                                return gameState;
                            useGameStore.setState(state => {
                                state.players[state.currentPlayer].deck = [
                                    ...newOrder,
                                    ...state.players[
                                        state.currentPlayer
                                    ].deck.slice(5),
                                ];
                                state.inputStage = null;
                                return { ...state };
                            });
                        },
                    };
                }
                return { ...gameState };
            },
        }),
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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
        url: "/cards/vinebound-titan.webp",
        name: "VINEBOUND TITAN",
        title: "Earthbound Juggernaut",
        characteristics: ["storyborn", "giant"],
        text: [
            "~~Entangling Vines~~ - When this character challenges, reduce the target's willpower by 2.",
        ],
        type: "character",
        flavour:
            "The Vinebound Titan crushes its foes with nature's unyielding force.",
        inkwell: false,
        color: "emerald",
        cost: 7,
        strength: 6,
        willpower: 6,
        lore: 1,
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({}),
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
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

export default cards;
