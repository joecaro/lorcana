import React from "react";
import "mana-font";
import "keyrune";
import { colorIcons, formatter, rarityIcons } from "./utils";
import { Shield, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";
import Sun from "../svg/Sun";
import Image from "next/image";

export interface CardProps {
    name: string;
    title: string;
    type: string;
    characteristics: string[];
    cardCost: string;
    willpower: number;
    willpowerModifier: number;
    strength: number;
    strengthModifier: number;
    descriptions: string[];
    flavorText?: string[];
    artUrl?: string;
    footerLeftText?: string[];
    footerRightText?: string[];
    cardColor: CardColor;
    rarity: Rarity;
    lore: number;
    className?: string;
    hideCardDetails?: boolean;
    inkwell?: boolean;
}

export type Rarity =
    | "common"
    | "uncommon"
    | "rare"
    | "super rare"
    | "legendary"
    | "enchanted";

export type CardColor =
    | "amber"
    | "amethyst"
    | "emerald"
    | "ruby"
    | "sapphire"
    | "steel";

const GameCard: React.FC<CardProps> = props => {
    const darkColor =
        props.cardColor === "amber"
            ? "bg-amber-700"
            : props.cardColor === "amethyst"
            ? "bg-amethyst-700"
            : props.cardColor === "emerald"
            ? "bg-emerald-800"
            : props.cardColor === "ruby"
            ? "bg-ruby-700"
            : props.cardColor === "sapphire"
            ? "bg-sapphire-700"
            : "bg-steel-800";

    const caretClass =
        props.cardColor === "amber"
            ? "fill-amber-700 stroke-amber-700"
            : props.cardColor === "amethyst"
            ? "fill-amethyst-700 stroke-amethyst-700"
            : props.cardColor === "emerald"
            ? "fill-emerald-800 stroke-emerald-800"
            : props.cardColor === "ruby"
            ? "fill-ruby-700 stroke-ruby-700"
            : props.cardColor === "sapphire"
            ? "fill-sapphire-700 stroke-sapphire-700"
            : "fill-steel-800 stroke-steel-800";

    const lightColor =
        props.cardColor === "amber"
            ? "bg-amber-300"
            : props.cardColor === "amethyst"
            ? "bg-amethyst-500"
            : props.cardColor === "emerald"
            ? "bg-emerald-600"
            : props.cardColor === "ruby"
            ? "bg-ruby-500"
            : props.cardColor === "sapphire"
            ? "bg-sapphire-400"
            : "bg-steel-400";

    const lightText =
        props.cardColor === "amber"
            ? "text-amber-200"
            : props.cardColor === "amethyst"
            ? "text-amethyst-200"
            : props.cardColor === "emerald"
            ? "text-emerald-100"
            : props.cardColor === "ruby"
            ? "text-ruby-200"
            : props.cardColor === "sapphire"
            ? "text-sapphire-200"
            : "text-steel-200";

    const lightSvg =
        props.cardColor === "amber"
            ? "fill-amber-100 stroke-amber-700"
            : props.cardColor === "amethyst"
            ? "fill-amethyst-100 stroke-amethyst-700"
            : props.cardColor === "emerald"
            ? "fill-emerald-100 stroke-emerald-700"
            : props.cardColor === "ruby"
            ? "fill-ruby-100 stroke-ruby-700"
            : props.cardColor === "sapphire"
            ? "fill-sapphire-100 stroke-sapphire-700"
            : "fill-steel-100 stroke-steel-700";

    const darkSvg =
        props.cardColor === "amber"
            ? "fill-amber-500 stroke-amber-100"
            : props.cardColor === "amethyst"
            ? "fill-amethyst-500 stroke-amethyst-100"
            : props.cardColor === "emerald"
            ? "fill-emerald-500 stroke-emerald-100"
            : props.cardColor === "ruby"
            ? "fill-ruby-500 stroke-ruby-100"
            : props.cardColor === "sapphire"
            ? "fill-sapphire-500 stroke-sapphire-100"
            : "fill-steel-500 stroke-steel-100";

    return (
        <div
            className={cn(
                "border border-steel-900 w-28 h-40 overflow-hidden box-border bg-steel-900 p-1 flex flex-col relative font-manrope",
                props.className
            )}
        >
            <div className='flex flex-col flex-grow font-manrope'>
                {/* Cost */}
                <div
                    className={cn(
                        `absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-[0%_0%_50%_50%] bg-steel-900 flex items-center justify-center`,
                        props.hideCardDetails && "hidden"
                    )}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {props.inkwell && (
                        <Image
                            layout='fill'
                            sizes="18px"
                            className='absolute top-0 left-0 right-0 bottom-0'
                            src='/inkable.png'
                            alt='inkable'
                        />
                    )}
                    <p className='text-[5px]'>{props.cardCost || 1}</p>
                </div>

                {/* Image */}
                <div className='h-[80px] bg-gray-50'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className='h-full w-full object-center object-cover'
                        src={
                            props.hideCardDetails
                                ? "/card-back.jpg"
                                : props.artUrl
                        }
                        alt='card art'
                    />
                </div>

                {/* Name */}
                <div
                    className={[
                        "flex justify-between z-20 relative",
                        lightColor,
                        props.hideCardDetails && "hidden",
                    ].join(" ")}
                >
                    <div className='flex flex-col items-start p-[0.1rem]'>
                        <div className='font-medium text-[7px]'>
                            {props.name}
                        </div>
                        <div className='font-medium text-[4px] -mt-[2px]'>
                            {props.title}
                        </div>
                    </div>
                    {!!props.strength && !!props.willpower && (
                        <div className='flex items-center absolute right-0 top-1/2 -translate-y-1/2'>
                            <div className='relative -mr-1 z-10'>
                                <Sun
                                    size={13}
                                    className={cn("stroke-2", lightSvg)}
                                />
                                <span
                                    className={cn(
                                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-3xl text-[7px] text-neutral-900",
                                        props.willpowerModifier > 0
                                            ? "text-blue-600"
                                            : props.willpowerModifier < 0
                                            ? "text-red-500"
                                            : ""
                                    )}
                                >
                                    {props.willpower + props.willpowerModifier}
                                </span>
                            </div>
                            <div className='relative'>
                                <Shield
                                    fill='#aaa'
                                    size={13}
                                    strokeWidth={1}
                                    className={cn(darkSvg)}
                                />
                                <span
                                    className={cn(
                                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px]",
                                        props.strengthModifier > 0
                                            ? "text-blue-300"
                                            : props.strengthModifier < 0
                                            ? "text-red-300"
                                            : ""
                                    )}
                                >
                                    {props.strength + props.strengthModifier}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sub Info */}
                <div
                    className={cn(
                        darkColor,
                        "relative flex justify-center",
                        props.hideCardDetails && "hidden"
                    )}
                >
                    <div className={"h-[120%] absolute left-0.5 -top-[10%]"}>
                        <Image
                            layout='fill'
                            sizes="20px"
                            className='h-full object-contain'
                            src={colorIcons[props.cardColor]}
                            alt='expansion-icon'
                        />
                    </div>
                    <div className={cn(lightText, " text-[4px]")}>
                        {props.characteristics.map((characteristic, index) => (
                            <span key={characteristic}>
                                {index > 0 && " • "}
                                {characteristic}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Text Box */}
                <div
                    className={cn(
                        `grid grid-cols-[1fr_0.75rem] flex-grow bg-[url("/bkgd.jpg")] bg-no-repeat bg-center bg-cover`,
                        props.hideCardDetails && "hidden"
                    )}
                >
                    <div
                        className={`flex flex-col justify-around items-start text-start p-[0.1rem]`}
                    >
                        {props.descriptions?.map((text, index, { length }) => {
                            const formattedText = formatter(text);
                            return (
                                <p
                                    key={index}
                                    className={`description text-neutral-900 font-manrope text-[4px] ${
                                        index < length
                                            ? " ftb-inner-margin"
                                            : ""
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: formattedText,
                                    }}
                                />
                            );
                        })}
                        {(props.flavorText?.length || 0) > 0 && (
                            <span className='w-full h-[0.25px] bg-gradient-to-r from-neutral-600 to-transparent' />
                        )}
                        {props.flavorText?.map((text, index) => (
                            <p
                                key={index}
                                className='text-neutral-900 text-[4px]'
                                dangerouslySetInnerHTML={{ __html: text }}
                            />
                        ))}
                    </div>
                    <div className='relative text-neutral-900 bg-yellow-100 bg-opacity-30 flex flex-col gap-[2px] justify-center items-center text-[4px]'>
                        <Triangle
                            className={cn(
                                caretClass,
                                "rotate-180 absolute -top-[1px] -left-[1.5px]"
                            )}
                            size={3}
                        />
                        <Triangle
                            className={cn(
                                "fill-steel-900 stroke-steel-900 absolute -bottom-[1px] -left-[1.5px]"
                            )}
                            size={3}
                        />
                        {Array.from({ length: props.lore }).map((_, index) => (
                            <p
                                key={props.name + "lore" + index}
                                className='text-[5px]'
                            >
                                △
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div
                className={cn(
                    "grid grid-cols-[1fr_20px_1fr]",
                    props.hideCardDetails && "hidden"
                )}
            >
                <div className='flex flex-col text-[3px] flex-grow'>
                    {props.footerLeftText?.map((text, index) => (
                        <p
                            dangerouslySetInnerHTML={{ __html: text }}
                            key={index}
                        />
                    ))}
                </div>

                <div className='w-2 justify-self-center relative'>
                    <Image
                        layout='fill'
                        sizes="20px"    
                        className='object-contain w-full h-full'
                        src={rarityIcons[props.rarity]}
                        alt={props.rarity}
                    />
                </div>

                <div className='flex flex-col flex-grow items-end text-[3px]'>
                    {props.footerRightText?.map((text, index) => (
                        <p
                            dangerouslySetInnerHTML={{ __html: text }}
                            key={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export { GameCard };
