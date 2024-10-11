import useGameStore from "..";
import { BaseCard } from "../../types/game";
import {
    generateActionChecks,
    generateActions,
    generateTriggers,
    getAttackerDiscard,
    getAttackerFieldCharacters,
} from "../utils/cards";

const EmeraldCards: BaseCard[] = [
    {
        implemented: true,
        url: "/cards/flynn-rider-charming-rogue.jpg",
        name: "Flynn Rider",
        title: "Charming Rogue",
        characteristics: ["hero", "storyborn", "prince"],
        text: [
            "~~HERE COMES THE SMOLDER~~ Whenever this character is challenged, the challenging player chooses and discards a card.",
        ],
        type: "character",
        flavour:
            "“I didn't want to have to do this, but you leave me no choice. . . .”",
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
        actionChecks: generateActionChecks({}),
        actions: generateActions(),
        triggers: generateTriggers({
            challenge: (gameState, thisCard, thatCard) => {
                if (
                    thisCard.id !== thatCard?.id ||
                    thatCard.owner === gameState.attacker
                )
                    return gameState;

                const options = getAttackerFieldCharacters(gameState);

                if (options.length === 0) return gameState;

                gameState.inputStage = {
                    type: "discard",
                    prompt: `Choose a card to discard`,
                    options: options,
                    callback: choice => {
                        useGameStore.setState(state => {
                            if (
                                typeof choice === "string" ||
                                Array.isArray(choice) ||
                                !getAttackerDiscard(state).find(
                                    c => c.id === choice.id
                                )
                            ) {
                                console.error("Invalid choice:", choice);
                                return { ...state, inputStage: null };
                            }

                            const updatedPlayers = state.players.map(p => {
                                if (p.id === gameState.attacker) {
                                    p.field = p.field.filter(c =>
                                        c.id === choice.id ? false : true
                                    );
                                    p.discard.push(choice);
                                }

                                return p;
                            });

                            return {
                                ...state,
                                players: updatedPlayers,
                                inputStage: null,
                            };
                        });
                    },
                };

                return { ...gameState };
            },
        }),
        modifiers: [],
        staticAbilities: {
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
            sing: { active: true },
        },
    },
];

export default EmeraldCards;
