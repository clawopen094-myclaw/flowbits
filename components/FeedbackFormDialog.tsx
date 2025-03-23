"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Frown, Meh, SmilePlus, Smile } from "lucide-react"
import Link from "next/link"

export function FeedbackDropdown() {
  const [selectedEmoji, setSelectedEmoji] = React.useState<number | null>(null)
  const [feedback, setFeedback] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const emojis = [
    { icon: SmilePlus, label: "Very satisfied" },
    { icon: Smile, label: "Satisfied" },
    { icon: Meh, label: "Neutral" },
    { icon: Frown, label: "Dissatisfied" },
  ]

  const handleSend = () => {
    // Handle sending feedback here
    setOpen(false)
    setFeedback("")
    setSelectedEmoji(null)
  }

  const Icon = ({height,width,stroke}:{height:number, width:number, stroke:string}) => (
    <svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 14C7 14 8.5 16 11 16C13.5 16 15 14 15 14" stroke={stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.90519 6.06185C7.91395 6.04328 7.92749 6.02765 7.94428 6.01672C7.96106 6.00579 7.98042 6 8.00018 6C8.01994 6 8.0393 6.00579 8.05608 6.01672C8.07287 6.02765 8.08641 6.04328 8.09517 6.06185L8.55713 7.04318C8.58756 7.10777 8.63249 7.16365 8.68804 7.20602C8.7436 7.2484 8.80813 7.276 8.8761 7.28647L9.90921 7.44502C9.92878 7.448 9.94717 7.45666 9.9623 7.47002C9.97743 7.48339 9.98869 7.50093 9.9948 7.52065C10.0009 7.54038 10.0017 7.56151 9.99692 7.58165C9.99218 7.60179 9.98216 7.62014 9.968 7.63462L9.22087 8.39762C9.1716 8.44798 9.13473 8.51014 9.11345 8.57875C9.09216 8.64736 9.08709 8.72037 9.09868 8.79149L9.27506 9.86951C9.27852 9.89003 9.27641 9.91116 9.26896 9.93048C9.26152 9.9498 9.24905 9.96653 9.23298 9.97878C9.2169 9.99103 9.19787 9.99829 9.17805 9.99973C9.15823 10.0012 9.13842 9.99675 9.12088 9.98696L8.19736 9.47773C8.13651 9.44422 8.06881 9.42672 8.00008 9.42672C7.93135 9.42672 7.86365 9.44422 7.8028 9.47773L6.87948 9.98696C6.86195 9.99669 6.84216 10.0011 6.82238 9.9996C6.80259 9.99812 6.78359 9.99085 6.76755 9.97862C6.75151 9.96638 6.73906 9.94967 6.73163 9.93038C6.72419 9.91109 6.72207 9.89 6.72549 9.86951L6.90168 8.7917C6.91332 8.72055 6.90827 8.64749 6.88699 8.57884C6.8657 8.51018 6.82881 8.44799 6.77949 8.39762L6.03236 7.63483C6.01808 7.62036 6.00796 7.60198 6.00315 7.58178C5.99835 7.56158 5.99905 7.54037 6.00518 7.52057C6.0113 7.50076 6.02261 7.48316 6.03781 7.46977C6.05301 7.45637 6.07149 7.44773 6.09115 7.44481L7.12406 7.28647C7.1921 7.27608 7.25672 7.24852 7.31236 7.20614C7.36799 7.16376 7.41297 7.10783 7.44343 7.04318L7.90519 6.06185Z" fill="#D1A72A"/>
<path d="M13.9052 6.06185C13.914 6.04328 13.9275 6.02765 13.9443 6.01672C13.9611 6.00579 13.9804 6 14.0002 6C14.0199 6 14.0393 6.00579 14.0561 6.01672C14.0729 6.02765 14.0864 6.04328 14.0952 6.06185L14.5571 7.04318C14.5876 7.10777 14.6325 7.16365 14.688 7.20602C14.7436 7.2484 14.8081 7.276 14.8761 7.28647L15.9092 7.44502C15.9288 7.448 15.9472 7.45666 15.9623 7.47002C15.9774 7.48339 15.9887 7.50093 15.9948 7.52065C16.0009 7.54038 16.0017 7.56151 15.9969 7.58165C15.9922 7.60179 15.9822 7.62014 15.968 7.63462L15.2209 8.39762C15.1716 8.44798 15.1347 8.51014 15.1134 8.57875C15.0922 8.64736 15.0871 8.72037 15.0987 8.79149L15.2751 9.86951C15.2785 9.89003 15.2764 9.91116 15.269 9.93048C15.2615 9.9498 15.2491 9.96653 15.233 9.97878C15.2169 9.99103 15.1979 9.99829 15.178 9.99973C15.1582 10.0012 15.1384 9.99675 15.1209 9.98696L14.1974 9.47773C14.1365 9.44422 14.0688 9.42672 14.0001 9.42672C13.9313 9.42672 13.8636 9.44422 13.8028 9.47773L12.8795 9.98696C12.8619 9.99669 12.8422 10.0011 12.8224 9.9996C12.8026 9.99812 12.7836 9.99085 12.7675 9.97862C12.7515 9.96638 12.7391 9.94967 12.7316 9.93038C12.7242 9.91109 12.7221 9.89 12.7255 9.86951L12.9017 8.7917C12.9133 8.72055 12.9083 8.64749 12.887 8.57884C12.8657 8.51018 12.8288 8.44799 12.7795 8.39762L12.0324 7.63483C12.0181 7.62036 12.008 7.60198 12.0032 7.58178C11.9983 7.56158 11.999 7.54037 12.0052 7.52057C12.0113 7.50076 12.0226 7.48316 12.0378 7.46977C12.053 7.45637 12.0715 7.44773 12.0912 7.44481L13.1241 7.28647C13.1921 7.27608 13.2567 7.24852 13.3124 7.20614C13.368 7.16376 13.413 7.10783 13.4434 7.04318L13.9052 6.06185Z" fill="#D1A72A"/>
<line x1="7" y1="14" x2="15" y2="14" stroke={stroke} stroke-width="2"/>
</svg>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" onClick={()=>{setSelectedEmoji(null)}}>Feedback</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[330px] p-2" align="end">
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[120px] bg-background focus-visible:ring-offset-0"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {emojis.map((emoji, index) => (
                <Link
                key={index}
                href="#"
                className={cn(
                "rounded-full p-1.5 m-0 inline-flex items-center justify-center transition-colors",
                selectedEmoji === index
                    ? "bg-blue-400/80 text-blue-800/80" // Selected state
                    : "bg-transparent hover:bg-blue-300 hover:text-blue-800"
                )}
                onClick={(e) => {
                e.preventDefault(); // Prevents page jump
                setSelectedEmoji(index); // Updates selected button
                }}
            >
                <emoji.icon className="h-5 w-5"/>
                <span className="sr-only">{emoji.label}</span>
            </Link>
              ))}
            </div>
            <Button className="px-4" size="xs" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

