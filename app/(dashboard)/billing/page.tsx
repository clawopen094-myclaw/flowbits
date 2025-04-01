import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits"
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CoinsIcon } from "lucide-react"

async function BillingPage() {
  return (
    <div>
        <h1 className="text-xl font-semibold">Billing</h1>
        <BalanceCard />
    </div>
  )
}

async function BalanceCard(){
    const balance = await GetAvailableCredits()
    return (
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background flex justify-between flex-col overflow-hidden">
        <CardContent className="p-3 relative items-center">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Available Credits</h3>
                    <p className="text-2xl font-bold text-primary/80 dark:text-primary/80">
                    <ReactCountUpWrapper value={balance}/>
                    </p>
                </div>
                <CoinsIcon size={150} className="text-primary opacity-20 absolute top-1 bottom-0 right-0" />
            </div>
        </CardContent>
        <CardFooter className="text-sm p-3 pt-0">
            When your credits balance reaches zero, your workflows will stop working
        </CardFooter>
    </Card>
    )
}

export default BillingPage