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
        options: Card[];
        maxSelections?: number;
        showDialogue?: boolean;
        stepIndex?: number;
        callback: (choice: Card) => void;
    } | null;
    turnFlags: Partial<Record<Action, boolean>>;
    initializeParamPlayers: (players: ParamPlayer[]) => void;
    allCards: BaseCard[];
};

export type ParamPlayer = {
    name: string;
    isHuman: boolean;
    sluggyDeck: string[];
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

// Modifiers for temporary or permanent effects on cards
export type Modifier = {
    type: Action | "challenged";
    stat: "strength" | "willpower" | "cost" | "resist";
    value: number;
    duration:
        | "until_end_of_turn"
        | "until_end_of_next_turn"
        | "until_action"
        | "until_damage_received"
        | "permanent";
    turnApplied: number;
    hasTriggered: boolean;
};

// Static abilities that are always active on the card
export type StaticAbility =
    | "bodyguard"
    | "evasive"
    | "challenger"
    | "reckless"
    | "evasive"
    | "resist"
    | "sing";

type BaseEffect = {
    type: string;
    target?: {
        type: "character" | "card";
        owner: "self" | "opponent" | "both";
    };
    filter?: Partial<Card>;
};

type DrawEffect = BaseEffect & {
    type: "draw";
    amount: number;
    options: number;
};

type DamageEffect = BaseEffect & {
    type: "damage";
    amount: number;
};

type HealEffect = BaseEffect & {
    type: "heal";
    amount: number;
};

type BuffEffect = BaseEffect & {
    type: "buff";
    modifierType: Action | "challenged";
    stat: "strength" | "willpower" | "resist";
    amount: number;
    duration: "until_end_of_turn" | "permanent";
};

type LoreEffect = BaseEffect & {
    type: "lore";
    amount: number;
};

type PlayEffect = BaseEffect & {
    type: "play";
};

// Card effect structure for dynamic abilities
export type Effect =
    | DrawEffect
    | DamageEffect
    | HealEffect
    | BuffEffect
    | LoreEffect
    | PlayEffect;

export type InputOptions = {
    zone: Zone;
    player: "attacker" | "defender";
    match: Partial<Card>; // Match criteria for selecting cards
    count?: number; // Number of cards to select
};

// Multi-step abilities where multiple inputs are required
export type MultiPartStep = {
    prompt: string;
    options: InputOptions;
    effect: Effect;
};

export type MultiPart = {
    steps: MultiPartStep[];
};

// Unified ability structure for all types of abilities (static, triggered, user-initiated)
type StaticCardAbility = {
    type: "static";
    name: string;
    active: boolean;
    effect?: Effect; // The effect applied by the ability (if any)
};

export type TriggeredCardAbility = {
    type: "triggered";
    trigger: Event;
    condition: (
        gameState: GameState,
        eventCard: Card | null,
        thisCard: Card
    ) => boolean;
    effect?: Effect;
    prompt?: string;
    options?: InputOptions;
    showDialogue?: boolean;
    callback?: (gameState: GameState, selectedCard: Card | null) => GameState;
};

export type UserInitiatedCardAbility = {
    type: "user-initiated";
    name: string;
    actionCheck: (gameState: GameState, thisCard: Card) => boolean;
    effect?: Effect;
    prompt: string;
    options: InputOptions;
    showDialogue?: boolean;
    callback?: (gameState: GameState, selectedCard: Card | null) => GameState & { inputStage: null };
    multiPart?: MultiPart;
};

export type CardAbility =
    | StaticCardAbility
    | TriggeredCardAbility
    | UserInitiatedCardAbility;

// Base structure for all cards
export type BaseCard = {
    implemented: boolean;
    slug: string;
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
    staticAbilities: Record<StaticAbility, { active: boolean; value?: number }>;
    abilities: CardAbility[]; // Consolidated abilities (static, triggered, user-initiated)
};

export type Card = BaseCard & {
    id: string;
    exerted: boolean;
    zone: Zone;
    owner: string;
    turnPlayed: number | null;
    strengthModifier: number;
    willpowerModifier: number;
    loreModifier: number;
    isFoil: boolean;
};

// Different zones in the game (deck, hand, field, discard)
export type Zone = "deck" | "hand" | "field" | "discard" | "inkwell";

// Action types in the game
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
    | "cancel"
    | "sing";

// Event types that can trigger abilities
export type Event =
    | Action
    | "input"
    | "start_phase"
    | "main_phase"
    | "end_phase";

// Represents a single action taken in the game (like playing a card)
export type CardAction = {
    type: Action;
    card: Card;
};

// For multiple cards affected by a single action
export type MultipleCardAction = { type: Action; cards: Card[] };
