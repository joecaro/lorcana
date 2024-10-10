import Game from "@/components/lorcana";
import { Toaster } from "sonner";

export default function Page() {
    return (
        <div className='h-screen max-h-screen overflow-hidden'>
            <Game />
            <Toaster />
        </div>
    );
}
