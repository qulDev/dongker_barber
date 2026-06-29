# Skeletons and Documentation Design Spec

This specification outlines the design and implementation plan for adding CSS Shimmer-based Skeleton Loaders across all asynchronous loading states in the Dongker Barber application, and creating a comprehensive, multilingual documentation structure.

## Objective

1. **Skeleton Loaders**: Eliminate raw text indicators (such as "Memuat data...", "Memuat jadwal...") and replace them with high-fidelity skeleton components that mimic the shape and structure of final components during data fetching.
2. **Multilingual Documentation**: Provide clear setup, deployment, database, and API guides in both English (default) and Indonesian.

---

## 1. Skeleton Loader Layouts

### A. Booking Receipt Detail (`src/app/booking/[id]/page.tsx`)
- **Layout**: Renders a glass-card receipt shape containing a circular status badge skeleton, title and subtitle skeletons, 5 rows of detail field skeletons, a total price skeleton, and a large rounded action button skeleton.

### B. Admin Services (`src/app/admin/services/page.tsx`)
- **Layout**: Displays a 3-row skeleton inside the table structure. Each row contains custom skeleton shapes for Name/Description, Price, Duration, and edit/delete action button outlines.

### C. Admin Barbers (`src/app/admin/barbers/page.tsx`)
- **Layout**: Displays a 3-row skeleton inside the table. Each row includes a circular avatar skeleton, name/specialization lines, a rating star placeholder, status badge outline, and action button outlines.

### D. Admin Schedules (`src/app/admin/schedule/page.tsx`)
- **Layout**: Displays a 3-row table skeleton mimicking active schedules (schedule type, days/specific date fields, time slots, and status toggle/delete options).

### E. Admin Booking Queue (`src/app/admin/bookings/page.tsx`)
- **Layout**: Displays a 3-row table skeleton representing active queue items (customer info blocks, service/barber blocks, date/time blocks, status badge, and action dropdown outline).

### F. Time Slot Selection (`src/app/components/BookingForm.tsx`)
- **Layout**: Replaces the text "Mengecek ketersediaan..." with a grid containing 6 block skeletons that match the shape of time slot buttons.

---

## 2. Documentation Architecture

We will structure the documentation as follows:

```text
├── README.md (EN - Main Quickstart)
├── README_ID.md (ID - Panduan Singkat Utama)
└── documentation/ (EN - Technical deep-dives)
    ├── installation.md (Local setup & seed instruction)
    ├── database.md (Database schema & RLS policies)
    ├── payment_gateway.md (Midtrans Sandbox & Ngrok webhook testing)
    ├── notifications.md (Email Resend & Fonnte WA details)
    └── id/ (ID - Panduan teknis mendalam)
        ├── installation.md
        ├── database.md
        ├── payment_gateway.md
        └── notifications.md
```

---

## 3. Verification Plan

### Automated Build Verification
- Execute `bun run build` to confirm zero compilation, routing, or typescript errors.

### Manual Verification
- Visual inspection of dev console when throttling network to "Slow 3G" or "Fast 3G" in browser devtools to check HMR dev server and inspect the look and feel of the shimmer skeletons.
