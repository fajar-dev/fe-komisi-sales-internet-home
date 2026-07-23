# Komisi Sales — Frontend Dashboard

Dashboard web (PWA) untuk **komisi Account Manager (Sales) & Manager Area** lini bisnis Internet Home Nusanet. Dibangun dengan **Nuxt 4 + Nuxt UI v4**, berjalan sebagai SPA dan terhubung ke [backend API Komisi Sales](../komisi-sales).

## Fitur

- 🔐 Login via **Employee ID/password** atau **Google Sign-In**, dengan refresh token otomatis.
- 👥 **Beranda tim** — daftar bawahan berdasarkan hierarki pegawai.
- 📊 **Dashboard Sales** — pencapaian aktivitas, bonus, breakdown komisi per tipe & service, invoice, churn.
- 🧑‍💼 **Dashboard Manager** — komisi overriding (New & Recurring), performa tim, rincian per anggota.
- 🛠️ **Halaman Admin** (`/sumarry/*`) — rekap komisi semua sales/manager, approval invoice telat & churn, edit referral.
- 📝 **Adjustment** — pengajuan koreksi data dengan alur approval.
- 📱 **PWA** — installable, cache aset, auto-update.

## Teknologi

Nuxt 4 (SPA) · Nuxt UI v4 · nuxt-charts · axios · zod · @vite-pwa/nuxt · nuxt-vue3-google-signin · pnpm

## Setup

```bash
pnpm install
```

Buat file `.env`:

```bash
API_BASE_URL=http://localhost:4000/api
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

## Menjalankan

```bash
pnpm dev        # http://localhost:3000
pnpm build      # build produksi
pnpm preview    # preview build
pnpm lint       # eslint
pnpm typecheck  # vue-tsc
```

## Dokumentasi

- **[DOCUMENTATION.md](DOCUMENTATION.md)** — arsitektur, routing, auth, lapisan service, PWA, konvensi.
- **[Backend Komisi Sales](../komisi-sales)** — API, aturan komisi, dan alur data.

---

PT. Media Antar Nusa (Nusanet)
