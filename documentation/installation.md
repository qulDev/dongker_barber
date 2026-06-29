# Installation & Local Setup Guide

This guide describes how to install, set up environment configurations, populate seeds, and launch the Dongker Barber development server locally.

## Prerequisites
*   **Runtime**: Bun v1.0.0 or higher (recommended) or Node.js v18.0.0 or higher.
*   **Database**: Supabase account and PostgreSQL instance.
*   **API Tokens**: Midtrans Sandbox account, Fonnte account, and Resend account.

---

## Step-by-Step Installation

### 1. Clone the Project
Navigate to your working directory and clone the project files.

### 2. Install Dependencies
Run the installation command in your terminal:
```bash
bun install
```

### 3. Setup Environment File (`.env`)
Create a `.env` file at the root level of the project. Fill in the required credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Midtrans Configuration (Sandbox)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
MIDTRANS_SERVER_KEY=SB-Mid-server-...

# Notification Gateway Tokens
FONNTE_API_TOKEN=your_fonnte_whatsapp_token
RESEND_API_KEY=re_your_resend_email_key
```

### 4. Create and Seed Database Tables
1. Open your Supabase SQL Editor.
2. Run the RLS policy migrations provided in [`rls_policies.sql`](file:///c:/DEV/JOKI/docker_mc/dongker_barber/rls_policies.sql).
3. Populate database seeds and create the default admin credentials by running the following script:
```bash
bun run seed_users.ts
```
*Default Admin Credentials:*
*   **Email**: `admin@dongkerbarber.com`
*   **Password**: `admin12345`

### 5. Launch the Local Server
Run the local next development environment:
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) to access the landing page, and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to login as Admin.
