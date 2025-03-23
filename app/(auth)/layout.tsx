"use client"

import React from 'react'
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Squares from '@/components/Squares/Squares';
import Donut from '@/components/Squares/Donut';
import WaveMesh from '@/components/Squares/Donut';

function layout({children}:{children: React.ReactNode}) {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Squares 
      speed={0.4} 
      squareSize={40}
      direction='diagonal' // up, down, left, right, diagonal
      borderColor='#252427'
      hoverFillColor='#222'
      />
      <BackgroundGradient className="p-0.5">
        {children}
      </BackgroundGradient>
    </div>
  )
}

export default layout