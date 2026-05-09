import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { message, joints } = await request.json()

    const zai = await ZAI.create()

    const systemPrompt = `Sen bir endüstriyel robot kol uzmanısın. Türkçe yanıt ver. Kullanıcıya robot kol kontrolü konusunda yardımcı ol.
Mevcut robot kol eklem açıları:
- Taban Rotasyonu: ${joints.baseRotation}° (aralık: -180° ile 180°)
- Omuz Açısı: ${joints.shoulderPitch}° (aralık: -90° ile 90°)
- Dirsek Açısı: ${joints.elbowPitch}° (aralık: -135° ile 0°)
- Bilek Eğimi: ${joints.wristPitch}° (aralık: -90° ile 90°)
- Bilek Rotasyonu: ${joints.wristRoll}° (aralık: -180° ile 180°)
- Tutucu Açıklığı: ${joints.gripperOpen}% (0=tam kapalı, 100=tam açık)

Kısa ve pratik yanıtlar ver. Gerekirse önerilen eklem açılarını belirt.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || 'Üzgünüm, yanıt oluşturulamadı.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json(
      { response: 'YZ servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    )
  }
}
