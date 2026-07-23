# Dokumentasi Teknis — Komisi Sales (Frontend)

Dashboard web untuk menampilkan komisi Sales & Manager Area Internet Home Nusanet. Terhubung ke [backend API Komisi Sales](../komisi-sales).

| Aspek | Teknologi |
|-------|-----------|
| Framework | [Nuxt 4](https://nuxt.com) — **SPA mode** (`ssr: false`) |
| UI | [Nuxt UI v4](https://ui.nuxt.com) (Tailwind based) |
| Charts | `nuxt-charts` |
| Auth Google | `nuxt-vue3-google-signin` |
| PWA | `@vite-pwa/nuxt` (installable, offline shell) |
| HTTP client | `axios` (instance terbungkus dengan interceptor) |
| Validasi form | `zod` |
| Package manager | `pnpm` |

---

## 1. Struktur Direktori (`app/`)

Nuxt 4 memakai `app/` sebagai source root.

```
app/
├── app.vue                    # Root: UApp > NuxtLayout > NuxtPage, SEO meta
├── app.config.ts              # Tema Nuxt UI (primary: green)
├── assets/css/main.css        # Import Tailwind / Nuxt UI
├── layouts/
│   ├── default.vue            # Layout utama: LoadingOverlay + AppHeader + UFooter
│   └── auth.vue               # Layout halaman sign-in (tanpa header)
├── middleware/
│   ├── auth.global.ts         # Global: redirect ke /sign-in bila belum login
│   └── guest.ts               # Halaman tamu: redirect ke dashboard bila sudah login
├── pages/                     # File-based routing
│   ├── index.vue              # Beranda: daftar "My Team" (hierarki bawahan)
│   ├── sign-in.vue            # Login (Employee ID/password + Google)
│   ├── [id]/sales.vue         # Dashboard komisi seorang sales
│   ├── [id]/manager.vue       # Dashboard komisi manager + timnya
│   └── sumarry/               # Halaman admin (rekap global)
│       ├── sales.vue          # Rekap komisi semua sales
│       ├── manager.vue        # Rekap komisi semua manager
│       ├── invoice.vue        # Daftar invoice + approval keterlambatan/referral
│       └── churn.vue          # Daftar churn + approval
├── components/
│   ├── AppHeader.vue          # Header + navigasi + menu user
│   ├── CommissionHeader.vue   # Header ringkasan komisi (nama, periode, dsb.)
│   ├── HeroBackground.vue     # Latar dekoratif
│   ├── LoadingOverlay.vue     # Overlay loading global
│   ├── NotificationsSlideover.vue # Panel notifikasi (pengajuan adjustment)
│   ├── AdjustmentModal.vue    # Form pengajuan koreksi data
│   ├── ReferralEditModal.vue  # Form edit referral (admin)
│   └── ConfirmModal.vue       # Dialog konfirmasi generik
├── composables/
│   ├── useAuth.ts             # Akses state auth (token, user) & service
│   ├── useDasboardRoute.ts    # Tentukan rute dashboard per job_level/position
│   ├── useLoading.ts          # State loading global (useState)
│   └── error-helper.ts        # handleServiceError() untuk service layer
├── services/                  # Wrapper pemanggilan API (satu kelas per domain)
│   ├── api-service.ts         # ★ Instance axios + interceptor 401/403 + refresh
│   ├── auth-service.ts        # ★ Sesi, login, refresh, logout (singleton reaktif)
│   ├── commission-service.ts  # Komisi sales/manager + summary + approval
│   ├── employee-service.ts    # Detail & hierarki pegawai
│   ├── team-service.ts        # Komisi tim manager
│   ├── invoice-service.ts     # Invoice & churn per sales
│   ├── adjustment-service.ts  # Pengajuan & approval adjustment
│   └── additional-service.ts  # Periode aktif
└── types/                     # Definisi TypeScript respons API (*.d.ts)
    ├── auth.d.ts  employee.d.ts  sales.d.ts  manager.d.ts
    ├── team.d.ts  summary.d.ts  adjustment.d.ts  additional.d.ts
```

---

## 2. Routing & Peran Pengguna

Rute dashboard ditentukan `useDashboardRoute()` berdasarkan data pegawai:

| Kondisi pegawai | Rute tujuan |
|-----------------|-------------|
| `job_level ∈ {C-Level, Manager}` | `/{employee_id}/manager` |
| `job_level = Staff` & `job_position = Account Manager` | `/{employee_id}/sales` |
| lainnya | `/` (beranda) |

**Halaman:**
- `/` — daftar "My Team" (hierarki bawahan via `employee/:id/hierarchy`); klik kartu menuju dashboard anggota.
- `/{id}/sales` — komisi seorang sales: pencapaian, bonus, breakdown per tipe/service, invoice, churn.
- `/{id}/manager` — komisi manager: overriding New/Recurring, performa tim, daftar anggota, dan **tabel "SM Invoice"** (invoice langsung SM/CRO/CS via `GET /manager/:id/invoice` — komisi hanya recurring 0.9%/0.5% per SE-002, tidak memengaruhi achievement).
- `/sumarry/*` — halaman admin (hanya untuk `is_admin` di backend; endpoint dilindungi `adminMiddleware`).

> Catatan: folder halaman dinamai `sumarry` (ejaan asli pada kode), sehingga URL-nya `/sumarry/...`.

---

## 3. Autentikasi (Sisi Klien)

Diimplementasikan sebagai **singleton reaktif** `authService` ([auth-service.ts](app/services/auth-service.ts)) + composable `useAuth()`.

**Alur:**
1. **Login** — `login(employeeId, password)` memanggil `POST /auth/dev` (atau `googleLogin(code)` → `POST /auth/google`). Token & user disimpan di `localStorage` (`accessToken`, `refreshToken`, `user`).
2. **Restore sesi** — saat konstruksi, `restoreSession()` membaca `localStorage` (sinkron) lalu `validateSession()` memanggil `/auth/me` di background.
3. **Refresh otomatis** — interceptor `api-service.ts` menangkap **401**, memanggil `refreshHandler` (→ `POST /auth/refresh`), lalu mengulang request asli. Gagal refresh → hapus sesi & redirect `/sign-in`.
4. **403** — interceptor mengarahkan ke `/` (akses hierarki ditolak).
5. **Guard rute** — `auth.global.ts` menendang user tanpa token ke `/sign-in`; `guest.ts` melempar user yang sudah login ke dashboard-nya.

**Token dikirim** via header `Authorization: Bearer <token>` pada tiap panggilan service.

---

## 4. Lapisan Service & Integrasi API

Setiap domain punya satu kelas service yang membungkus `apiService.client` (axios). Base URL dari `runtimeConfig.public.apiUrl` (env `API_BASE_URL`).

| Service | Method utama | Endpoint backend |
|---------|--------------|------------------|
| `AuthService` | login, googleLogin, refreshToken, logout | `/auth/*` |
| `EmployeeService` | getEmployee, getEmployeeHierarchy | `/employee/:id`, `/employee/:id/hierarchy` |
| `CommissionService` | salesCommission(Period), managerCommission(Period), managerInvoice, salesChurn | `/sales/:id/*`, `/manager/:id/*` |
| `CommissionService` | salesSummary, managerSummary, invoiceSummary, churnSummary | `/summary/*` |
| `CommissionService` | updateChurnStatus, updateInvoiceStatus, updateReferralInvoice | `POST/PUT /summary/*` |
| `TeamService` | (komisi tim manager) | `/manager/:id/team` |
| `InvoiceService` | (invoice per sales) | `/sales/:id/invoice(/:ai)` |
| `AdjustmentService` | getAdjustment, insert, accept, decline, history | `/adjustment/*` |
| `AdditionalService` | getPeriod | `/additional` |

Error ditangani terpusat lewat `handleServiceError()` ([error-helper.ts](app/composables/error-helper.ts)).

Referensi endpoint lengkap ada di [dokumentasi backend](../komisi-sales/DOCUMENTATION.md#9-referensi-api).

---

## 5. State Management

Aplikasi **tidak memakai Pinia**. State dikelola melalui:
- **`authService`** — `ref` reaktif (`user`, `token`) sebagai singleton, diakses via `useAuth()`.
- **`useLoading()`** — `useState('global-loading')` untuk overlay loading lintas halaman.
- **`localStorage`** — persistensi sesi (token & user).

---

## 6. PWA

Dikonfigurasi di [nuxt.config.ts](nuxt.config.ts) (`@vite-pwa/nuxt`):
- `registerType: autoUpdate`, installable (`installPrompt`), cek update tiap jam.
- Manifest: nama "Sales Commission Internet Home", tema `#00c16a`, lang `id`, ikon 64–512px di `public/icons/`.
- Workbox: `navigateFallback: '/'`, cache aset statis.

---

## 7. Environment Variables

Lihat `.env.example`. Buat `.env`:

```bash
API_BASE_URL=http://localhost:4000/api     # base URL backend (termasuk /api)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com   # untuk Google Sign-In
```

Dipetakan di `nuxt.config.ts` → `runtimeConfig.public.apiUrl` dan `googleSignIn.clientId`.

---

## 8. Menjalankan Aplikasi

Prasyarat: Node.js + `pnpm`, dan backend API aktif.

```bash
pnpm install          # install dependency
pnpm dev              # dev server → http://localhost:3000
pnpm build            # build produksi
pnpm preview          # preview hasil build
pnpm lint             # eslint
pnpm typecheck        # vue-tsc
```

---

## 9. Konvensi

- **Nuxt UI** — komponen `U*` (UContainer, UCard, UPageCard, UAuthForm, dll.); tema di `app.config.ts` (`primary: green`).
- **Auto-import** — composables & components Nuxt otomatis ter-import; service di-import eksplisit dari `~/services/*`.
- **ESLint stylistic** — `commaDangle: never`, `braceStyle: 1tbs` (lihat `nuxt.config.ts`).
- **Tipe respons** — semua bentuk data API dideklarasikan di `app/types/*.d.ts` agar service & komponen type-safe.

## 10. Catatan Istilah (Juli 2026)

Istilah **"Activity" diganti "New Achievement"** di seluruh aplikasi (label UI + field API): `achievement.activity` → `achievement.newAchievement`, `sales.activity` → `sales.newAchievement`. Aturan pengelompokan NusaSelecta & formula target SM mengikuti dokumen resmi di [komisi-sales/docs/](../komisi-sales/docs/).
