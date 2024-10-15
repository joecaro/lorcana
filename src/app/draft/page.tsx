import DraftSetup from "@/components/lorcana/draft-setup";
import { Toaster } from "sonner";

export default function Page() {
    return (
        <div className='h-screen max-h-screen overflow-hidden'>
            <DraftSetup />
            <Toaster />
        </div>
    );
}
