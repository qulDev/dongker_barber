# Dongker Barber Website

A premium Barbershop Booking & Management platform built with Next.js, Supabase, and Midtrans Sandbox. Features real-time slot scheduling, automated notifications (Resend Email & Fonnte WhatsApp), and an interactive booking workflow.

---

## Technical Stack
*   **Framework**: Next.js 15+ (App Router)
*   **Runtime**: Bun
*   **Database**: Supabase (PostgreSQL with RLS)
*   **Payment Gateway**: Midtrans (Snap SDK)
*   **Styling**: Vanilla CSS & CSS Modules (Premium dark-gold theme)
*   **Notifications**: Resend (Email), Fonnte (WhatsApp)
*   **State & Realtime**: Supabase Realtime for instant queue sync

---

## Directory Structure
```text
├── src/
│   ├── app/
│   │   ├── admin/             # Admin Panels (Services, Barbers, Bookings, Schedules)
│   │   ├── api/               # API Endpoints (checkout, webhook, confirm)
│   │   ├── booking/           # Customer Booking Detail & Realtime Status page
│   │   ├── components/        # Global components (BookingForm, Header)
│   │   └── globals.css        # Global CSS & Design Tokens (Shimmer skeletons)
│   ├── assets/                # Portfolio assets
│   ├── lib/                   # Supabase Client configuration
│   └── utils/                 # Notification utilities (WhatsApp, Email templates)
├── public/                    # Static assets (portraits, icons)
├── documentation/             # Technical deep-dive documentation
└── package.json
```

---

## Quickstart

### 1. Prerequisites
Ensure you have **Node.js** or **Bun** installed on your system.

### 2. Install Dependencies
Clone the repository and install dependencies using Bun:
```bash
bun install
```

### 3. Environment Variables
Create a `.env` file in the root folder with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_SERVER_KEY=your_midtrans_server_key

FONNTE_API_TOKEN=your_fonnte_token
RESEND_API_KEY=your_resend_key
```

### 4. Database Seeding
To run database seeds and add initial admin credentials:
```bash
bun run seed_users.ts
```

### 5. Running the Dev Server
Start the development server locally:
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Detailed Technical Guides
For deep dives on specific subsystems, please check:
*   [Installation & Setup](documentation/installation.md)
*   [Database Schema & RLS Policies](documentation/database.md)
*   [Payment Gateway Integration & Ngrok Webhooks](documentation/payment_gateway.md)
*   [Notifications Integration (Email & WhatsApp)](documentation/notifications.md)
