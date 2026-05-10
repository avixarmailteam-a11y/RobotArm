# 🤖 RobotKol - YZ Destekli 3D Robot Kol Kontrol Paneli

Bu proje, endüstriyel bir robot kolun web üzerinden kontrol edilmesini sağlayan, Three.js ile geliştirilmiş interaktif bir 3D simülasyon ve kontrol panelidir.

## 🌟 Özellikler

- **3D Simülasyon:** Gerçek zamanlı 6 eklemli robot kol modeli (Three.js & React Three Fiber).
- **YZ Asistan:** Robot kolun hareketlerini planlamanıza yardımcı olan, teknik bilgi veren akıllı asistan.
- **Hassas Kontrol:** Her bir eklem için ayrı ayrı açı kontrolü.
- **Hazır Pozisyonlar:** Tek tıkla "Yukarı Kalk", "Uzan", "Tutma Pozisyonu" gibi önceden tanımlanmış modlara geçiş.
- **Durum Takibi:** Tork yükü, güç tüketimi ve sıcaklık gibi sensör verilerinin simülasyonu.
- **Türkçe Arayüz:** Tamamı Türkçe modern ve şık kullanıcı arayüzü.

## 🛠️ Teknoloji Yığını

- **Frontend:** Next.js, React, TailwindCSS, Shadcn/UI
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **Durum Yönetimi:** Zustand
- **YZ:** z-ai-web-dev-sdk
- **Veritabanı:** Prisma

## 🚀 Başlangıç

### Gereksinimler

- Node.js (v18+) veya Bun

### Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
# veya
bun install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
# veya
bun dev
```

3. Tarayıcınızda `http://localhost:3000` adresine gidin.

## 📂 Proje Yapısı

- `src/components/robot`: Robot kol ve 3D sahne bileşenleri.
- `src/store`: Uygulama durum yönetimi (Zustand).
- `src/app/api/ai`: YZ asistanı için API endpoint.
- `public`: Statik varlıklar ve modeller.

## 📝 Lisans

Bu proje kişisel gelişim ve deneysel amaçlarla oluşturulmuştur.
