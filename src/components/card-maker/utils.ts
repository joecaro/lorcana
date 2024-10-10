import { CardColor, Rarity } from ".";

export const manaIcons: { [key: string]: string } = {
    G: "ms ms-g ms-cost",
    R: "ms ms-r ms-cost",
    U: "ms ms-u ms-cost",
    B: "ms ms-b ms-cost",
    W: "ms ms-w ms-cost",
};

export const colorIcons: Record<CardColor, string> = {
    amber: "https://www.disneylorcana.com/cms/gallery/lorcana-web/inks/dlc_ink_amber.png",
    amethyst:
        "https://www.disneylorcana.com/cms/gallery/lorcana-web/inks/dlc_ink_amethyst.png",
    emerald:
        "https://www.disneylorcana.com/cms/gallery/lorcana-web/inks/dlc_ink_emerald.png",
    ruby: "https://www.disneylorcana.com/cms/gallery/lorcana-web/inks/dlc_ink_ruby.png",
    sapphire:
        "https://www.disneylorcana.com/cms/gallery/lorcana-web/inks/dlc_ink_sapphire.png",
    steel: "https://www.disneylorcana.com/cms/gallery/lorcana-web/inks/dlc_ink_steel.png",
};

export const rarityIcons: Record<Rarity, string> = {
    common: "/rarity/common.avif",
    uncommon: "/rarity/uncommon.avif",
    rare: "/rarity/rare.avif",
    "super rare": "/rarity/super-rare.avif",
    legendary: "/rarity/legendary.avif",
    enchanted: "/rarity/enchanted.avif",
};

export const manaCostMatcher = /\{(\w)\}/g;

export function manaCostParser(manaCost: string) {
    const costs = [];
    const matches = manaCost.match(manaCostMatcher);
    if (matches) {
        for (const match of matches) {
            const costMatch = manaCostMatcher.exec(match);
            if (costMatch) {
                costs.push(costMatch[1]);
            }
        }
    }
    return costs;
}

export const formatter = (str: string) =>
    str
        // Bold text (**text**)
        .replace(/\*\*(.*?)\*\*/g, '<span class="font-extrabold">$1</span>')
        // Italic text (*text*)
        .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
        // Underline text (__text__)
        .replace(/__(.*?)__/g, '<span class="underline">$1</span>')
        // Strikethrough text (~~text~~)
        .replace(
            /~~(.*?)~~/g,
            '<span class="font-extrabold bg-amber-700 px-2 text-white rounded-br-sm -ml-0.5">$1</span>'
        );
