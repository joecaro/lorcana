import useGameStore from "..";
import {
    Action,
    Card,
    Event,
    GameState,
    MultipleCardAction,
    Zone,
} from "../../types/game";

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
    let canTarget = false;
    if (targetCard.staticAbilities.evasive.active) {
        canTarget = thisCard.staticAbilities.evasive.active;
    }

    return canTarget;
}

export function findPotentialTargets(
    gameState: GameState,
    thisCard: Card
): Card[] {
    const opponent = gameState.players[gameState.currentPlayer === 0 ? 1 : 0];
    const potentialTargets = opponent.field.filter(
        card =>
            card.strength > 0 &&
            card.exerted &&
            staticAbilitiesCheck(card, thisCard)
    );

    return potentialTargets;
}

export function findHealableCards(gameState: GameState): Card[] {
    const player = gameState.players[gameState.currentPlayer];
    const healableCards = player.field.filter(
        card => card.willpower > 0 && card.type !== "character"
    );

    return healableCards;
}

const excludedActions = ["end_game", "pass", "skip", "cancel", "draw"];

export const computeAvailableActions = (state: GameState) => {
    const player = state.players[state.currentPlayer];
    if (!player) {
        console.error("Player not found:", state.currentPlayer);
        return [];
    }

    const handActions = player.hand
        .flatMap(card => [
            card.actionChecks.play(state, card),
            card.actionChecks.ink(state, card),
            card.actionChecks.ability(state, card),
        ])
        .filter(action => action !== null);

    const fieldActions = player.field
        .flatMap(card => {
            return Object.entries(card.actionChecks).map(([key, check]) => {
                if (
                    key === "play" ||
                    key === "ink" ||
                    excludedActions.includes(key)
                )
                    return null;

                return check(state, card);
            });
        })
        .filter(action => action !== null);

    const available = [...handActions, ...fieldActions.flat()];

    const staticActions: MultipleCardAction[] = [
        // { type: "end_game", cards: [] },
        { type: "pass", cards: [] },
    ];

    const newAvailableActions: MultipleCardAction[] = available
        .reduce((acc, action) => {
            if (action) {
                if (acc.find(a => a.type === action.type)) {
                    const existingAction = acc.find(
                        a => a.type === action.type
                    );
                    if (existingAction) {
                        existingAction.cards.push(action.card);
                    }
                } else {
                    acc.push({ type: action.type, cards: [action.card] });
                }
            }
            return acc;
        }, [] as MultipleCardAction[])
        .filter(action => action.cards.length > 0)
        .concat(staticActions);

    if (state.inputStage) {
        newAvailableActions.push({ type: "cancel", cards: [] });
    }

    return newAvailableActions.filter(
        action => player.isHuman || !state.turnFlags[action.type]
    );
};

export function checkTriggers(
    gameState: GameState,
    eventType: Event,
    eventCard: Card
) {
    gameState.players.forEach(player => {
        console.groupCollapsed("Triggers");
        player.field.forEach(card => {
            const trigger = card.triggers[eventType];
            if (trigger) {
                gameState = trigger(gameState, card, eventCard);
                console.info(
                    `Trigger executed for ${card.name} on event: ${eventType}`
                );
            }
        });
        console.groupEnd();
    });

    return gameState;
}

export function applyModifiers(
    card: Card,
    actionType: Action | "challenged",
    statType: "strength" | "willpower" | "cost"
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
