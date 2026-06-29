# Database Schema & Row-Level Security (RLS)

This guide documents the database structure, relationship mappings, and the Row-Level Security (RLS) settings configured in Supabase.

---

## 1. Table Schema Diagrams

The application relies on 4 primary operational tables and Supabase Auth tables.

### `services`
Stores the catalog of hair cuts, grooming, and treatment options.
*   `id`: `uuid` (Primary Key, default: `gen_random_uuid()`)
*   `name`: `text` (Service name)
*   `description`: `text` (Details of the service)
*   `price`: `numeric` (Service cost in IDR)
*   `duration_minutes`: `integer` (Duration in minutes)
*   `image_url`: `text` (Optional URL to service banner/example image)
*   `status`: `text` (Default: `'active'`, status: `'active'` or `'inactive'`)

### `barbers`
Stores barber profiles and ratings.
*   `id`: `uuid` (Primary Key, default: `gen_random_uuid()`)
*   `name`: `text` (Barber name)
*   `specialization`: `text` (e.g., "Classic Cuts", "Beard Specialist")
*   `rating`: `numeric` (Average rating, default: `5.0`)
*   `avatar_url`: `text` (Url to portrait)
*   `status`: `text` (Default: `'active'`)

### `schedules`
Stores barber schedules, work hours, and calendar overrides.
*   `id`: `uuid` (Primary Key)
*   `barber_id`: `uuid` (Foreign Key referencing `barbers.id` ON DELETE CASCADE)
*   `day_of_week`: `integer` (0-6 representing Sunday-Saturday for weekly schedules)
*   `specific_date`: `date` (Optional specific date override, e.g. "2026-06-30")
*   `start_time`: `time` (Starting shift hour, e.g., "10:00:00")
*   `end_time`: `time` (Ending shift hour, e.g., "20:00:00")
*   `is_available`: `boolean` (Default: `true`. If false, barber is off-shift)

### `bookings`
Stores reservation records, payment states, and customer contact details.
*   `id`: `uuid` (Primary Key, default: `gen_random_uuid()`)
*   `service_id`: `uuid` (Foreign Key referencing `services.id`)
*   `barber_id`: `uuid` (Foreign Key referencing `barbers.id`)
*   `customer_name`: `text`
*   `customer_email`: `text`
*   `customer_phone`: `text`
*   `booking_date`: `date` (e.g. "2026-06-30")
*   `start_time`: `time`
*   `end_time`: `time`
*   `status`: `text` (Default: `'pending'`. Options: `'pending'`, `'paid'`, `'cancelled'`)
*   `price`: `numeric` (Total checkout price)

---

## 2. Row-Level Security (RLS) Policies
Supabase RLS is enabled on all tables to ensure customers can insert bookings and read catalogs anonymously, while modifications (creating services, updating schedules, and changing barber details) are restricted to authenticated administrators.

### Policy Implementations (`rls_policies.sql`)
The policies are configured as follows:
*   **`services` / `barbers` / `schedules`**:
    *   `SELECT` (Read): Allowed for anyone (anon) to display menus and schedules on the client booking form.
    *   `INSERT` / `UPDATE` / `DELETE`: Restricted to authenticated users only (`authenticated`).
*   **`bookings`**:
    *   `SELECT`: Allowed for anyone to check slot availability and display the customer receipt page.
    *   `INSERT`: Allowed for anyone to make a new booking.
    *   `UPDATE`: Restricted to authenticated admins (or client-side secure update callbacks).
