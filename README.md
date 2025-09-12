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

## Konfigurasi Lingkungan (.env)

Buat file `.env.local` di root:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=... // jika digunakan oleh supabaseClient
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Build Produksi

```bash
npm run build
npm start
```

## Catatan Produksi
- Halaman publik di-ISR (revalidate) agar cepat dan tetap up to date.
- Library berat (Leaflet, editor markdown, DnD) lazy-load hanya saat diperlukan.
- Gambar menggunakan `next/image` dengan `sizes` responsif.

---

Dibuat dengan ❤️ Zul Ilmi Ihsan
