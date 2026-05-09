'use client'

import { useRobotStore } from '@/store/robotStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Activity, Cpu, Thermometer, Zap, CircleDot } from 'lucide-react'

export default function StatusPanel() {
  const joints = useRobotStore((s) => s.joints)
  const isAnimating = useRobotStore((s) => s.isAnimating)
  const speed = useRobotStore((s) => s.speed)

  // Simulated metrics based on joint positions
  const torqueLoad = Math.abs(joints.shoulderPitch * 0.6 + joints.elbowPitch * 0.4) / 100
  const powerConsumption = 15 + torqueLoad * 40 + (isAnimating ? 20 : 0)
  const temperature = 32 + torqueLoad * 18 + (isAnimating ? 5 : 0)
  const cycleCount = Math.floor(Math.abs(joints.baseRotation) + Math.abs(joints.shoulderPitch) + Math.abs(joints.elbowPitch))

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Sistem Durumu
          <Badge
            variant={isAnimating ? 'default' : 'secondary'}
            className="ml-auto text-[10px] h-5 px-1.5"
          >
            <CircleDot className={`w-2.5 h-2.5 mr-0.5 ${isAnimating ? 'animate-pulse' : ''}`} />
            {isAnimating ? 'Hareket Halinde' : 'Beklemede'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-2.5">
        {/* Torque */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs">Tork Yükü</span>
            </div>
            <span className="text-xs font-mono">{torqueLoad.toFixed(1)}%</span>
          </div>
          <Progress value={torqueLoad} className="h-1.5" />
        </div>

        {/* Power */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs">Güç Tüketimi</span>
            </div>
            <span className="text-xs font-mono">{powerConsumption.toFixed(0)}W</span>
          </div>
          <Progress value={powerConsumption / 100 * 100} className="h-1.5" />
        </div>

        {/* Temperature */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs">Motor Sıcaklığı</span>
            </div>
            <span className="text-xs font-mono">{temperature.toFixed(1)}°C</span>
          </div>
          <Progress value={temperature / 80 * 100} className="h-1.5" />
        </div>

        {/* Cycle count */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Hareket Sayacı</span>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
            {cycleCount}
          </Badge>
        </div>

        {/* Speed indicator */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Çalışma Hızı</span>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
            {speed}x
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
