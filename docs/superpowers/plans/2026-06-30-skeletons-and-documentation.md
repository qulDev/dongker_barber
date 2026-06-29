# Skeletons and Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement high-fidelity CSS shimmer-based skeleton loaders for all loading screens, and create complete English/Indonesian project documentation.

**Architecture:** Use CSS shimmer skeletons that replicate the dimensions and hierarchy of the actual content. Add comprehensive markdown guides under `documentation/` and translations under `documentation/id/`.

**Tech Stack:** Next.js, CSS, Supabase, Midtrans API.

## Global Constraints
- Skeletons must use the `.skeleton` class from `src/app/globals.css`.
- Skeletons must not cause layout shifts when data finishes loading.
- Documentation must cover Supabase, Midtrans Sandbox, Resend Email, and Fonnte WhatsApp integrations.

---

### Task 1: Booking Detail Receipt Loader

**Files:**
- Modify: `src/app/booking/[id]/page.tsx`

**Interfaces:**
- Consumes: `.skeleton` style class from global CSS.

- [ ] **Step 1: Replace booking detail receipt loading state**

Modify `src/app/booking/[id]/page.tsx` to replace:
```typescript
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-muted)' }}>
        Memuat detail reservasi...
      </div>
    );
  }
```
With a full-receipt layout skeleton:
```typescript
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem 1.5rem' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '580px', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Status Badge Skeleton */}
          <div className="skeleton" style={{ width: '220px', height: '40px', borderRadius: '50px', marginBottom: '2rem' }} />
          
          {/* Title Skeletons */}
          <div className="skeleton" style={{ width: '60%', height: '1.75rem', marginBottom: '0.75rem' }} />
          <div className="skeleton" style={{ width: '40%', height: '0.85rem', marginBottom: '2.5rem' }} />

          {/* Details Card Skeleton */}
          <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.75rem' }}>
                <div className="skeleton" style={{ width: '30%', height: '0.9rem' }} />
                <div className="skeleton" style={{ width: '45%', height: '0.9rem' }} />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
              <div className="skeleton" style={{ width: '25%', height: '1rem' }} />
              <div className="skeleton" style={{ width: '35%', height: '1.2rem' }} />
            </div>
          </div>

          {/* Back Button Skeleton */}
          <div className="skeleton" style={{ width: '100%', height: '50px', borderRadius: '50px' }} />
        </div>
      </div>
    );
  }
```

- [ ] **Step 2: Run build to verify type correctness**

Run command: `bun run build`
Expected: Passes successfully with zero compilation errors.

- [ ] **Step 3: Commit**

Run commands:
```bash
git add src/app/booking/[id]/page.tsx
git commit -m "feat: add skeleton loader for booking detail page"
```

---

### Task 2: Admin Dashboard Tables (Services, Barbers, Schedule, Bookings)

**Files:**
- Modify: `src/app/admin/services/page.tsx`
- Modify: `src/app/admin/barbers/page.tsx`
- Modify: `src/app/admin/schedule/page.tsx`
- Modify: `src/app/admin/bookings/page.tsx`

- [ ] **Step 1: Replace loading state in admin services**

Modify `src/app/admin/services/page.tsx` around line 307:
Replace:
```typescript
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat data...</div>
          ) : services.length === 0 ? (
```
With:
```typescript
          {loading ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Layanan</th>
                    <th>Harga</th>
                    <th>Durasi</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td>
                        <div className="skeleton" style={{ width: '120px', height: '1rem', marginBottom: '0.5rem' }} />
                        <div className="skeleton" style={{ width: '200px', height: '0.8rem' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '70px', height: '1rem' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '60px', height: '1rem' }} />
                      </td>
                      <td>
                        <div className={styles.actionCell} style={{ justifyContent: 'center', gap: '0.5rem' }}>
                          <div className="skeleton" style={{ width: '32px', height: '28px', borderRadius: '6px' }} />
                          <div className="skeleton" style={{ width: '32px', height: '28px', borderRadius: '6px' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : services.length === 0 ? (
```

- [ ] **Step 2: Replace loading state in admin barbers**

Modify `src/app/admin/barbers/page.tsx` around line 300:
Replace:
```typescript
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat data...</div>
          ) : barbers.length === 0 ? (
```
With:
```typescript
          {loading ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nama & Spesialisasi</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ width: '100px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td>
                        <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '110px', height: '1rem', marginBottom: '0.4rem' }} />
                        <div className="skeleton" style={{ width: '160px', height: '0.8rem' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '45px', height: '1rem' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '55px', height: '1rem', borderRadius: '4px' }} />
                      </td>
                      <td>
                        <div className={styles.actionCell} style={{ gap: '0.5rem' }}>
                          <div className="skeleton" style={{ width: '32px', height: '28px', borderRadius: '6px' }} />
                          <div className="skeleton" style={{ width: '32px', height: '28px', borderRadius: '6px' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : barbers.length === 0 ? (
```

- [ ] **Step 3: Replace loading state in admin schedule**

Modify `src/app/admin/schedule/page.tsx` around line 298:
Replace:
```typescript
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>Memuat jadwal...</div>
          ) : schedules.length === 0 ? (
```
With:
```typescript
          {loading ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tipe Jadwal</th>
                    <th>Detail Waktu / Hari</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td>
                        <div className="skeleton" style={{ width: '90px', height: '1rem' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '120px', height: '1rem', marginBottom: '0.4rem' }} />
                        <div className="skeleton" style={{ width: '140px', height: '0.8rem' }} />
                      </td>
                      <td>
                        <div className="skeleton" style={{ width: '65px', height: '1rem', borderRadius: '4px' }} />
                      </td>
                      <td>
                        <div className={styles.actionCell} style={{ justifyContent: 'center' }}>
                          <div className="skeleton" style={{ width: '32px', height: '28px', borderRadius: '6px' }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : schedules.length === 0 ? (
```

- [ ] **Step 4: Replace loading state in admin bookings queue**

Modify `src/app/admin/bookings/page.tsx` around line 227:
Replace:
```typescript
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Memuat data antrean...</div>
        ) : bookings.length === 0 ? (
```
With:
```typescript
        {loading ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>Layanan & Barber</th>
                  <th>Tanggal & Jam</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Ubah Status Aksi</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td>
                      <div className="skeleton" style={{ width: '120px', height: '1rem', marginBottom: '0.4rem' }} />
                      <div className="skeleton" style={{ width: '90px', height: '0.8rem', marginBottom: '0.3rem' }} />
                      <div className="skeleton" style={{ width: '150px', height: '0.8rem' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '100px', height: '1rem', marginBottom: '0.4rem' }} />
                      <div className="skeleton" style={{ width: '120px', height: '0.8rem' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '100px', height: '1rem', marginBottom: '0.4rem' }} />
                      <div className="skeleton" style={{ width: '130px', height: '0.8rem' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '65px', height: '1.25rem', borderRadius: '4px' }} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '6px' }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : bookings.length === 0 ? (
```

- [ ] **Step 5: Run build to verify type correctness**

Run: `bun run build`
Expected: Passes successfully with zero compilation errors.

- [ ] **Step 6: Commit**

Run commands:
```bash
git add src/app/admin/services/page.tsx src/app/admin/barbers/page.tsx src/app/admin/schedule/page.tsx src/app/admin/bookings/page.tsx
git commit -m "feat: add table skeleton loaders to all admin dashboard sections"
```

---

### Task 3: Slot Grid Skeleton in BookingForm

**Files:**
- Modify: `src/app/components/BookingForm.tsx`

- [ ] **Step 1: Replace booking form time slots text loader**

Modify `src/app/components/BookingForm.tsx` around line 354:
Replace:
```typescript
          {isTimeLoading ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)' }}>Mengecek ketersediaan slot...</div>
          ) : slots.length === 0 ? (
```
With:
```typescript
          {isTimeLoading ? (
            <div className={styles.slotsGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton" style={{ height: '38px', borderRadius: '8px' }} />
              ))}
            </div>
          ) : slots.length === 0 ? (
```

- [ ] **Step 2: Run build to verify type correctness**

Run: `bun run build`
Expected: Passes successfully.

- [ ] **Step 3: Commit**

Run commands:
```bash
git add src/app/components/BookingForm.tsx
git commit -m "feat: replace booking form time slots loader with skeleton buttons grid"
```

---

### Task 4: English Documentation

**Files:**
- Create: `README.md`
- Create: `documentation/installation.md`
- Create: `documentation/database.md`
- Create: `documentation/payment_gateway.md`
- Create: `documentation/notifications.md`

- [ ] **Step 1: Create README.md (English)**

Write complete readme covering tech stack, configuration, quick start, folder structure, and deployment to `README.md`.

- [ ] **Step 2: Create installation.md**

Write deep installation guide including setup of Node, Bun, cloning project, configuring `.env`, Supabase migration & seeding commands.

- [ ] **Step 3: Create database.md**

Write details about schema tables (`services`, `barbers`, `schedules`, `bookings`, `users`), relationship mappings, RLS setup.

- [ ] **Step 4: Create payment_gateway.md**

Write complete integration setup for Midtrans Sandbox API, webhook routing, local testing instructions using Ngrok.

- [ ] **Step 5: Create notifications.md**

Write setup details for Resend (email confirmation sending) and Fonnte (WhatsApp confirmation sending).

- [ ] **Step 6: Commit**

Run commands:
```bash
git add README.md documentation/
git commit -m "docs: add English quickstart and deep-dive technical guides"
```

---

### Task 5: Indonesian Documentation

**Files:**
- Create: `README_ID.md`
- Create: `documentation/id/installation.md`
- Create: `documentation/id/database.md`
- Create: `documentation/id/payment_gateway.md`
- Create: `documentation/id/notifications.md`

- [ ] **Step 1: Translate and create README_ID.md**

Write matching Indonesian documentation for project overview, setup, and structure to `README_ID.md`.

- [ ] **Step 2: Create documentation/id/installation.md**

Provide step-by-step setup details in Indonesian.

- [ ] **Step 3: Create documentation/id/database.md**

Provide detailed table structures and RLS configurations in Indonesian.

- [ ] **Step 4: Create documentation/id/payment_gateway.md**

Provide detailed Midtrans Sandbox and Ngrok setup configurations in Indonesian.

- [ ] **Step 5: Create documentation/id/notifications.md**

Provide detailed Fonnte and Resend setups in Indonesian.

- [ ] **Step 6: Commit**

Run commands:
```bash
git add README_ID.md documentation/id/
git commit -m "docs: add Indonesian translations for all readme and technical guides"
```
