"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Play, Save } from "lucide-react"

export function SimulationControls() {
  const [isRunning, setIsRunning] = useState(false)
  const [parameters, setParameters] = useState({
    speed: 50,
    acceleration: 30,
    brakeForce: 40,
    loadWeight: 1000,
    enableWindResistance: true,
    enableFriction: true,
    trackGradient: 0,
  })

  const handleSliderChange = (name: string, value: number[]) => {
    setParameters({
      ...parameters,
      [name]: value[0],
    })
  }

  const handleInputChange = (name: string, value: string) => {
    setParameters({
      ...parameters,
      [name]: Number.parseFloat(value) || 0,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setParameters({
      ...parameters,
      [name]: checked,
    })
  }

  const runSimulation = () => {
    setIsRunning(true)

    // Simulate running for 3 seconds
    setTimeout(() => {
      setIsRunning(false)
    }, 3000)
  }

  return (
    <Card className="h-[600px] overflow-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Simulation Parameters</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button size="sm" className="gap-1" onClick={runSimulation} disabled={isRunning}>
              <Play className="h-4 w-4" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speed">Train Speed (km/h)</Label>
              <span className="text-sm text-slate-500">{parameters.speed}</span>
            </div>
            <Slider
              id="speed"
              min={0}
              max={200}
              step={1}
              value={[parameters.speed]}
              onValueChange={(value) => handleSliderChange("speed", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="acceleration">Acceleration (m/s²)</Label>
              <span className="text-sm text-slate-500">{parameters.acceleration}</span>
            </div>
            <Slider
              id="acceleration"
              min={0}
              max={100}
              step={1}
              value={[parameters.acceleration]}
              onValueChange={(value) => handleSliderChange("acceleration", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brakeForce">Brake Force (kN)</Label>
              <span className="text-sm text-slate-500">{parameters.brakeForce}</span>
            </div>
            <Slider
              id="brakeForce"
              min={0}
              max={100}
              step={1}
              value={[parameters.brakeForce]}
              onValueChange={(value) => handleSliderChange("brakeForce", value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loadWeight">Load Weight (kg)</Label>
            <Input
              id="loadWeight"
              type="number"
              value={parameters.loadWeight}
              onChange={(e) => handleInputChange("loadWeight", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="trackGradient">Track Gradient (%)</Label>
              <span className="text-sm text-slate-500">{parameters.trackGradient}</span>
            </div>
            <Slider
              id="trackGradient"
              min={-10}
              max={10}
              step={0.1}
              value={[parameters.trackGradient]}
              onValueChange={(value) => handleSliderChange("trackGradient", value)}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium">Environmental Factors</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableWindResistance" className="cursor-pointer">
              Wind Resistance
            </Label>
            <Switch
              id="enableWindResistance"
              checked={parameters.enableWindResistance}
              onCheckedChange={(checked) => handleSwitchChange("enableWindResistance", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableFriction" className="cursor-pointer">
              Track Friction
            </Label>
            <Switch
              id="enableFriction"
              checked={parameters.enableFriction}
              onCheckedChange={(checked) => handleSwitchChange("enableFriction", checked)}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium">Advanced Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="motorEfficiency">Motor Efficiency (%)</Label>
              <Input id="motorEfficiency" type="number" defaultValue="85" min="0" max="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="powerConsumption">Power (kW)</Label>
              <Input id="powerConsumption" type="number" defaultValue="2000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="simulationDuration">Duration (s)</Label>
              <Input id="simulationDuration" type="number" defaultValue="60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeStep">Time Step (ms)</Label>
              <Input id="timeStep" type="number" defaultValue="100" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
