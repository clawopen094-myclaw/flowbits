"use client";

import React from 'react';
import { Loader } from 'lucide-react';

function Loading() {
  return (
    <div className="flex h-[calc(100vh-140px)] w-full items-center justify-center">
        <Loader style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary" />
    </div>
  );
}

export default Loading;