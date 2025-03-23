import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  Loader
} from "lucide-react"

export const workflowStatus = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "PUBLISHED",
    label: "Published",
  }
]

export const statuses = [
  {
    value: "PENDING",
    label: "Pending",
    icon: CircleDashedIcon,
    color: 'stroke-muted-foreground'
  },
  {
    value: "RUNNING",
    label: "Running",
    icon: Loader,
    color: "stroke-yellow-500"
  },
  {
    value: "COMPLETED",
    label: "Completed",
    icon: CircleCheckIcon,
    color: "stroke-green-500"
  },
  {
    value: "FAILED",
    label: "Failed",
    icon: CircleXIcon,
    color: "stroke-red-500"
  }
]
