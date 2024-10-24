import useGameStore from "../store";
import { PLAYER_ACTIONS, processOptionSelect } from "../store/actions";
import { computeAvailableActions } from "../store/utils";
import { Action, GameState, MultipleCardAction } from "../types/game";

const ACTION_PRIORITY: Action[] = [
    "play",
    "ability",
    "challenge",
    "quest",
    "ink",
    "pass",
];

function determineBotAction(gameState: GameState): MultipleCardAction {
    const availableActions = computeAvailableActions(gameState).filter(
        a => a.type !== "pass"
    );

    console.groupCollapsed("Available Actions");
    console.dir(availableActions);
    console.groupEnd();

    const actionType = ACTION_PRIORITY.find(type =>
        availableActions.find(action => action.type === type)
    );

    const actionOfType = availableActions.filter(
        action => action.type === actionType
    )[0];

    if (!actionOfType) {
        return { type: "pass", cards: [] };
    }

    console.groupCollapsed("Bot Action");
    console.dir(actionOfType);
    console.groupEnd();

    return actionOfType;
}

export function executeBotAction() {
    const gameState = useGameStore.getState();

    if (gameState.players[gameState.currentPlayer].isHuman) {
        console.info("Player is human, skipping bot action");
        return;
    }

    // If the game is in an input stage, choose a random option
    // Otherwise, determine the bot's action
    if (gameState.inputStage) {
        const randomOption =
            gameState.inputStage.computedOptions[
                Math.floor(
                    Math.random() * gameState.inputStage.computedOptions.length
                )
            ];

        processOptionSelect(randomOption, gameState.inputStage);

        setTimeout(() => {
            executeBotAction();
        }, 1000);
    } else {
        const botAction = determineBotAction(gameState);

        PLAYER_ACTIONS[botAction.type](botAction.cards);

        if (botAction.type !== "pass") {
            setTimeout(() => {
                executeBotAction();
            }, 1000);
        }
    }
}
