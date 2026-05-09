'use client'

import { useRobotStore } from '@/store/robotStore'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  RotateCcw,
  Home,
  Play,
  Gauge,
  ChevronUp,
  ChevronDown,
  ArrowLeftRight,
  Hand,
  RotateCw,
  MoveVertical,
  Settings2,
} from 'lucide-react'

const jointControls: {
  key: keyof import('@/store/robotStore').JointAngles
  label: string
  min: number
  max: number
  icon: React.ReactNode
  unit: string
  color: string
}[] = [
  { key: 'baseRotation', label: 'Taban Rotasyonu', min: -180, max: 180, icon: <ArrowLeftRight className="w-4 h-4" />, unit: '°', color: '#e8530e' },
  { key: 'shoulderPitch', label: 'Omuz Açısı', min: -90, max: 90, icon: <ChevronUp className="w-4 h-4" />, unit: '°', color: '#d4a017' },
  { key: 'elbowPitch', label: 'Dirsek Açısı', min: -135, max: 0, icon: <ChevronDown className="w-4 h-4" />, unit: '°', color: '#c0c0c0' },
  { key: 'wristPitch', label: 'Bilek Eğimi', min: -90, max: 90, icon: <MoveVertical className="w-4 h-4" />, unit: '°', color: '#00b4d8' },
  { key: 'wristRoll', label: 'Bilek Rotasyonu', min: -180, max: 180, icon: <RotateCw className="w-4 h-4" />, unit: '°', color: '#8b5cf6' },
  { key: 'gripperOpen', label: 'Tutucu Açıklığı', min: 0, max: 100, icon: <Hand className="w-4 h-4" />, unit: '%', color: '#10b981' },
]

export default function ControlPanel() {
  const joints = useRobotStore((s) => s.joints)
  const setJoint = useRobotStore((s) => s.setJoint)
  const resetJoints = useRobotStore((s) => s.resetJoints)
  const applyPreset = useRobotStore((s) => s.applyPreset)
  const presets = useRobotStore((s) => s.presets)
  const speed = useRobotStore((s) => s.speed)
  const setSpeed = useRobotStore((s) => s.setSpeed)
  const setTargetJoints = useRobotStore((s) => s.setTargetJoints)
  const setIsAnimating = useRobotStore((s) => s.setIsAnimating)
  const setJoints = useRobotStore((s) => s.setJoints)

  const handleAnimateToPreset = (preset: typeof presets[0]) => {
    setTargetJoints({ ...joints, ...preset.joints } as import('@/store/robotStore').JointAngles)
    setIsAnimating(true)
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-1 custom-scrollbar">
      {/* Joint Controls */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            Eklem Kontrolleri
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3 space-y-3">
          {jointControls.map((ctrl) => (
            <div key={ctrl.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: ctrl.color }}>{ctrl.icon}</span>
                  <span className="text-xs font-medium">{ctrl.label}</span>
                </div>
                <Badge variant="outline" className="text-xs font-mono h-5 px-1.5">
                  {joints[ctrl.key].toFixed(0)}{ctrl.unit}
                </Badge>
              </div>
              <Slider
                value={[joints[ctrl.key]]}
                min={ctrl.min}
                max={ctrl.max}
                step={1}
                onValueChange={([v]) => setJoint(ctrl.key, v)}
                className="w-full"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Speed Control */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            Hız Kontrolü
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs">Animasyon Hızı</span>
            <Badge variant="outline" className="text-xs font-mono h-5 px-1.5">{speed}x</Badge>
          </div>
          <Slider
            value={[speed]}
            min={0.5}
            max={5}
            step={0.5}
            onValueChange={([v]) => setSpeed(v)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Presets */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Play className="w-4 h-4 text-primary" />
            Hazır Pozisyonlar
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => handleAnimateToPreset(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="px-4 py-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => {
              resetJoints()
              setTargetJoints(null)
              setIsAnimating(false)
            }}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Sıfırla
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => {
              applyPreset('Ana Konum')
              setTargetJoints(useRobotStore.getState().presets[0].joints as import('@/store/robotStore').JointAngles)
              setIsAnimating(true)
            }}
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            Ana Konum
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
