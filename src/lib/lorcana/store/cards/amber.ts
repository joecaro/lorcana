import useGameStore from "..";
import { BaseCard } from "../../types/game";
import {
    createSingerText,
    generateActionChecks,
    generateActions,
    generateTriggers,
    getAttackerDiscard,
    getDefenderFieldCharacters,
    getXCardFromPlayerDeck,
} from "../utils/cards";

const AmberCards: BaseCard[] = [
    {
        url: "/cards/ariel-on-human-legs.jpg",
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
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({}),
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: false },
        },
    },
    {
        implemented: true,
        url: "/cards/ariel-spectacular-singer.jpg",
        name: "Ariel",
        title: "Spectacular Singer",
        characteristics: ["hero", "storyborn", "princess"],
        text: [
            createSingerText(5),
            "~~MUSICAL DEBUT~~ When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
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
        staticAbilities: {
            evasive: { active: false },
            challenger: { active: false },
            resist: { active: false },
            sing: { active: true, value: 5 },
        },
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    const top4Cards = getXCardFromPlayerDeck(
                        gameState,
                        gameState.currentPlayer,
                        4
                    );

                    gameState.inputStage = {
                        type: "play",
                        options: top4Cards,
                        maxSelections: 1,
                        showDialogue: true,
                        prompt: "Choose a song card to put into your hand",
                        callback: choice => {
                            useGameStore.setState(
                                state => {
                                    if (
                                        typeof choice === "string" ||
                                        Array.isArray(choice)
                                    ) {
                                        return state;
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
                                { type: "Musical Debut" }
                            );
                        },
                    };
                }
                return { ...gameState };
            },
        }),
    },
    {
        implemented: true,
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
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    const discardedCharacterCards = getAttackerDiscard(
                        gameState
                    ).filter(c => c.type === "character");

                    if (discardedCharacterCards.length === 0) {
                        return { ...gameState };
                    }

                    gameState.inputStage = {
                        type: "play",
                        options: discardedCharacterCards,
                        maxSelections: 1,
                        showDialogue: true,
                        prompt: "Choose a character to put into your hand",
                        callback: choice => {
                            useGameStore.setState(
                                state => {
                                    if (
                                        typeof choice === "string" ||
                                        Array.isArray(choice)
                                    ) {
                                        return state;
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
                                { type: "WELL OF SOULS" }
                            );
                        },
                    };
                }
                return { ...gameState };
            },
        }),
        staticAbilities: {
            evasive: { active: false },
            resist: { active: false },
            challenger: { active: false },
            sing: { active: true },
        },
    },
    {
        implemented: true,
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
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({}),
        staticAbilities: {
            evasive: { active: false },
            resist: { active: false },
            challenger: { active: false },
            sing: { active: true },
        },
    },
    {
        implemented: true,
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
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    const discardedCharacterCards = getAttackerDiscard(
                        gameState
                    ).filter(c => c.type === "character");

                    gameState.inputStage = {
                        type: "play",
                        options: discardedCharacterCards,
                        maxSelections: 1,
                        showDialogue: true,
                        prompt: "Choose a character to put into your hand",
                        callback: choice => {
                            useGameStore.setState(
                                state => {
                                    if (
                                        typeof choice === "string" ||
                                        Array.isArray(choice)
                                    ) {
                                        return state;
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
                                { type: "COME ALONG, CHILDREN" }
                            );
                        },
                    };
                }
                return { ...gameState };
            },
            quest: (gameState, thisCard, thatCard) => {
                if (thatCard?.id === thisCard.id) {
                    const discardedCharacterCards = getAttackerDiscard(
                        gameState
                    ).filter(c => c.type === "character");

                    gameState.inputStage = {
                        type: "play",
                        options: discardedCharacterCards,
                        maxSelections: 1,
                        showDialogue: true,
                        prompt: "Choose a character to put into your hand",
                        callback: choice => {
                            useGameStore.setState(
                                state => {
                                    if (
                                        typeof choice === "string" ||
                                        Array.isArray(choice)
                                    ) {
                                        return state;
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
                                { type: "COME ALONG, CHILDREN" }
                            );
                        },
                    };
                }
                return { ...gameState };
            },
        }),
        staticAbilities: {
            evasive: { active: false },
            resist: { active: false },
            challenger: { active: false },
            sing: { active: true },
        },
    },
    {
        implemented: true,
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
        actionChecks: generateActionChecks({}),
        actions: generateActions({
            ability: gameState => {
                const potentialTargets = getDefenderFieldCharacters(gameState);

                gameState.inputStage = {
                    type: "ability",
                    options: potentialTargets,
                    maxSelections: 1,
                    prompt: "Choose a character to effect",
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

                                const updatedField = state.players[
                                    currentPlayerIndex
                                ].field.map(card =>
                                    card.id === choice.id
                                        ? {
                                              ...card,
                                              modifiers: card.modifiers.concat([
                                                  {
                                                      type: "challenge",
                                                      stat: "willpower",
                                                      value: -2,
                                                      duration:
                                                          "until_end_of_next_turn",
                                                      turnApplied:
                                                          state.turn,
                                                      hasTriggered: false,
                                                  },
                                                  {
                                                      type: "challenged",
                                                      stat: "willpower",
                                                      value: -2,
                                                      duration:
                                                          "until_end_of_next_turn",
                                                      turnApplied:
                                                          state.turn,
                                                      hasTriggered: false,
                                                  },
                                              ]),
                                          }
                                        : card
                                );

                                const updatedPlayers = state.players.map(
                                    (player, index) =>
                                        index === currentPlayerIndex
                                            ? {
                                                  ...player,
                                                  field: updatedField,
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
                            { type: "BARK" }
                        );
                    },
                };

                return { ...gameState };
            },
        }),
        triggers: generateTriggers({}),
        staticAbilities: {
            evasive: { active: false },
            resist: { active: false },
            challenger: { active: false },
            sing: { active: true },
        },
    },
];

export default AmberCards;
