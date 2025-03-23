"use client";

import React from 'react'
import Logo from "@/components/Logo";
import myLogo from "@/public/Logo.png";
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
  import {ThemeToogle} from '@/components/themeToogle';
import {FeedbackDropdown} from "@/components/FeedbackFormDialog"
import { NavMenu } from './NavMenu';
import { DotIcon } from 'lucide-react';
import Image from 'next/image';
import UserAvailableCreditsBadge from './UserAvailableCreditsBadge';
  

function Header() {
  return (
    <header className='top-0 z-50 flex items-center justify-between py-4 h-[50px] container max-w-screen'>
    <div className='flex items-center'>
    <Image src={myLogo} alt="logo" width={30} height={30} className="rounded-md" />
    <h2 className='font-bold text-lg'>Flowbits</h2>
    </div>

    <div className='flex flex-1 flex-row items-center justify-end gap-5'>
    <UserAvailableCreditsBadge/>
    <FeedbackDropdown/>
    <NavMenu/>
    <SignedOut>
    <SignInButton />
    <SignUpButton />
    </SignedOut>
    <SignedIn>
    </SignedIn>
    </div>

</header>
  )
}

export default Header