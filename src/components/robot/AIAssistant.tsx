'use client'

import { useState, useRef, useEffect } from 'react'
import { useRobotStore } from '@/store/robotStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react'

type AiMessage = import('@/store/robotStore').AiMessage

const quickPrompts = [
  'Nesneyi nasıl tutabilirim?',
  'En verimli pozisyon nedir?',
  'Hareket planı oluştur',
  'Güvenlik kontrolü yap',
]

export default function AIAssistant() {
  const [input, setInput] = useState('')
  const aiMessages = useRobotStore((s) => s.aiMessages)
  const addAiMessage = useRobotStore((s) => s.addAiMessage)
  const isAiThinking = useRobotStore((s) => s.isAiThinking)
  const setIsAiThinking = useRobotStore((s) => s.setIsAiThinking)
  const joints = useRobotStore((s) => s.joints)
  const setTargetJoints = useRobotStore((s) => s.setTargetJoints)
  const setIsAnimating = useRobotStore((s) => s.setIsAnimating)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [aiMessages])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          joints,
        }),
      })
      const data = await res.json()
      return data.response || 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
    } catch {
      // Fallback responses when API is unavailable
      return generateLocalResponse(userMessage)
    }
  }

  const generateLocalResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()

    if (msg.includes('tut') || msg.includes('kavga') || msg.includes('grip')) {
      return `Nesneyi tutmak için şu adımları öneriyorum:\n\n1. Omuz açısını -30° olarak ayarlayın\n2. Dirsek açısını -90° yapın\n3. Bilek eğimini -15° ayarlayın\n4. Tutucu açıklığını %80 açın\n5. Nesneye yaklaştıktan sonra tutucuyu %20 kapatın\n\nMevcut tutucu durumu: ${joints.gripperOpen}% açık`
    }

    if (msg.includes('verimli') || msg.includes('optimal') || msg.includes('pozisyon')) {
      return `Mevcut eklem açılarınıza göre analiz:\n\n• Taban: ${joints.baseRotation}°\n• Omuz: ${joints.shoulderPitch}°\n• Dirsek: ${joints.elbowPitch}°\n• Bilek: ${joints.wristPitch}°\n\nEn verimli çalışma aralığı omuz -45° ile 45° arasıdır. Dirsek -90° civarında en fazla tork sağlanır. Enerji verimliliği için omuzu mümkün olduğunca düşük açılarda tutun.`
    }

    if (msg.includes('plan') || msg.includes('hareket') || msg.includes('yol')) {
      return `Hareket planı oluşturuldu:\n\n📋 Adım 1: Tabanı hedef yönüne döndür (≈${Math.abs(joints.baseRotation) < 45 ? '90°' : '0°'})\n📋 Adım 2: Omuzu kaldır (-45°)\n📋 Adım 3: Dirseği bük (-90°)\n📋 Adım 4: Bileği hizala (0°)\n📋 Adım 5: Tutucuyu aç (%80)\n📋 Adım 6: Nesneye yaklaş\n📋 Adım 7: Tutucuyu kapat (%20)\n\n"Yukarı Kalk" hazır pozisyonunu kullanarak başlayabilirsiniz.`
    }

    if (msg.includes('güvenlik') || msg.includes('kontrol') || msg.includes('sınır')) {
      let warnings = 0
      const issues: string[] = []
      if (Math.abs(joints.shoulderPitch) > 75) { issues.push('⚠️ Omuz açısı sınırda!'); warnings++ }
      if (joints.elbowPitch < -120) { issues.push('⚠️ Dirsek aşırı bükük!'); warnings++ }
      if (joints.gripperOpen < 10) { issues.push('⚠️ Tutucu tam kapalı, sıkışma riski!'); warnings++ }

      if (warnings === 0) {
        return `✅ Güvenlik kontrolü tamamlandı.\n\nTüm eklemler güvenli çalışma aralığında. Mevcut pozisyon operasyona uygun.\n\n• Omuz: Güvenli ✓\n• Dirsek: Güvenli ✓\n• Tutucu: Güvenli ✓`
      }
      return `🔒 ${warnings} uyarı tespit edildi!\n\n${issues.join('\n')}\n\nLütfen eklem açılarını güvenli aralığa getirin.`
    }

    return `Anlıyorum. Robot kol mevcut durumu:\n\n🔹 Taban: ${joints.baseRotation}°\n🔹 Omuz: ${joints.shoulderPitch}°\n🔹 Dirsek: ${joints.elbowPitch}°\n🔹 Bilek Eğimi: ${joints.wristPitch}°\n🔹 Bilek Rotasyonu: ${joints.wristRoll}°\n🔹 Tutucu: ${joints.gripperOpen}%\n\nBaşka bir sorunuz varsa yardımcı olmaktan memnuniyet duyarım. "Nesneyi nasıl tutabilirim?", "Hareket planı oluştur" gibi sorular sorabilirsiniz.`
  }

  const handleSend = async () => {
    if (!input.trim() || isAiThinking) return

    const userMsg: AiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    addAiMessage(userMsg)
    setInput('')
    setIsAiThinking(true)

    const response = await generateAIResponse(input.trim())

    const aiMsg: AiMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    }

    addAiMessage(aiMsg)
    setIsAiThinking(false)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm flex flex-col h-full">
      <CardHeader className="pb-2 pt-3 px-4 shrink-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          YZ Asistan
          <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5">
            <Bot className="w-3 h-3 mr-0.5" />
            Yapay Zeka
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 flex flex-col flex-1 min-h-0">
        {/* Quick prompts */}
        <div className="flex flex-wrap gap-1 mb-2 shrink-0">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              className="text-[10px] h-6 px-2"
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 min-h-0 mb-2" ref={scrollRef}>
          <div className="space-y-2 pr-2">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg px-3 py-2 text-xs whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary/10 ml-6 border border-primary/20'
                    : 'bg-muted mr-2'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  {msg.role === 'assistant' ? (
                    <Bot className="w-3 h-3 text-primary" />
                  ) : (
                    <span className="w-3 h-3 rounded-full bg-primary/50 inline-flex items-center justify-center text-[8px]">K</span>
                  )}
                  <span className="font-semibold text-[10px] text-muted-foreground">
                    {msg.role === 'assistant' ? 'YZ Asistan' : 'Kullanıcı'}
                  </span>
                </div>
                {msg.content}
              </div>
            ))}
            {isAiThinking && (
              <div className="rounded-lg px-3 py-2 text-xs bg-muted mr-2">
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  <span className="text-muted-foreground">Düşünülüyor...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-1.5 shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Sorunuzu yazın..."
            className="text-xs h-8"
            disabled={isAiThinking}
          />
          <Button
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleSend}
            disabled={!input.trim() || isAiThinking}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
