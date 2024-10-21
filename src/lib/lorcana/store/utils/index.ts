import useGameStore from "..";
import {
    Action,
    Card,
    GameState,
    MultipleCardAction,
    Zone,
} from "../../types/game";
import { getDefenderFieldCharacters } from "./cards";

export function drawCard(
    gameState: GameState,
    numCards: number,
    playerId: string
) {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) {
        console.error("Player not found:", playerId);
        return gameState;
    }
    const deck = player.deck;
    const hand = player.hand;
    const drawnCards = deck
        .slice(-numCards)
        .map(c => ({ ...c, zone: "hand" as Zone }));
    player.hand = [...hand, ...drawnCards];
    player.deck = deck.slice(0, -numCards);
    console.info("Drawn cards:", drawnCards);

    gameState.players = gameState.players.map(p =>
        p.id === playerId ? player : p
    );
    return { ...gameState };
}

export function staticAbilitiesCheck(targetCard: Card, thisCard: Card) {
    let canTarget = true;
    if (targetCard.staticAbilities.evasive.active) {
        canTarget = thisCard.staticAbilities.evasive.active;
    }

    return canTarget;
}

export function findPotentialTargets(
    gameState: GameState,
    thisCard: Card
): Card[] {
    const potentialTargets = getDefenderFieldCharacters(gameState).filter(
        card => staticAbilitiesCheck(card, thisCard) && card.exerted
    );

    if (potentialTargets.length > 0) {
        console.log(thisCard.name, "can target", potentialTargets);
    }

    return potentialTargets;
}

export function findHealableCards(gameState: GameState): Card[] {
    const player = gameState.players[gameState.currentPlayer];
    const healableCards = player.field.filter(
        card =>
            card.willpower > 0 &&
            card.type === "character" &&
            card.strengthModifier < 0
    );

    return healableCards;
}

export const computeAvailableActions = (state: GameState) => {
    const player = state.players[state.currentPlayer];
    if (!player) {
        console.error("Player not found:", state.currentPlayer);
        return [];
    }

    // Process hand actions (play and ink)
    const handActions = player.hand.flatMap(card => {
        const actions = [];
        if (canPlayCard(state, card)) {
            actions.push({ type: "play", card });
        }
        if (canInkCard(state, card)) {
            actions.push({ type: "ink", card });
        }
        return actions;
    });

    // Process field actions (e.g., challenge)
    const fieldActions = player.field.flatMap(card => {
        const actions = [];
        if (canChallenge(state, card)) {
            actions.push({ type: "challenge", card });
        }
        if (canQuestCard(card)) {
            actions.push({ type: "quest", card });
        }
        if (canUseAbility(state, card)) {
            actions.push({ type: "ability", card });
        }
        // You can add more checks for other field-specific actions here if needed
        return actions;
    });

    // Combine available actions
    const available = [...handActions, ...fieldActions];

    // Static actions like pass or cancel
    const staticActions: MultipleCardAction[] = [{ type: "pass", cards: [] }];

    // Merge available actions, grouping by action type
    const newAvailableActions: MultipleCardAction[] = available
        .reduce((acc, action) => {
            const existingAction = acc.find(a => a.type === action.type);
            if (existingAction) {
                existingAction.cards.push(action.card);
            } else {
                acc.push({ type: action.type as Action, cards: [action.card] });
            }
            return acc;
        }, [] as MultipleCardAction[])
        .filter(action => action.cards.length > 0)
        .concat(staticActions);

    // If there is an input stage, allow the player to cancel the action
    if (state.inputStage) {
        newAvailableActions.push({ type: "cancel", cards: [] });
    }

    // Filter out actions that have been performed by non-human players (bots)
    return newAvailableActions.filter(
        action => player.isHuman || !state.turnFlags[action.type]
    );
};

export function applyModifiers(
    card: Card,
    actionType: Action | "challenged",
    statType: "strength" | "willpower" | "resist" | "cost"
): number {
    const currentTurn = useGameStore.getState().turn;

    const applicableModifiers = card.modifiers?.filter(mod => {
        // Check if the modifier is still valid based on its duration
        const isValid = (() => {
            switch (mod.duration) {
                case "permanent":
                    return true;
                case "until_end_of_turn":
                    return mod.turnApplied === currentTurn;
                case "until_end_of_next_turn":
                    return mod.turnApplied <= currentTurn - 1;
                case "until_damage_received":
                    return !mod.hasTriggered;
                default:
                    return false; // If the duration is unknown, consider it expired
            }
        })();

        return (
            isValid &&
            mod.type === actionType &&
            mod.stat === statType &&
            !mod.hasTriggered
        );
    });

    // Mark modifiers as triggered and set their turn if they're not permanent
    applicableModifiers?.forEach(mod => {
        if (mod.duration !== "permanent") {
            mod.hasTriggered = true;
            mod.turnApplied = currentTurn;
        }
    });

    // Calculate the final stat value considering the valid modifiers
    return applicableModifiers
        ? applicableModifiers.reduce((total, mod) => total + mod.value, 0)
        : 0;
}

export function canPlayCard(gameState: GameState, card: Card): boolean {
    const currentPlayer = gameState.players[gameState.currentPlayer];
    return (
        card.zone === "hand" &&
        currentPlayer.availableInk >= card.cost &&
        !card.exerted // Optional: add other conditions if needed
    );
}

export function canInkCard(gameState: GameState, card: Card): boolean {
    return card.zone === "hand" && !card.exerted && card.inkwell;
}

export function canQuestCard(card: Card): boolean {
    return card.zone === "field" && !card.exerted && !!card.lore;
}

export function canUseAbility(gameState: GameState, card: Card): boolean {
    return (
        card.zone === "field" &&
        !card.exerted &&
        card.abilities.some(
            ability =>
                ability.type === "user-initiated" &&
                ability.actionCheck(gameState, card)
        )
    );
}

export function canChallenge(gameState: GameState, card: Card): boolean {
    const opponentPlayer = gameState.players[(gameState.currentPlayer + 1) % 2];

    // Card must be on the field, not exerted, and there must be valid targets
    return (
        card.zone === "field" &&
        !card.exerted &&
        opponentPlayer.field.some(opponentCard => !opponentCard.exerted)
    );
}
