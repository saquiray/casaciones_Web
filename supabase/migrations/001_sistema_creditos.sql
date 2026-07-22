-- ============================================================
-- Sistema de creditos - Casaciones Web
-- Ejecutar este script completo en: Supabase > SQL Editor
-- Es seguro volver a ejecutarlo (usa IF NOT EXISTS / OR REPLACE)
-- ============================================================

-- 1. Saldo de creditos en el perfil del usuario
alter table public.perfiles
  add column if not exists creditos integer not null default 0;

-- 2. Paquetes de creditos que se pueden comprar (membresias de creditos)
create table if not exists public.paquetes_creditos (
  id text primary key,
  nombre text not null,
  creditos integer not null,
  precio numeric(10,2) not null,
  descripcion text,
  destacado boolean not null default false,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.paquetes_creditos enable row level security;

drop policy if exists "paquetes_creditos_select_publico" on public.paquetes_creditos;
create policy "paquetes_creditos_select_publico"
  on public.paquetes_creditos for select
  using (activo = true);

-- Paquetes iniciales (ajusta precios/creditos segun necesites)
insert into public.paquetes_creditos (id, nombre, creditos, precio, descripcion, destacado, activo)
values
  ('pack-basico', 'Paquete Basico', 100, 19.00, '100 creditos para consultas', false, true),
  ('pack-popular', 'Paquete Popular', 500, 69.00, '500 creditos para consultas', true, true),
  ('pack-pro', 'Paquete Profesional', 2000, 199.00, '2000 creditos para consultas', false, true)
on conflict (id) do nothing;

-- 3. Historial / ledger de movimientos de creditos (compras y consumos)
create table if not exists public.creditos_historial (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid not null references public.perfiles(id) on delete cascade,
  tipo text not null check (tipo in ('compra', 'consumo', 'ajuste')),
  cantidad integer not null, -- positivo en compra/ajuste, negativo en consumo
  saldo_resultante integer not null,
  descripcion text,
  culqi_charge_id text,
  created_at timestamptz not null default now()
);

alter table public.creditos_historial enable row level security;

drop policy if exists "creditos_historial_select_propio" on public.creditos_historial;
create policy "creditos_historial_select_propio"
  on public.creditos_historial for select
  using (auth.uid() = perfil_id);

create index if not exists idx_creditos_historial_perfil on public.creditos_historial(perfil_id, created_at desc);

-- 4. Extender la tabla de pagos para distinguir suscripcion vs compra de creditos
alter table public.pagos
  add column if not exists tipo text not null default 'suscripcion' check (tipo in ('suscripcion', 'creditos'));

alter table public.pagos
  add column if not exists referencia_id text; -- id del plan o del paquete_creditos

alter table public.pagos
  add column if not exists creditos_otorgados integer;

-- ============================================================
-- Fin de la migracion
-- ============================================================
