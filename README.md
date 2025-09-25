# Sekolah Modern

Website profil sekolah modern dengan Next.js 14, TypeScript, Tailwind CSS, Prisma, Framer Motion, dan Lucide React.

## Fitur Utama
- Desain modern, elegan, dan profesional
- Animasi interaktif dan micro-interactions
- Efek glassmorphism dan aurora gradient
- Struktur kode modular dan scalable

## Cara Menjalankan

```bash
npm install
npm run dev
```

## Konfigurasi Lingkungan (.env)\n\nBuat file .env atau .env.local di root, contoh ada di .env.example.\n\nVariabel penting (lihat juga pp/utils/env.ts):\n\n`\nNEXT_PUBLIC_BASE_URL=http://localhost:3000\nNEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_ANON_KEY=\nSUPABASE_SERVICE_ROLE_KEY=\nNEXTAUTH_URL=\nNEXTAUTH_SECRET=\nJWT_SECRET=\nJWT_EXPIRES_IN=7d\nBCRYPT_ROUNDS=12\nRATE_LIMIT_MAX=100\nRATE_LIMIT_WINDOW_MS=900000\nSENTRY_DSN=\nLOG_LEVEL=info\nREDIS_URL=\n`\n\n## Build Produksi

```bash
npm run build
npm start
```

## Catatan Produksi
- Halaman publik di-ISR (revalidate) agar cepat dan tetap up to date.
- Library berat (Leaflet, editor markdown, DnD) lazy-load hanya saat diperlukan.
- Gambar menggunakan `next/image` dengan `sizes` responsif.

---

Dibuat dengan â¤ï¸ Zul Ilmi Ihsan

