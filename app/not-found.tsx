"use client"

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";


export default function NotFoundPage() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="flex flex-col">
      <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-blue-300 via-blue-500 to-blue-700 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="text-9xl">404</span>
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 py-4">
            <span className="text-9xl">404</span>
          </div>
        </div>
      </h2>
      <p className="font-extralight text-4xl">
        Oops! Page not found :(
      </p>
      </div>

    </BackgroundBeamsWithCollision>
  );
}