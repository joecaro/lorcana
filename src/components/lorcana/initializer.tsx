import { useEffect } from "react";
import useGameStore from "@/lib/lorcana/store";

export default function useGameInitializer() {
    const initialize = useGameStore(state => state.initializePlayerDecks);
    
    useEffect(() => {
        initialize();
    }, []);

    return null;
}
