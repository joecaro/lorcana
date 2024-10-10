import { Rarity } from "@/components/card-maker";

export type GameState = {
    attacker: string;
    defender: string;
    currentPlayer: number;
    players: Player[];
    phase: "start_phase" | "main_phase" | "end_phase";
    lastAction?: CardAction | null;
    turn: number;
    endOfTurnCallbacks: (() => void)[];
    debugLogs: Record<string, unknown>[];
    inputStage: {
        prompt: string;
        type: Event;
        options: Card[] | string[];
        maxSelections?: number;
        showDialogue?: boolean;
        callback: (choice: string | Card | Card[]) => void;
    } | null;
    turnFlags: Partial<Record<Action, boolean>>;
};

export type Player = {
    id: string;
    name: string;
    deck: Card[];
    hand: Card[];
    field: Card[];
    inkwell: Card[];
    availableInk: number;
    discard: Card[];
    lore: number;
    numCardsPerTurn: number;
    statePlayedThisTurn: Card[];
    stateNumInked: number;
    stateQuestedThisTurn: Card[];
    isHuman: boolean;
};

export type Modifier = {
    type: Action;
    stat: "strength" | "willpower" | "cost";
    value: number;
    duration:
        | "until_end_of_turn"
        | "until_action"
        | "until_damage_received"
        | "permanent";
    turnApplied: number;
    hasTriggered: boolean;
};

// TODO: implement resist and challenger
export type StaticAbility = "evasive" | "resist" | "challenger";

export type BaseCard = {
    implemented: boolean;
    url: string;
    name: string;
    title: string;
    foilUrl?: string;
    text: string[];
    characteristics: string[];
    flavour?: string;
    type: "character" | "item" | "action" | "song";
    inkwell: boolean;
    color: "amber" | "ruby" | "emerald" | "sapphire" | "steel" | "amethyst";
    cost: number;
    strength: number;
    willpower: number;
    lore: number;
    language: string;
    illustrator: string;
    number: number;
    set: string;
    rarity: Rarity;
    modifiers: Modifier[];
    actionChecks: Record<
        string,
        (gameState: GameState, thisCard: Card) => CardAction | null
    >;
    actions: Record<
        Action,
        (gameState: GameState, thisCard: Card) => GameState
    >;
    triggers: Record<
        Event,
        (gameState: GameState, thisCard: Card, thatCard?: Card) => GameState
    >;
    staticAbilities: Record<StaticAbility, { active: boolean; value?: number }>;
};

export type Card = BaseCard & {
    id: string;
    exerted: boolean;
    zone: Zone;
    owner: string;
    turnPlayed: number | null;
    strengthModifier: number;
    willpowerModifier: number;
    isFoil: boolean;
};

export type Zone = "deck" | "hand" | "field" | "discard" | "inkwell";

export type Action =
    | "play"
    | "quest"
    | "challenge"
    | "discard"
    | "ink"
    | "ability"
    | "draw"
    | "end_game"
    | "pass"
    | "cancel";

export type Event = Action | "start_phase" | "main_phase" | "end_phase";

export type CardAction = {
    type: Action;
    card: Card;
};

export type MultipleCardAction = { type: Action; cards: Card[] };
