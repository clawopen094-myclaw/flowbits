import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeft } from "lucide-react"

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar()

  return <Button className="absolute top-16 left-[13px] z-10" variant="outline" size="sm" onClick={toggleSidebar}>
   <PanelLeft/> Components
    </Button>
}
