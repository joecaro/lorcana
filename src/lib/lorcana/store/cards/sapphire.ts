import { BaseCard } from "../../types/game";
import {
    generateActionChecks,
    generateActions,
    generateTriggers,
    getDefenderFieldCharacters,
} from "../utils/cards";

const SapphireCards: BaseCard[] = [
    {
        implemented: true,
        slug: "hades-infernal-schemer",
        url: "/cards/hades-infernal-schemer.jpg",
        name: "Hades",
        title: "Infernal Schemer",
        characteristics: ["dreamborn", "villain", "deity"],
        text: [
            "~~IS THERE A DOWNSIDE TO THIS?~~ When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
        ],
        type: "character",
        flavour:
            "“He's gotta have a weakness, because everybody's got a weakness.”",
        color: "sapphire",
        cost: 7,
        strength: 3,
        willpower: 6,
        lore: 2,
        language: "EN",
        illustrator: "Matthew Robert Davies",
        number: 147,
        set: "TFC",
        rarity: "legendary",
        actionChecks: generateActionChecks({}),
        actions: generateActions({}),
        triggers: generateTriggers({
            play: gameState => {
                const options = getDefenderFieldCharacters(gameState);

                if (options.length === 0) {
                    return { ...gameState };
                }

                gameState.inputStage = {
                    type: "play",
                    prompt: "Choose a character to put into their player's inkwell.",
                    options: options,
                    callback: choice => {
                        if (
                            typeof choice === "string" ||
                            Array.isArray(choice)
                        ) {
                            return { ...gameState };
                        }

                        choice.zone = "inkwell";
                        choice.exerted = true;

                        return { ...gameState };
                    },
                };

                return { ...gameState };
            },
        }),
        staticAbilities: {
            sing: { active: true },
            challenger: { active: false },
            evasive: { active: false },
            resist: { active: false },
        },
        inkwell: false,
        modifiers: [],
    },
];

export default SapphireCards;
