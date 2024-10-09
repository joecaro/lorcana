"use client";
import React, { useState, useRef } from "react";
import { mix, motion } from "framer-motion";
// import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/lib/lorcanito/types/game";
import { MagicCard } from "../card-maker";
import { cn } from "@/lib/utils";
import useGameStore from "@/lib/lorcanito/store";

// const MOVE_THRESHOLD = 30; // Pixel threshold for movement detection

// const movedPastThreshold = (transform: { x: number; y: number }): boolean =>
//     Math.abs(transform.x) > MOVE_THRESHOLD ||
//     Math.abs(transform.y) > MOVE_THRESHOLD;

const CardUI: React.FC<{
    card: Card;
    hideCardDetails?: boolean;
}> = ({ card, hideCardDetails }) => {
    return (
        <MagicCard
            className={cn(card.exerted && "opacity-50")}
            cardColor={card.color}
            rarity={card.rarity}
            artUrl={card.url}
            hideCardDetails={hideCardDetails}
            cardCost={card.cost.toString()}
            name={card.name}
            title={card.title}
            type={card.type}
            descriptions={card.text}
            flavorText={[card.flavour || ""]}
            willpower={card.willpower.toString()}
            strength={card.strength.toString()}
            footerLeftText={[
                card.illustrator,
                `${card.number} / ${card.language} / ${card.set}`,
            ]}
            footerRightText={["Disney Lorcana &#169;Disney"]}
            lore={card.lore}
            inkwell={card.inkwell}
        />
    );
};

const CardComp: React.FC<{
    card: Card;
    hideCardDetails?: boolean;
    square?: boolean;
    className?: string;
}> = ({ card, hideCardDetails, square, className }) => {
    // const { attributes, listeners, setNodeRef, transform, isDragging } =
    // useDraggable({ id: card.id });

    const inputStage = useGameStore(state => state.inputStage);

    const isOption = (card: Card) =>
        !!inputStage &&
        !!inputStage.options.find(
            c => typeof c === "object" && c.id === card.id
        );

        console.log(inputStage);
        

    // const startPos = useRef<{ x: number; y: number } | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });
    const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent browser default behavior
        // const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
        // const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
        // startPos.current = { x: startX, y: startY };
    };

    const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        // startPos.current = null;

        if (isOption(card)) inputStage?.callback(card);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const cardWidth = rect.width;
        const cardHeight = rect.height;
        const centerX = rect.left + cardWidth / 2;
        const centerY = rect.top + cardHeight / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate how far the mouse is from the center (max 30 degrees)
        const rotateY = ((mouseX - centerX) / cardWidth) * 30; // Rotate along the Y axis
        const rotateX = ((centerY - mouseY) / cardHeight) * 30; // Rotate along the X axis

        // Update the shine position based on the mouse position
        const pointerX = ((mouseX - rect.left) / cardWidth) * 100;
        const pointerY = ((mouseY - rect.top) / cardHeight) * 100;

        setRotation({ rotateX, rotateY });
        setShinePosition({ x: pointerX, y: pointerY });
    };

    const handleMouseLeave = () => {
        // Reset the rotation when the mouse leaves
        setRotation({ rotateX: 0, rotateY: 0 });
        setShinePosition({ x: 50, y: 50 });
    };

    // const unSnap = transform && movedPastThreshold(transform);
    // const motionStyle = transform
    //     ? {
    //           x: unSnap ? transform.x : 0,
    //           y: unSnap ? transform.y : 0,
    //           zIndex: isDragging ? 9999 : "auto",
    //           boxShadow: isDragging
    //               ? "0px 0px 15px rgba(0, 0, 0, 0.3)"
    //               : "0px 0px 8px rgba(0, 0, 0, 0.1)",
    //       }
    //     : {};

    const cardStyle = {
        "--pointer-x": `${shinePosition.x}%`,
        "--pointer-y": `${shinePosition.y}%`,
        "--rotate-x": `${rotation.rotateX}deg`,
        "--rotate-y": `${rotation.rotateY}deg`,
        transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
        touchAction: "none",
        width: "7rem",
        height: square ? "7rem" : "10rem",
        border: "1px solid black",
        borderBottom: square ? "5px solid black" : "1px solid black",
        boxShadow: `0 0 0 1px ${isOption(card) ? "green" : "#fff"}`,
        // ...motionStyle,
    };

    // Shine layer styles (using the VMAX effect)
    const shineStyle = {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transform: "translateZ(1px)",
        zIndex: 2,
        backgroundImage: `
			url("https://res.cloudinary.com/joecarothers/image/upload/v1727843332/misc/Projects/lorcana/foil_ilhiay.png"),
			repeating-linear-gradient(-33deg,
				hsl(2, 70%, 47%) 6%, 
				hsl(228, 60%, 64%) 12%, 
				hsl(176, 55%, 39%) 18%, 
				hsl(123, 68%, 35%) 24%, 
				hsl(283, 75%, 57%) 30%),
			radial-gradient(
				farthest-corner circle at ${shinePosition.x}% ${shinePosition.y}%,
				hsla(189, 76%, 77%, 0.6) 0%, 
				hsla(147, 59%, 77%, 0.6) 25%, 
				hsla(271, 55%, 69%, 0.6) 50%, 
				hsla(355, 56%, 72%, 0.6) 75%
			)`,
        backgroundBlendMode: "color-burn, soft-light",
        backgroundSize: "cover, 1100% 1100%, 600% 600%",
        filter: `brightness(2) contrast(2) saturate(1)`,
        opacity: `.3`,
        mixBlendMode: "color-dodge" as const,
        mask: `url(https://res.cloudinary.com/joecarothers/image/upload/v1727845350/misc/Projects/lorcana/mask_u5rkgf.png)`,
        maskSize: "100% 100%",
        maskPosition: "center",
        maskRepeat: "no-repeat",
    };

    // Glare layer styles
    const glareStyle = {
        position: "absolute" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transform: "translateZ(1.4px)",
        zIndex: 3,
        backgroundImage: `radial-gradient(farthest-corner circle at ${shinePosition.x}% ${shinePosition.y}%, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 100%, 1) 5%, hsl(0, 0%, 0%) 70%)`,
        filter: "brightness(4) contrast(1)",
        mixBlendMode: "overlay" as const,
        opacity: `.1`,
        // mask: `url(https://res.cloudinary.com/joecarothers/image/upload/v1727844835/misc/Projects/lorcana/mask_a6p4bj.png)`,
        // maskSize: "100% 100%", // Adjusts the size to cover the entire element
        // maskPosition: "center", // Aligns the mask to the center
        // maskRepeat: "no-repeat", // Ensures the mask is not repeated
    };

    return (
        <motion.div
            id={"hand" + card.id}
            ref={el => {
                // setNodeRef(el);
                cardRef.current = el;
            }}
            // {...listeners}
            // {...attributes}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`overflow-hidden bg-gray-400 rounded-lg shadow-md flex items-start justify-center cursor-move ${className} `}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onMouseMove={handleMouseMove} // Update rotation on mouse move
            onMouseLeave={handleMouseLeave} // Reset rotation on mouse leave
            style={cardStyle}
            whileHover={{
                scale: 1.7,
                height: "10rem",
                zIndex: 10,
                rotateX: rotation.rotateX,
                rotateY: rotation.rotateY,
            }}
            whileTap={{ scale: 1.6 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
            {/* Shine Layer */}
            {card.isFoil && <div style={shineStyle}></div>}

            {/* Glare Layer */}
            {card.isFoil && <div style={glareStyle}></div>}

            <CardUI card={card} hideCardDetails={hideCardDetails} />
            {inputStage && isOption(card) && (
                <div className='absolute top-0 left-0 w-full h-1/5 bg-black bg-opacity-50 rounded-lg'>
                    {/* display index of option */}
                    {inputStage.options.findIndex(
                        c => typeof c === "object" && c.id === card.id
                    ) + 1}
                </div>
            )}
        </motion.div>
    );
};

export default CardComp;
