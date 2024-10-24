import { BaseCard } from "../../types/game";
import {
    abilityCallback,
    damageCard,
    moveCardToZoneReturnState,
    updateCardInState,
} from "../actions";
import { isCard } from "../utils";

import {
    evasiveText,
    getAttackerFieldCharacters,
    getDefenderFieldCharacters,
} from "../utils/cards";

const RubyCards: BaseCard[] = [
    {
        implemented: true,
        slug: "pongo-ol-rascal",
        url: "/cards/pongo-ol-rascal.jpg",
        name: "Pongo",
        title: "Ol' Rascal",
        characteristics: ["hero", "storyborn"],
        text: [evasiveText],
        type: "character",
        flavor: "“At first I had no particular plan, just anything to attract attention. You know, stir things up a bit.”",
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
        abilities: [],
        modifiers: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: true },
            resist: { active: false },
            sing: { active: true },
            bodyguard: { active: false },
            reckless: { active: false },
        },
    },
    {
        implemented: true,
        slug: "milo-thatch-spirited-scholar",
        url: "/cards/milo-thatch-spirited-scholar.jpg",
        name: "Milo Thatch",
        title: "Spirited Scholar",
        characteristics: ["hero", "storyborn"],
        text: [
            "~~I’M YOUR MAN!~~ While this character is at a location, he gets +2 ※.",
        ],
        type: "character",
        abilities: [
            //TODO: Implement this ability
        ],
        flavor: "“My grandpa never told me about this place!“",
        inkwell: true,
        color: "ruby",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
        language: "EN",
        illustrator: "Massimiliano Narciso",
        number: 115,
        set: "ITI",
        rarity: "common",
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
        slug: "prince-eric-expert-helmsman",
        implemented: true,
        url: "/cards/prince-eric-expert-helmsman.jpg",
        name: "Prince Eric",
        title: "Expert Helmsman",
        characteristics: ["hero", "dreamborn", "prince"],
        text: [
            "~~SURPRISE MANEUVER~~ When this character is banished, you may banish chosen character.",
        ],
        type: "character",
        abilities: [
            {
                type: "triggered",
                trigger: "discard",
                condition(_, eventCard, thisCard) {
                    return eventCard?.id === thisCard.id;
                },
                options: {
                    zone: "field",
                    match: {},
                    player: "opponent",
                },
                prompt: "Choose a character to banish",
                callback: ({ gameState, selectedOption }) => {
                    if (!selectedOption) {
                        return gameState;
                    }

                    gameState = moveCardToZoneReturnState(
                        gameState,
                        "field",
                        "discard",
                        selectedOption
                    );

                    return gameState;
                },
            },
        ],
        flavor: "The storm came out of nowhere, forcing Eric to turn back before he reached the mysterious structure at the edge of Lorcana.",
        color: "ruby",
        cost: 4,
        strength: 2,
        willpower: 2,
        lore: 2,
        language: "EN",
        illustrator: "Randy Bishop",
        number: 121,
        set: "ITI",
        rarity: "super rare",
        inkwell: false,
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
        slug: "trigger-not-so-sharp-shooter",
        implemented: true,
        url: "/cards/trigger-not-so-sharp-shooter.jpg",
        name: "Trigger",
        title: "Not-So-Sharp Shooter",
        characteristics: ["storyborn", "ally"],
        text: ["~~OLD BETSY~~ Your Characters named Nutsy get +1"],
        type: "character",
        flavor: '"Criminently, Trigger! Point that peashooter the other way."\n - Sherrif of Nottingham',
        inkwell: true,
        color: "ruby",
        cost: 2,
        strength: 1,
        willpower: 3,
        lore: 1,
        abilities: [
            {
                type: "triggered",
                trigger: "play",
                condition: (_, eventCard, thisCard) => {
                    return (
                        eventCard?.id === thisCard.id ||
                        eventCard?.slug.toLowerCase().includes("nutsy") ||
                        false
                    );
                },
                callback: ({ gameState, selectedOption, thisCard }) => {
                    if (selectedOption?.slug.toLowerCase().includes("nutsy")) {
                        console.log("nutsy played and modified");

                        gameState = updateCardInState(gameState, {
                            ...selectedOption,
                            loreModifier: 1,
                        });
                    }

                    if (selectedOption?.id === thisCard.id) {
                        getAttackerFieldCharacters(gameState).forEach(card => {
                            if (card.name.toLowerCase().includes("nutsy")) {
                                console.log("nutsy found and modified");
                                gameState = updateCardInState(gameState, {
                                    ...card,
                                    loreModifier: 1,
                                });
                            }
                        });
                    }

                    return { ...gameState };
                },
            },
            {
                type: "triggered",
                trigger: "discard",
                condition: (_, eventCard, thisCard) => {
                    return eventCard?.id === thisCard.id;
                },
                callback: ({ gameState, thisCard }) => {
                    const isAttacker = thisCard.owner === gameState.attacker;

                    if (isAttacker) {
                        getAttackerFieldCharacters(gameState).forEach(card => {
                            if (card.name.toLowerCase().includes("nutsy")) {
                                card.loreModifier -= 1;
                            }
                        });
                    } else {
                        getDefenderFieldCharacters(gameState).forEach(card => {
                            if (card.name.toLowerCase().includes("nutsy")) {
                                card.loreModifier -= 1;
                            }
                        });
                    }

                    return { ...gameState };
                },
            },
        ],
        illustrator: "Denny Minonne",
        language: "EN",
        number: 126,
        set: "TFC",
        rarity: "uncommon",
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
        slug: "lumiere-fiery-friend",
        implemented: true,
        url: "/cards/lumiere-fiery-friend.jpg",
        name: "Lumiere",
        title: "Fiery Friend",
        characteristics: ["dreamborn", "ally"],
        text: ["~~FERVENT ADDRESS~~ Your other characters get +1 ※."],
        type: "character",
        flavor: '"The invaders are at our gates, mes amis! It\'s time to show them what we are made of!"',
        inkwell: true,
        color: "ruby",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
        abilities: [
            {
                type: "triggered",
                trigger: "play",
                condition: (_, eventCard, thisCard) => {
                    return (
                        (eventCard?.type === "character" || false) &&
                        eventCard?.owner === thisCard.owner
                    );
                },
                callback: ({ gameState, selectedOption, thisCard }) => {
                    if (!selectedOption) {
                        return gameState;
                    }

                    if (selectedOption.id !== thisCard.id) {
                        gameState = updateCardInState(gameState, {
                            ...selectedOption,
                            willpowerModifier:
                                (selectedOption.willpowerModifier += 1),
                        });
                    }

                    if (selectedOption.id === thisCard.id) {
                        getAttackerFieldCharacters(gameState).forEach(card => {
                            if (
                                card.type === "character" &&
                                card.id !== thisCard.id
                            ) {
                                gameState = updateCardInState(gameState, {
                                    ...card,
                                    willpowerModifier:
                                        (card.willpowerModifier += 1),
                                });
                            }
                        });
                    }

                    return { ...gameState };
                },
            },
            {
                type: "triggered",
                trigger: "discard",
                condition: (_, eventCard, thisCard) => {
                    return eventCard?.id === thisCard.id;
                },
                callback: ({ gameState, thisCard }) => {
                    const isAttacker = gameState.attacker === thisCard.owner;

                    console.log(
                        "lumiere discarded",
                        isAttacker ? "attacker" : "defender"
                    );

                    const characters = isAttacker
                        ? getAttackerFieldCharacters(gameState)
                        : getDefenderFieldCharacters(gameState);
                    characters.forEach(card => {
                        if (card.type === "character") {
                            gameState = updateCardInState(gameState, {
                                ...card,
                                willpowerModifier:
                                    (card.willpowerModifier -= 1),
                            });
                        }
                    });

                    return { ...gameState };
                },
            },
        ],
        illustrator: "Denny Minonne",
        language: "EN",
        number: 126,
        set: "TFC",
        rarity: "uncommon",
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
        slug: "nutsy-vulture-henchman",
        implemented: true,
        url: "/cards/nutsy-vulture-henchman.jpg",
        name: "Nutsy",
        title: "Vulture Henchman",
        characteristics: ["storyborn", "ally"],
        text: [],
        type: "character",
        flavor: "“Nutsy, button you beak.\n - Trigger”",
        inkwell: true,
        color: "ruby",
        cost: 2,
        strength: 3,
        willpower: 2,
        lore: 1,
        abilities: [],
        illustrator: "Denny Minonne",
        language: "EN",
        number: 118,
        set: "TFC",
        rarity: "common",
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
        slug: "hydra-deadly-serpent",
        implemented: false,
        url: "/cards/hydra-deadly-serpent.jpg",
        name: "Hydra",
        title: "Deadly Serpent",
        characteristics: ["storyborn"],
        text: [
            "~~WATCH THE TEETH~~ Whenever this character is dealt damage, deal that much damage to a chosen opposing character",
        ],
        type: "character",
        flavor: "“More heads are better than one”",
        abilities: [
            {
                type: "triggered",
                trigger: "damage",
                condition: (_, eventCard, thisCard) => {
                    return eventCard?.id === thisCard.id;
                },
                options: {
                    zone: "field",
                    player: "opponent",
                    match: { type: "character" },
                },
                prompt: "Choose a character to deal damage to",
                callback: ({
                    gameState,
                    selectedOption,
                    thisCard,
                    eventDetails,
                }) => {
                    if (!selectedOption) {
                        return gameState;
                    }

                    if (
                        eventDetails &&
                        "damage" in eventDetails &&
                        !Number.isNaN(eventDetails.damage)
                    ) {
                        gameState.inputQueue.push({
                            card: thisCard,
                            prompt: "Choose a character to deal damage to",
                            options: {
                                zone: "field",
                                player: "opponent",
                                match: { type: "character" },
                            },
                            callback: abilityCallback(
                                (gameState, selectedCard) => {
                                    if (isCard(selectedCard)) {
                                        gameState = damageCard(
                                            gameState,
                                            selectedCard,
                                            eventDetails.damage as number
                                        );
                                    }
                                    return { ...gameState };
                                },
                                "deal damage to character"
                            ),
                            computedOptions: [],
                        });
                    }

                    return { ...gameState };
                },
            },
        ],
        inkwell: false,
        color: "ruby",
        cost: 6,
        strength: 5,
        willpower: 6,
        lore: 2,
        illustrator: "Jochem van Gool",
        language: "EN",
        number: 108,
        set: "TFC",
        rarity: "legendary",
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
];

export default RubyCards;
