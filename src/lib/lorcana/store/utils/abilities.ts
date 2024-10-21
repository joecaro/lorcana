import { TriggeredCardAbility, Zone } from "../../types/game";
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

export const dealXDamageOnPlay = (num: number): TriggeredCardAbility => ({
    type: "triggered",
    trigger: "play",
    condition: (_, eventCard, thisCard) => eventCard?.id === thisCard.id,
    options: {
        zone: "field",
        player: "defender",
        match: { type: "character" },
    },
    callback: (gameState, selectedCard) => {
        if (selectedCard) {
            selectedCard.strengthModifier -= num;
            if (selectedCard?.strength - selectedCard?.strengthModifier) {
                gameState = moveCardToZoneReturnState(
                    gameState,
                    "field",
                    "discard",
                    selectedCard
                );
            }
        }
        return { ...gameState };
    },
});

export const healXDamageOnPlay = (num: number): TriggeredCardAbility => ({
    type: "triggered",
    trigger: "play",
    condition: (_, eventCard, thisCard) => eventCard?.id === thisCard.id,
    options: {
        zone: "field",
        player: "defender",
        match: { type: "character" },
    },
    callback: (gameState, selectedCard) => {
        if (selectedCard) {
            selectedCard.strengthModifier = Math.min(
                0,
                (selectedCard.strengthModifier += num)
            );
        }
        return { ...gameState };
    },
});

export const chooseCardFromZonToZone = (
    fromZone: Zone,
    toZone: Zone,
    trigger: TriggeredCardAbility["trigger"]
): TriggeredCardAbility => ({
    type: "triggered",
    trigger: trigger,
    options: {
        zone: fromZone,
        player: "attacker",
        match: { type: "character" },
    },
    condition: (_, eventCard, thisCard) => eventCard?.id === thisCard.id,
    callback: (gameState, selectedCard) => {
        if (selectedCard) {
            gameState = moveCardToZoneReturnState(
                gameState,
                fromZone,
                toZone,
                selectedCard
            );
        }
        return { ...gameState };
    },
});
