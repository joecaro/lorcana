import TestPage from "@/components/lorcana/test";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
    return (
        <div className='flex justify-center items-center'>
            <TestPage />
            <Toaster />
        </div>
    );
}
