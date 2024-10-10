"use client";
import React, { useState, useRef } from "react";
import { mix, motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/lib/lorcanito/types/game";
import { MagicCard } from "../card-maker";
import { cn } from "@/lib/utils";
import useGameStore from "@/lib/lorcanito/store";

import "./card.css";

const MOVE_THRESHOLD = 30; // Pixel threshold for movement detection

const movedPastThreshold = (transform: { x: number; y: number }): boolean =>
    Math.abs(transform.x) > MOVE_THRESHOLD ||
    Math.abs(transform.y) > MOVE_THRESHOLD;

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
            characteristics={card.characteristics}
            descriptions={card.text}
            flavorText={[card.flavour || ""]}
            willpower={card.willpower}
            willpowerModifier={card.willpowerModifier}
            strength={card.strength}
            strengthModifier={card.strengthModifier}
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
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id: card.id });

    const inputStage = useGameStore(state => state.inputStage);

    const isOption = (card: Card) =>
        !!inputStage &&
        !!inputStage.options.find(
            c => typeof c === "object" && c.id === card.id
        );

    const startPos = useRef<{ x: number; y: number } | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });
    const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent browser default behavior

        // Check if the event is a touch event
        const isTouchEvent = "touches" in e;
        const startX = isTouchEvent
            ? (e as React.TouchEvent).touches[0].clientX
            : (e as React.MouseEvent).clientX;
        const startY = isTouchEvent
            ? (e as React.TouchEvent).touches[0].clientY
            : (e as React.MouseEvent).clientY;

        startPos.current = { x: startX, y: startY };
    };

    const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();

        // Check if the event is a touch event
        const isTouchEvent = "changedTouches" in e;
        const endX = isTouchEvent
            ? (e as React.TouchEvent).changedTouches[0].clientX
            : (e as React.MouseEvent).clientX;
        const endY = isTouchEvent
            ? (e as React.TouchEvent).changedTouches[0].clientY
            : (e as React.MouseEvent).clientY;

        // Check if the mouse movement was within the threshold to be considered a click
        if (startPos.current) {
            const distanceMoved = Math.sqrt(
                Math.pow(endX - startPos.current.x, 2) +
                    Math.pow(endY - startPos.current.y, 2)
            );
            if (distanceMoved < MOVE_THRESHOLD && isOption(card)) {
                inputStage?.callback(card); // Handle click action
            }
        }
        startPos.current = null;
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

    const unSnap = transform && movedPastThreshold(transform);
    const motionStyle = transform
        ? {
              x: unSnap ? transform.x : 0,
              y: unSnap ? transform.y : 0,
              rotation: unSnap ? mix(transform.x / 100, 0, 360) : "initial",
              zIndex: isDragging ? 9999 : "auto",
              boxShadow: isDragging
                  ? "0px 0px 15px rgba(0, 0, 0, 0.3)"
                  : "0px 0px 8px rgba(0, 0, 0, 0.1)",
          }
        : {};

    const cardStyle = {
        "--pointer-x": `${shinePosition.x}%`,
        "--pointer-y": `${shinePosition.y}%`,
        "--rotate-x": `${rotation.rotateX}deg`,
        "--rotate-y": `${rotation.rotateY}deg`,
        "--pointer-from-center": `${
            (shinePosition.x / 100 + shinePosition.y / 100) / 2
        }`,
        "--space": "5%",
        "--foil-url": card.foilUrl,
        transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
        touchAction: "none",
        width: "7rem",
        height: square ? "7rem" : "10rem",
        border: "1px solid black",
        borderBottom: square ? "5px solid black" : "1px solid black",
        boxShadow: `0 0 0 1px ${isOption(card) ? "green" : "#fff"}`,
        ...motionStyle,
    };

    return (
        <motion.div
            id={"hand" + card.id}
            ref={el => {
                setNodeRef(el);
                cardRef.current = el;
            }}
            {...listeners}
            {...attributes}
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
                scale: 2.2,
                height: "10rem",
                zIndex: 10,
                rotateX: rotation.rotateX,
                rotateY: rotation.rotateY,
            }}
            whileTap={{ scale: 1.8 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
            <div className='diffuse-layer' />

            <div className='foil-layer' />

            <div className='holo-layer' />

            <div className='glare-layer' />

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
