import {
    TriggeredCardAbility,
    TriggeredInteractiveCardAbility,
    Zone,
} from "../../types/game";
import { moveCardToZoneReturnState } from "../actions";

export const drawXCardOnPlay = (num: number): TriggeredCardAbility => ({
    type: "triggered",
    trigger: "play",
    condition: (_, eventCard, thisCard) => eventCard?.id === thisCard.id,
    effect: {
        type: "draw",
        amount: num,
        options: 1,
    },
});

export const dealXDamageOnPlay = (
    num: number
): TriggeredInteractiveCardAbility => ({
    type: "triggered",
    prompt: "Choose a character to deal damage to",
    trigger: "play",
    condition: (_, eventCard, thisCard) => eventCard?.id === thisCard.id,
    options: {
        zone: "field",
        player: "opponent",
        match: { type: "character" },
    },
    callback: ({ gameState, selectedOption }) => {
        if (selectedOption) {
            selectedOption.strengthModifier -= num;
            if (selectedOption?.strength - selectedOption?.strengthModifier) {
                gameState = moveCardToZoneReturnState(
                    gameState,
                    "field",
                    "discard",
                    selectedOption
                );
            }
        }
        return { ...gameState };
    },
});

export const healXDamageOnPlay = (
    num: number
): TriggeredInteractiveCardAbility => ({
    type: "triggered",
    prompt: "Choose a character to heal",
    trigger: "play",
    condition: (_, eventCard, thisCard) => eventCard?.id === thisCard.id,
    options: {
        zone: "field",
        player: "self",
        match: { type: "character" },
    },
    callback: ({ gameState, selectedOption }) => {
        if (selectedOption) {
            selectedOption.strengthModifier = Math.min(
                0,
                (selectedOption.strengthModifier += num)
            );
        }
        return { ...gameState };
    },
});

export const chooseCardFromZonToZone = (
    fromZone: Zone,
    toZone: Zone,
    trigger: TriggeredCardAbility["trigger"]
): TriggeredInteractiveCardAbility => ({
    type: "triggered",
    prompt: `Choose a card to move from ${fromZone} to ${toZone}`,
    trigger: trigger,
    options: {
        zone: fromZone,
        player: "self",
        match: { type: "character" },
    },
    condition: (_, eventCard, thisCard) => eventCard?.id === thisCard.id,
    callback: ({ gameState, selectedOption }) => {
        if (selectedOption) {
            gameState = moveCardToZoneReturnState(
                gameState,
                fromZone,
                toZone,
                selectedOption
            );
        }
        return { ...gameState };
    },
});
