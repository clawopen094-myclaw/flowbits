"use client";

import { useEffect, useState } from "react";
import RotateDevice from "@/public/icons/rotate_device.svg"
import Image from "next/image";
import { motion } from "framer-motion";

export default function ResponsiveWrapper({ children }: { children: React.ReactNode }) {
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 880);
        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {isDesktop ? (
                children
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }} // Smooth exit transition
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex flex-col gap-3 min-h-[calc(100vh-5vh)] items-center justify-center text-center text-lg m-3"
                    key="responsive-message" // Ensure correct animation handling in React
                >
                    <span className="flex gap-2 text-sm font-semibold">
                        Please rotate your device 
                        <Image alt="rotate_device" src={RotateDevice.src} height={10} width={20} />
                    </span>
                    <span className="text-sm font-bold">OR</span>
                    <span className="font-semibold text-sm">
                        Switch to a larger screen for best experience
                    </span> 
                </motion.div>
            )}
        </>
    );
}