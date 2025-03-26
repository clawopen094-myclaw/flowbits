"use client"

import CustomDialogueHeader from "@/components/CustomDialogueHeader"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, ClockIcon, RepeatIcon, TriangleAlertIcon } from "lucide-react"
import { useState, useEffect } from "react"
import cronstrue from "cronstrue"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { DialogClose } from "@radix-ui/react-dialog"
import { RainbowButton } from "@/components/magicui/rainbow-button"
import { useMutation } from "@tanstack/react-query"
import { UpdateWorkflowCrons } from "@/actions/workflows/updateWorkflowCrons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { DeleteWorkflowCrons } from "@/actions/workflows/removeWorkflowCrons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const DAYS = [
  { name: "Sun", cronId: 0 },
  { name: "Mon", cronId: 1 },
  { name: "Tue", cronId: 2 },
  { name: "Wed", cronId: 3 },
  { name: "Thu", cronId: 4 },
  { name: "Fri", cronId: 5 },
  { name: "Sat", cronId: 6 },
]

function SchedularDialog(props: { workflowId: string; cron: string; refresh: () => void }) {
  // Parse initial cron values
  const parseCron = (cron: string) => {
    if (!cron) return null

    const parts = cron.split(" ")
    if (parts.length < 5) return null

    // Check if this is an interval cron
    if (parts[0].includes("*/") || parts[1].includes("*/") || parts[2].includes("*/")) {
      let intervalValue = "1"
      let intervalUnit: "minutes" | "hours" | "days" = "hours"

      if (parts[0].includes("*/")) {
        intervalValue = parts[0].replace("*/", "")
        intervalUnit = "minutes"
      } else if (parts[1].includes("*/")) {
        intervalValue = parts[1].replace("*/", "")
        intervalUnit = "hours"
      } else if (parts[2].includes("*/")) {
        intervalValue = parts[2].replace("*/", "")
        intervalUnit = "days"
      }

      return {
        type: "interval",
        intervalValue,
        intervalUnit,
        days:
          parts[4] === "*"
            ? []
            : parts[4]
                .split(",")
                .map(Number)
                .filter((d) => d >= 0 && d <= 6),
      }
    }

    // Time parsing for specific time
    const minutes = parts[0].padStart(2, "0")
    const hours24 = Number.parseInt(parts[1], 10)
    const hours12 = hours24 % 12 || 12 // Convert 0-23 to 12-hour format
    const period = hours24 >= 12 ? "PM" : "AM"

    // Day parsing
    const days =
      parts[4] === "*"
        ? []
        : parts[4]
            .split(",")
            .map(Number)
            .filter((d) => d >= 0 && d <= 6)

    return { type: "specific", minutes, hours: hours12.toString().padStart(2, "0"), period, days }
  }

  // Initialize state with cron values if available
  const initialValues = props.cron ? parseCron(props.cron) : null

  // Determine initial schedule type
  const initialScheduleType = initialValues?.type || "specific"

  const [hours, setHours] = useState(initialValues?.type === "specific" ? initialValues.hours : "09")
  const [minutes, setMinutes] = useState(initialValues?.type === "specific" ? initialValues.minutes : "00")
  const [period, setPeriod] = useState<"AM" | "PM">(
    initialValues?.type === "specific" ? (initialValues.period as "AM" | "PM") : "AM",
  )
  const [selectedDays, setSelectedDays] = useState<number[]>(initialValues?.days || [])
  const [cronExpression, setCronExpression] = useState(props.cron || "")

  // Fix TypeScript errors with proper type assertions and fallbacks
  const [scheduleType, setScheduleType] = useState<"specific" | "interval">(
    (initialValues?.type || "specific") as "specific" | "interval",
  )

  const [intervalValue, setIntervalValue] = useState<string>(
    initialValues?.type === "interval" && initialValues.intervalValue ? initialValues.intervalValue : "1",
  )

  const [intervalUnit, setIntervalUnit] = useState<"minutes" | "hours" | "days">(
    initialValues?.type === "interval" && initialValues.intervalUnit ? initialValues.intervalUnit : "hours",
  )

  // Update state when cron prop changes
  useEffect(() => {
    if (props.cron) {
      const parsed = parseCron(props.cron)
      if (parsed) {
        if (parsed.type === "interval") {
          setScheduleType("interval")
          setIntervalValue(parsed.intervalValue || "")
          setIntervalUnit(parsed.intervalUnit as "minutes" | "hours" | "days")
          setSelectedDays(parsed.days)
        } else {
          setScheduleType("specific")
          setHours(parsed.hours)
          setMinutes(parsed.minutes)
          setPeriod(parsed.period as "AM" | "PM")
          setSelectedDays(parsed.days)
        }
        setCronExpression(props.cron)
      }
    } else {
      setScheduleType("specific")
      setHours("09")
      setMinutes("00")
      setPeriod("AM")
      setSelectedDays([])
      setIntervalValue("1")
      setIntervalUnit("hours")
      setCronExpression("")
    }
  }, [props.cron])

  // Handle day selection
  const toggleDay = (cronId: number) => {
    setSelectedDays((prev) => (prev.includes(cronId) ? prev.filter((d) => d !== cronId) : [...prev, cronId]))
  }

  // Convert to cron expression (converting 12-hour format to 24-hour)
  const generateCron = () => {
    if (scheduleType === "specific") {
      // Convert 12-hour format to 24-hour for cron
      let cronHours = Number.parseInt(hours || "")
      if (period === "PM" && cronHours < 12) {
        cronHours += 12
      } else if (period === "AM" && cronHours === 12) {
        cronHours = 0
      }

      const cronHoursStr = cronHours.toString().padStart(2, "0")
      const days = selectedDays.sort().join(",")

      return `${minutes} ${cronHoursStr} * * ${days || "*"}`
    } else {
      // Handle interval scheduling
      const days = selectedDays.sort().join(",")

      if (intervalUnit === "minutes") {
        return `*/${intervalValue} * * * ${days || "*"}`
      } else if (intervalUnit === "hours") {
        return `0 */${intervalValue} * * ${days || "*"}`
      } else {
        // days
        return `0 0 */${intervalValue} * ${days || "*"}`
      }
    }
  }

  // Get human-readable description
  const getScheduleDescription = () => {
    try {
      const cron = generateCron()

      return cronstrue
        .toString(cron, {
          verbose: false,
          dayOfWeekStartIndexZero: true,
        })
        .replace(/only on Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday/, "Everyday")
    } catch (error) {
      return "Select time and days to create schedule"
    }
  }

  const crontohumantext = (cron: string) => {
    try {
      return cronstrue
        .toString(cron, {
          verbose: false,
          dayOfWeekStartIndexZero: true,
        })
        .replace(/only on Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, and Saturday/, "Everyday")
        .replace(/Sunday/, "SUN")
        .replace(/Monday/, "MON")
        .replace(/Tuesday/, "TUE")
        .replace(/Wednesday/, "WED")
        .replace(/Thursday/, "THU")
        .replace(/Friday/, "FRI")
        .replace(/Saturday/, "SAT")
    } catch (error) {
      return "Invalid schedule"
    }
  }

  // Update cron expression when inputs change
  useEffect(() => {
    const newCron = generateCron()
    setCronExpression(newCron)
    console.log("Generated cron expression:", newCron)
  }, [hours, minutes, selectedDays, period, scheduleType, intervalValue, intervalUnit])

  // Generate hours and minutes options for 12-hour format
  const hoursOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"))

  const minutesOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const savemutation = useMutation({
    mutationFn: UpdateWorkflowCrons,
    onSuccess: () => {
      props.refresh()
      toast.success("Schedule added successfully", { id: "cron" })
    },
    onError: () => {
      toast.error("Failed to add schedule", { id: "cron" })
    },
  })

  const deletemutation = useMutation({
    mutationFn: DeleteWorkflowCrons,
    onSuccess: () => {
      props.refresh()
      toast.success("Schedule deleted successfully", { id: "cron-delete" })
    },
    onError: () => {
      toast.error("Failed to delete schedule", { id: "cron-delete" })
    },
  })

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"link"} className={cn("p-0", props.cron ? "text-green-500" : "text-orange-500")} size="xs">
            {props.cron && (
              <div className="flex items-center gap-1">
                <ClockIcon />
                <span className="overflow-x-scroll">{crontohumantext(props.cron)}</span>
              </div>
            )}

            {!props.cron && (
              <div className="flex items-center gap-1">
                <TriangleAlertIcon className="h-3 w-3" />
                <span className="">Set schedule</span>
              </div>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="px-0">
          <CustomDialogueHeader
            title="Schedule your workflow"
            icon={CalendarIcon}
            subTitle="Please note that all the time is in UTC"
          />
          <div className="px-6 space-y-4">
            <Card className="w-full max-w-md mx-auto border-0 shadow-none">
              <CardContent className="space-y-6 p-3 pt-0">
                <Tabs
                  defaultValue={scheduleType}
                  value={scheduleType}
                  onValueChange={(value) => setScheduleType(value as "specific" | "interval")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="specific" className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>Specific Time</span>
                    </TabsTrigger>
                    <TabsTrigger value="interval" className="flex items-center gap-2">
                      <RepeatIcon className="h-4 w-4" />
                      <span>Interval</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="specific" className="mt-4">
                    <div className="space-y-2 flex items-center justify-center gap-3">
                      <h3 className="text-base font-medium">Select Time:</h3>
                      <div className="flex items-center space-x-2">
                        <Select value={hours} onValueChange={setHours}>
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Hours" />
                          </SelectTrigger>
                          <SelectContent>
                            {hoursOptions.map((hour) => (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-lg">:</span>
                        <Select value={minutes} onValueChange={setMinutes}>
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Minutes" />
                          </SelectTrigger>
                          <SelectContent>
                            {minutesOptions.map((minute) => (
                              <SelectItem key={minute} value={minute}>
                                {minute}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={period}
                          onValueChange={(value: string) => {
                            if (value === "AM" || value === "PM") {
                              setPeriod(value as "AM" | "PM")
                            }
                          }}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="AM/PM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="interval" className="mt-4">
                    <div className="space-y-2 flex items-center justify-center gap-3">
                      <h3 className="text-base font-medium">Every:</h3>
                      <div className="flex items-center space-x-2">
                        <Select value={intervalValue} onValueChange={setIntervalValue}>
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Value" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => (i + 1).toString()).map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={intervalUnit}
                          onValueChange={(value: string) => {
                            if (value === "minutes" || value === "hours" || value === "days") {
                              setIntervalUnit(value as "minutes" | "hours" | "days")
                            }
                          }}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2 flex items-center justify-center gap-3">
                  <p className="text-sm font-medium">Days:</p>
                  <div className="flex flex-wrap gap-2 items-top">
                    {DAYS.map((day) => (
                      <div key={day.cronId} className="flex items-center space-x-1">
                        <Checkbox
                          id={`day-${day.cronId}`}
                          checked={selectedDays.includes(day.cronId)}
                          onCheckedChange={() => toggleDay(day.cronId)}
                        />
                        <Label
                          htmlFor={`day-${day.cronId}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-sm font-medium text-center">
                    Scheduled:{"  "}
                    {getScheduleDescription()}
                  </h4>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="px-6 space-y-2">
            {props.cron && (
              <DialogClose asChild>
                <Button
                  variant={"danger"}
                  className="w-full"
                  disabled={deletemutation.isPending || !cronExpression}
                  onClick={() => {
                    toast.loading("Deleting schedule...", { id: "cron-delete" }),
                      deletemutation.mutate(props.workflowId)
                  }}
                >
                  Delete Schedule
                </Button>
              </DialogClose>
            )}

            <DialogClose asChild>
              <RainbowButton
                className="w-full rounded-md"
                disabled={savemutation.isPending || !cronExpression}
                onClick={() => {
                  toast.loading("Saving schedule...", { id: "cron" }),
                    savemutation.mutate({ id: props.workflowId, cron: cronExpression })
                }}
              >
                Save
              </RainbowButton>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SchedularDialog

