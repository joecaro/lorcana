import { GameState } from "@/lib/lorcana/types/game";
import CardComp from "./card";
import { Button } from "../ui/button";
import { isCard } from "@/lib/lorcana/store/utils";

export default function CardSelect(props: {
    inputStage: GameState["inputStage"];
}) {
    if (!props.inputStage) return null;

    return (
        <div className='bg-black bg-opacity-25 absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center'>
            <div className='p-5 flex gap-10 bg-neutral-800 min-w-96 border-neutral-100 rounded-lg'>
                {props.inputStage.computedOptions.map(option =>
                    isCard(option) ? (
                        <CardComp key={option.id} card={option} />
                    ) : "name" in option ? (
                        <Button
                            key={option.name}
                            onClick={() => props.inputStage!.callback(option)}
                        >
                            {option.name}
                        </Button>
                    ) : null
                )}
            </div>
        </div>
    );
}
