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
2. Ejecuta los archivos SQL **en orden** (mismo contenido que en `supabase/migrations/`):

   - `001_initial_schema.sql`
   - `002_premium_platform.sql`
   - `003_site_gallery_urls.sql`

## 4. Autenticación (panel admin)

**Importante:** quien se registra en la web (`/registro`) queda como **cliente** (`role = 'customer'`). Eso **no** abre el panel admin.

Para entrar en **Administración**:

1. Usá tu usuario existente en **Authentication → Users** (el email con el que te registraste) o creá uno nuevo con email/contraseña desde el mismo apartado.

2. En **SQL Editor**, promové el perfil a admin (con el mismo email):

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'tu-email@ejemplo.com';
   ```

3. Cerrá sesión en la web si estás logueado y abrí **`/admin/login`** (no es lo mismo que `/login` para clientes). Ingresá ese email y contraseña.

La home muestra lo que está en la base de datos (islas, paquetes con **Paquete activo** marcado y la galería definida en **Admin → Configuración**). Al guardar en el panel, tras un refresco o en unos segundos por revalidación, se actualiza también en producción.

Las políticas RLS permiten:

- Lectura pública de `islands`, `packages` activos y `site_settings`.
- Inserción anónima de `quotes` (formularios del sitio).
- Lectura/escritura completa para usuarios **autenticados** en tablas y storage `media`.

## 5. Storage

El script crea el bucket público `media`. Si subes desde el admin, el usuario debe estar logueado.

## 6. Logo

Sube el logo oficial desde **Admin → Configuración** o define `logo_url` en `site_settings`. No sustituyas el diseño del logo en código.
