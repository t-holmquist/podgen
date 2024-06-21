'use client';

import { AudioContextType, AudioProps } from "@/types";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";


const AudioContext = createContext<AudioContextType | undefined>(undefined)

const AudioProvider = ( { children }: { children: React.ReactNode }) => {

    const [audio, setAudio] = useState<AudioProps | undefined>()
    const pathname = usePathname();


    useEffect(() => {
        // Stop playing if creating podcast, because it needs playback
        if(pathname === '/create-podcast') setAudio(undefined);
    }, [pathname])

    return (
        <AudioContext.Provider value={ { audio, setAudio } }>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    const context = useContext(AudioContext);

    if(!context) throw new Error('useAudio should be used within an AudioProvider')
    
    return context;
}

export default AudioProvider