# Configuración Supabase — Nixon Tours

## 1. Proyecto

1. Crea un proyecto en [Supabase](https://supabase.com).
2. En **Settings → API**, copia **Project URL** y la clave **anon public**.

## 2. Variables de entorno

Copia `env.example` a `.env.local` en la raíz del proyecto y reemplaza:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Base de datos

1. Abre **SQL Editor** en Supabase.
2. Pega y ejecuta el contenido de `supabase/migrations/001_initial_schema.sql` (tablas, RLS, bucket `media`, datos iniciales).

## 4. Autenticación (panel admin)

1. Ve a **Authentication → Users** y crea un usuario (email/contraseña).
2. Inicia sesión en `/admin/login` con esas credenciales.

Las políticas RLS permiten:

- Lectura pública de `islands`, `packages` activos y `site_settings`.
- Inserción anónima de `quotes` (formularios del sitio).
- Lectura/escritura completa para usuarios **autenticados** en tablas y storage `media`.

## 5. Storage

El script crea el bucket público `media`. Si subes desde el admin, el usuario debe estar logueado.

## 6. Logo

Sube el logo oficial desde **Admin → Configuración** o define `logo_url` en `site_settings`. No sustituyas el diseño del logo en código.
