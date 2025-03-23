"use client";

import React from 'react'
import { Loader } from 'lucide-react';

function loading() {

  return (
    <div className='flex h-[calc(100vh-140px)] w-full items-center justify-center'>
    <h1 className="text-2xl font-bold tracking-tighter md:text-5xl lg:text-4xl">
    <Loader style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary" />
    </h1>
    </div>
  )
}

export default loading