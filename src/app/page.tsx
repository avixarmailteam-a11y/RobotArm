'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import ControlPanel from '@/components/robot/ControlPanel'
import AIAssistant from '@/components/robot/AIAssistant'
import StatusPanel from '@/components/robot/StatusPanel'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useRobotStore } from '@/store/robotStore'
import {
  Cpu,
  RotateCcw,
  Moon,
  Sun,
  Maximize2,
  Info,
} from 'lucide-react'
import { useState } from 'react'

// Dynamic import for Three.js (needs window)
const RobotScene = dynamic(() => import('@/components/robot/RobotScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#16213e]">
      <div className="text-center space-y-3">
        <Cpu className="w-12 h-12 text-primary animate-pulse mx-auto" />
        <p className="text-sm text-muted-foreground animate-pulse">3D Sahne Yükleniyor...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const resetJoints = useRobotStore((s) => s.resetJoints)
  const joints = useRobotStore((s) => s.joints)

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="h-12 border-b border-border/50 bg-card/80 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <h1 className="text-sm font-bold tracking-tight">
            YZ Robot Kol Kontrol Paneli
          </h1>
          <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
            v1.0
          </Badge>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
            Taban: {joints.baseRotation.toFixed(0)}°
          </Badge>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
            Omuz: {joints.shoulderPitch.toFixed(0)}°
          </Badge>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">
            Dirsek: {joints.elbowPitch.toFixed(0)}°
          </Badge>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </header>

      {/* Info banner */}
      {showInfo && (
        <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 text-xs shrink-0">
          <strong>Nasıl Kullanılır:</strong> Sol panelden eklem açılarını kaydırıcılarla ayarlayın.
          3D sahnede fare ile döndürme, yakınlaştırma ve kaydırma yapabilirsiniz.
          YZ Asistan ile sorular sorarak robot kol hareketleri planlayabilirsiniz.
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Controls */}
        <div className="w-72 border-r border-border/50 bg-background/50 overflow-y-auto custom-scrollbar shrink-0">
          <ControlPanel />
        </div>

        {/* Center - 3D Viewport */}
        <div className="flex-1 relative min-w-0">
          <RobotScene />
          {/* Viewport overlay info */}
          <div className="absolute bottom-3 left-3 text-[10px] text-white/40 pointer-events-none">
            Fare: Döndür (Sol Tık) | Yakınlaştır (Scroll) | Kaydır (Sağ Tık)
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5">
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-black/50 text-white border-white/10 backdrop-blur-sm">
              3D Görünüm
            </Badge>
          </div>
        </div>

        {/* Right Panel - AI & Status */}
        <div className="w-80 border-l border-border/50 bg-background/50 flex flex-col shrink-0">
          <div className="flex-1 min-h-0 overflow-hidden">
            <AIAssistant />
          </div>
          <div className="shrink-0 border-t border-border/50">
            <StatusPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
