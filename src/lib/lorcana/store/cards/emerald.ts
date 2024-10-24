import { BaseCard } from "../../types/game";
import { moveCardToZoneReturnState } from "../actions";

const EmeraldCards: BaseCard[] = [
    {
        implemented: true,
        slug: "flynn-rider-charming-rogue",
        url: "/cards/flynn-rider-charming-rogue.jpg",
        name: "Flynn Rider",
        title: "Charming Rogue",
        characteristics: ["hero", "storyborn", "prince"],
        text: [
            "~~HERE COMES THE SMOLDER~~ Whenever this character is challenged, the challenging player chooses and discards a card.",
        ],
        type: "character",
        flavor: "“I didn't want to have to do this, but you leave me no choice. . . .”",
        inkwell: true,
        color: "emerald",
        cost: 2,
        strength: 1,
        willpower: 2,
        lore: 2,
        language: "EN",
        illustrator: "Leonardo Giammichele",
        number: 74,
        set: "TFC",
        rarity: "uncommon",
        abilities: [
            {
                type: "triggered",
                prompt: "Choose a card to discard",
                trigger: "challenge",
                condition: (_, eventCard, thisCard) => {
                    return eventCard?.id === thisCard.id;
                },
                options: {
                    zone: "hand",
                    player: "self",
                    match: {},
                },
                callback: ({ gameState, selectedOption }) => {
                    return selectedOption
                        ? moveCardToZoneReturnState(
                              gameState,
                              "hand",
                              "discard",
                              selectedOption
                          )
                        : { ...gameState };
                },
            },
        ],
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

export default EmeraldCards;
