"use client";

import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CoinsIcon, Loader } from "lucide-react";
import Link from "next/link";
import ReactCountUpWrapper from "./ReactCountUpWrapper";
import { Badge } from "./ui/badge";

function UserAvailableCreditsBadge() {
    const query = useQuery({
        queryKey: ['user-available-credits'],
        queryFn: ()=> GetAvailableCredits(),
        refetchInterval: 3 * 1000
    })

  return (
    <Badge variant="outline" className="py-1">
    <Link href={"/billing"} className={cn("flex items-center gap-2")}>
        <CoinsIcon size={20} className="text-primary"/>
        <span className="font-semibold capitalize">
            {query.isLoading && (
                <Loader size={16} style={{animation: "spin 2s linear infinite"}} className="ease-linear text-primary" />
            )}
            {!query.isLoading && query.data && <ReactCountUpWrapper value={query.data}/>}
            {!query.isLoading && !query.data && ""}
        </span>
    </Link>
    </Badge>
  )
}

export default UserAvailableCreditsBadge