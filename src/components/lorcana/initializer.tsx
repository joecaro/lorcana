import { useEffect } from "react";
import useGameStore from "@/lib/lorcana/store";
import { ParamPlayer } from "@/lib/lorcana/types/game";

export default function useGameInitializer({
    player1,
    player2,
}: {
    player1: ParamPlayer;
    player2: ParamPlayer;
}) {
    const initialize = useGameStore(state => state.initializeParamPlayers);

    useEffect(() => {
        initialize([player1, player2]);
    }, []);

    return null;
}
