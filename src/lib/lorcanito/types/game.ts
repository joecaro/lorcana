import { Rarity } from "@/components/card-maker";

export type GameState = {
    attacker: string;
    defender: string;
    currentPlayer: number; // Index or ID of the current player (1 or 2, etc.)
    players: Player[];
    phase: "start_phase" | "main_phase" | "end_phase"; // Different game phases
    lastAction?: CardAction | null; // Last action performed, for triggers
    round: number; // Current round of the game
    endOfTurnCallbacks: (() => void)[]; // Callbacks that should trigger at the end of the turn
    debugLogs: Record<string, unknown>[]; // Logs for debugging moves and events
    inputStage: {
        prompt: string; // A message or instruction for the player
        type: Event; // Type of action expected from the player
        options: Card[] | string[]; // The available choices for the player
        maxSelections?: number; // Maximum number of cards to select
        showDialogue?: boolean; // Whether to show a dialogue box
        callback: (choice: string | Card) => void; // Function to handle the player's input
    } | null; // Input stage for player choices
};

export type Player = {
    id: string;
    name: string;
    deck: Card[];
    hand: Card[]; // Cards in hand
    field: Card[]; // Cards in play
    inkwell: Card[]; // Cards in the inkwell
    availableInk: number; // Ink available to play cards
    discard: Card[]; // Discard pile
    lore: number; // Points for victory condition
    numCardsPerTurn: number; // Number of cards to draw per turn
    statePlayedThisTurn: Card[]; // Cards played in this turn
    stateNumInked: number; // Number of cards inked this turn
    stateQuestedThisTurn: Card[]; // Cards that quested this turn
    isHuman: boolean; // If the player is human or AI
};

export type Card = {
    implemented: boolean; // Whether the card is fully implemented
    id: string; // Unique identifier for the card
    url: string; // URL for the card image or information
    name: string; // Card's name
    title: string; // Subtitle or title of the card
    text: string[]; // Card text or description
    characteristics: string[]; // Characteristics like "hero", "villain", "song"
    flavour?: string; // Optional flavour text for lore or story
    type: "character" | "item" | "action" | "song"; // Card type
    inkwell: boolean; // Whether the card can be placed in the inkwell
    color: "amber" | "ruby" | "emerald" | "sapphire" | "steel" | "amethyst"; // Color of the card
    cost: number; // Cost to play the card
    strength: number; // Optional strength for character cards
    willpower: number; // Optional willpower (defense) for character cards
    lore: number; // Lore points earned when questing
    language: string; // Language of the card
    illustrator: string; // Name of the card's illustrator
    number: number; // Card number in the set
    set: string; // Set identifier
    rarity: Rarity; // Rarity of the card
    exerted?: boolean; // Whether the card is exerted (used in current turn)
    actionChecks: Record<
        string,
        (gameState: GameState, thisCard: Card) => CardAction | null
    >; // Action checks for the card
    actions: Record<
        Action,
        (gameState: GameState, thisCard: Card) => GameState
    >; // Actions the card can perform
    triggers: Record<
        Event,
        (gameState: GameState, thisCard: Card, thatCard?: Card) => GameState
    >; // Triggers associated with the card
    zone?: Zone; // Current zone of the card
    roundPlayed?: number; // Round in which the card was played
    owner?: string; // Player ID of the card owner
    strengthModifier?: number; // Temporary strength modifier
    willpowerModifier?: number; // Temporary willpower modifier
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

export type Event = 
    | Action
    | "start_phase"
    | "main_phase"
    | "end_phase"

export type CardAction = {
    type: Action;
    card: Card;
};

export type MultipleCardAction = { type: Action; cards: Card[] };
