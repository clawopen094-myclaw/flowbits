"use client";

import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    MonitorSmartphone,
    Plus,
    PlusCircle,
    Settings,
    SunMoon,
    User,
    UserPlus,
    Users,
  } from "lucide-react"
  import * as React from "react"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useClerk } from "@clerk/nextjs";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { useUser } from '@clerk/clerk-react';
import { ThemeToogle } from "./themeToogle";
import { Toggle } from "@/components/ui/toggle"
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
  
  export function NavMenu() {
    const { openUserProfile, signOut } = useClerk();
    const { user } = useUser();
    const { theme, setTheme } = useTheme();

    const [isSystemTheme, setIsSystemTheme] = useState(theme === "system");

    useEffect(() => {
      // This will update `isSystemTheme` state when theme changes
      if (theme === "system") {
        setIsSystemTheme(true);
      } else {
        setIsSystemTheme(false);
      }
    }, [theme]); // Runs whenever the `theme` changes
  
    const handleSystemToggle = () => {
      setTheme("system");
    };
  
    const handleManualToggle = () => {
      setTheme("light"); // or "dark" based on your logic
    };
  

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "p" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          openUserProfile()
        }
      }   
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [])
    


    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="avatar" size="avatar">
            <Avatar>
            <AvatarImage src={user?.imageUrl} alt="@shadcn" />
            <AvatarFallback>{(user?.firstName?.charAt(0) ?? "") + (user?.lastName?.charAt(0) ?? "")}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52 mr-2">
          <DropdownMenuLabel className="flex justify-between text-sm">

            <div className="flex items-center gap-2">
              <SunMoon className="h-4 w-4"/>
              <span>Theme</span>
            </div>

            <div className="flex">
              <Toggle aria-label="Toggle bold" pressed={isSystemTheme} size="theme" onClick={() => setTheme("system")}>
                <MonitorSmartphone/>
              </Toggle>
              <ThemeToogle/>
            </div>

          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => openUserProfile()}>
              <User />
              <span>Profile</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus />
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Mail />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare />
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PlusCircle />
                    <span>More...</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Github />
            <span>Star the repo</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
          <FontAwesomeIcon icon={faXTwitter} />
            <span>Follow on X</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
          <FontAwesomeIcon icon={faDiscord} />
            <span>Join Discord</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => signOut({ redirectUrl: "/sign-in" })}>
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
