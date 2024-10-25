import {
    BaseCard,
    Card,
    CardAction,
    GameState,
    Player,
} from "../../types/game";

export function createSingerText(num: number) {
    return `**Singer ${num}**: This character counts as cost ${num} to sing songs.`;
}

export function createChallengerText(num: number) {
    return `**Challenger +${num}**: (Character willpower increases by 1 when challenging).`;
}

export function createResistText(num: number) {
    return `**Resist +${num}**: (Damage dealt to this character is reduced by 1).`;
}

export function createBodyguardText() {
    return `**Bodyguard**: (this character may enter play exerted. An opposing character who challenges one of your characters must choose one with bodyguard if able.).`;
}

export const evasiveText = `**Evasive**: This character cannot be challenged.`;

export function create(card: BaseCard, ownerId: string): Card {
    return {
        ...card,
        id: Math.random().toString(36),
        owner: ownerId,
        exerted: false,
        zone: "deck",
        turnPlayed: null,
        strengthModifier: 0,
        willpowerModifier: 0,
        loreModifier: 0,
        isFoil:
            card.rarity === "legendary" || card.rarity === "super rare"
                ? Math.random() < 0.4
                : Math.random() < 0.1,
    };
}

export function createCards(
    cards: BaseCard[],
    ownerId: string,
    fill?: boolean
): Card[] {
    return cards
        .reduce((acc: BaseCard[], card) => {
            // Set the probability factor based on the rarity of the card
            const rarityFactor = getRarityFactor(card.rarity);

            // Generate a random number of copies, weighted toward more copies for lower rarity
            const numCopies = fill
                ? Math.min(
                      Math.max(
                          1,
                          Math.floor(Math.random() ** (1 / rarityFactor) * 4)
                      ),
                      4
                  )
                : 1;

            return [...acc, ...Array(numCopies).fill(card)];
        }, [])
        .map(c => create(c, ownerId));
}

// Helper function to determine the rarity factor
function getRarityFactor(rarity: string): number {
    switch (rarity) {
        case "common":
            return 1.25;
        case "uncommon":
            return 1.5;
        case "rare":
            return 2;
        case "super rare":
            return 2.5;
        case "legendary":
            return 3;
        default:
            return 1.25; // Default factor for undefined rarities
    }
}
// check/action utils
export function getAttackerField(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].field;
}

export function getAttackerFieldCharacters(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].field.filter(
        card => card.type === "character"
    );
}

export function getAttackerFieldItems(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].field.filter(
        card => card.type === "item"
    );
}

export function getDefenderField(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer === 0 ? 1 : 0].field;
}

export function getDefenderFieldCharacters(gameState: GameState): Card[] {
    return gameState.players[
        gameState.currentPlayer === 0 ? 1 : 0
    ].field.filter(card => card.type === "character");
}

export function getDefenderFieldItems(gameState: GameState): Card[] {
    return gameState.players[
        gameState.currentPlayer === 0 ? 1 : 0
    ].field.filter(card => card.type === "item");
}

export function getAttackerHand(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].hand;
}

export function getDefenderHand(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer === 0 ? 1 : 0].hand;
}

export function getAttackerInkwell(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].inkwell;
}

export function getDefenderInkwell(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer === 0 ? 1 : 0].inkwell;
}

export function getAttackerDiscard(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer].discard;
}

export function getDefenderDiscard(gameState: GameState): Card[] {
    return gameState.players[gameState.currentPlayer === 0 ? 1 : 0].discard;
}

export function getXCardFromPlayerDeck(
    gameState: GameState,
    playerIdx: number,
    num: number
): Card[] {
    return gameState.players[playerIdx].deck.slice(0, num);
}

export function exertPlayerCard(player: Player, card: Card) {
    player.field = player.field.map(c =>
        c.id === card.id ? { ...c, exerted: true } : c
    );
    return player;
}

export function baseAbilityCheck(
    gameState: GameState,
    thisCard: Card
): CardAction | null {
    const inkDrying =
        thisCard.turnPlayed !== null && thisCard.turnPlayed >= gameState.turn;
    const isAction = thisCard.type === "action";
    const player = gameState.players[gameState.currentPlayer];

    if (isAction && player.availableInk < thisCard.cost) {
        return { type: "ability", card: thisCard };
    }
    if (thisCard.exerted || inkDrying || thisCard.zone !== "field") {
        return null;
    }
    return { type: "ability", card: thisCard };
}

// Matchers

export function matches(card: Card, match: Partial<Card>): boolean {
    return Object.keys(match).every(key => {
        if (key === "characteristics") {
            return hasCharacteristics(card, match.characteristics!);
        }
        return card[key as keyof Card] === match[key as keyof Card];
    });
}

export function hasCharacteristics(
    card: Card,
    characteristics: string[]
): boolean {
    return characteristics.every(c => card.characteristics.includes(c));
}
