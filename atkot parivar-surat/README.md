# Atkot Parivar-Surat

Expo React Native scaffold for the Atkot Parivar-Surat community app.

## Included

- JWT login flow with secure token storage.
- Required member profile onboarding.
- Member Directory with WhatsApp tap-to-chat.
- News & Alerts screen with FCM/APNs token registration.
- Parivar Achievements screen with gallery/camera upload to Supabase Storage.
- Help ticket form that writes to Supabase and can call an email webhook.

## Run

```bash
npm install
npm start
```

## Environment

Copy `.env.example` to `.env` and fill:

```bash
EXPO_PUBLIC_API_BASE_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPPORT_EMAIL_WEBHOOK_URL=
```

The login flow runs in demo mode until `EXPO_PUBLIC_API_BASE_URL` is set.

## Firebase Cloud Messaging

Add your Firebase Android file at `google-services.json`. Push notifications require a development build or APK; Expo Go does not support remote push notifications on Android SDK 53+.

The app saves native push tokens in a Supabase `push_tokens` table. Your admin backend or Supabase Edge Function should send FCM notifications when you insert a row into `news_alerts`.

## Supabase setup

Create a public storage bucket named `student-results`.

```sql
create table news_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table push_tokens (
  token text primary key,
  member_id text,
  token_type text,
  platform text,
  updated_at timestamptz not null default now()
);

create table student_results (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  standard text not null,
  member_id text,
  image_path text not null,
  image_url text,
  status text not null default 'pending_review',
  created_at timestamptz not null default now()
);

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  member_id text,
  member_name text,
  member_whatsapp text,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
```
