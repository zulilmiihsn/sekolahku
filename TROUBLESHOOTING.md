# 🔧 Troubleshooting Guide

## Error: UNKNOWN: unknown error, open 'webpack-runtime.js'

### 🚨 **Penyebab Error:**
Error ini sering terjadi di Windows karena:
- File system locks oleh Windows
- Cache Next.js yang corrupted
- Proses Node.js yang tidak terhenti dengan benar
- Antivirus/Windows Defender yang memblokir file

### ✅ **Solusi Cepat:**

#### **1. Gunakan Script Otomatis (Recommended)**
```bash
# PowerShell (Recommended)
npm run dev:clean

# Atau Batch file
npm run dev:clean-bat

# Atau manual clean
npm run clean
```

#### **2. Solusi Manual:**
```bash
# 1. Stop semua proses Node.js
taskkill /f /im node.exe

# 2. Hapus folder .next
rmdir /s /q .next

# 3. Clear npm cache
npm cache clean --force

# 4. Start ulang
npm run dev
```

### 🛠️ **Script yang Tersedia:**

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Start development server normal |
| `npm run dev:clean` | Clean cache + start dev server (PowerShell) |
| `npm run dev:clean-bat` | Clean cache + start dev server (Batch) |
| `npm run clean` | Clean cache saja |

### 🔍 **Pencegahan:**

1. **Selalu stop server dengan Ctrl+C** sebelum restart
2. **Gunakan script clean** jika error terjadi
3. **Exclude folder project** dari Windows Defender real-time scanning
4. **Jangan force close** terminal saat server berjalan

### 📁 **File yang Dibersihkan:**
- `.next/` - Next.js build cache
- `node_modules/.cache/` - NPM cache
- `npm cache` - Global npm cache

### ⚡ **Tips Performa:**
- Gunakan `npm run dev:clean` jika sering error
- Restart VS Code jika masih bermasalah
- Restart komputer jika error persist

### 🆘 **Jika Masih Error:**
1. Restart komputer
2. Exclude folder project dari antivirus
3. Run PowerShell as Administrator
4. Check disk space (minimal 1GB free)
