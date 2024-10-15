import cards from "@/lib/lorcana/store/test-cards";
import { cn } from "@/lib/utils";

const bgColors = {
    amber: "bg-amber-400",
    amethyst: "bg-amethyst-400",
    emerald: "bg-emerald-500",
    ruby: "bg-ruby-400",
    sapphire: "bg-sapphire-400",
    steel: "bg-steel-400",
};

export default function DeckStats({deck}: {deck: { [key: string]: number }}) {
    return (
        <div className='border p-2'>
            <p>Stats</p>
            <div className='flex  p-2'>
                {Object.entries(
                    Object.entries(deck).reduce(
                        (acc, [card, count]) => {
                            const cardObj = cards.find(c => c.slug === card);

                            if (!cardObj) return acc;

                            acc[cardObj.cost] =
                                (acc[cardObj.cost] || 0) + count;
                            return acc;
                        },
                        {
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                        } as { [key: number]: number }
                    )
                ).map(([cost, count]) => (
                    <div
                        key={cost}
                        className='flex flex-col items-center gap-2'
                    >
                        <div className='w-4 bg-gray-300 h-16 rounded flex items-end'>
                            <div
                                className='w-full rounded bg-blue-500'
                                style={{
                                    height: `${(count / 10) * 100}%`,
                                }}
                            />
                        </div>
                        <div className='w-6 h-6 bg-gray-600 flex items-center justify-center'>
                            {cost}
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-col  p-2'>
                {Object.entries(
                    Object.entries(deck).reduce(
                        (acc, [card, count]) => {
                            const cardObj = cards.find(c => c.slug === card);

                            if (!cardObj) return acc;

                            acc[cardObj.color] = acc[cardObj.color] + count;

                            return acc;
                        },
                        {
                            amber: 0,
                            amethyst: 0,
                            emerald: 0,
                            ruby: 0,
                            sapphire: 0,
                            steel: 0,
                        } as { [key in keyof typeof bgColors]: number }
                    )
                ).map(([color, count]) => (
                    <div key={color} className='flex items-center gap-2'>
                        <div className='min-w-16 text-center h-6 bg-gray-600'>
                            {color}
                        </div>
                        <div className='w-full bg-gray-300 h-4 rounded flex items-end'>
                            <div
                                className={cn(
                                    "h-full rounded",
                                    bgColors[color as keyof typeof bgColors]
                                )}
                                style={{
                                    width: `${(count / 10) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-col  p-2'>
                {Object.entries(
                    Object.entries(deck).reduce(
                        (acc, [card, count]) => {
                            const cardObj = cards.find(c => c.slug === card);

                            if (!cardObj) return acc;

                            acc[cardObj.type] = acc[cardObj.type] + count;

                            return acc;
                        },
                        {
                            character: 0,
                            item: 0,
                            location: 0,
                        } as { [key: string]: number }
                    )
                ).map(([color, count]) => (
                    <div key={color} className='flex items-center gap-2'>
                        <div className='min-w-16 text-center h-6 bg-gray-600'>
                            {color}
                        </div>
                        <div className='w-full bg-gray-300 h-4 rounded flex items-end'>
                            <div
                                className={cn("h-full rounded bg-blue-700")}
                                style={{
                                    width: `${(count / 10) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
