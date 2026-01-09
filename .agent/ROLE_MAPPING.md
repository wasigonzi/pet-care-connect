# ROLE MAPPING - Client Portal System

## 🔄 PROBLEMA Y SOLUCIÓN

### ❌ Problema Original
La migración intentaba usar roles `'admin', 'staff', 'client'` pero el sistema ya tenía un enum `user_role` definido con valores diferentes:

```sql
-- Enum existente en 20240101000000_init_schema.sql
CREATE TYPE user_role AS ENUM ('admin', 'vet', 'assistant', 'receptionist');
```

### ✅ Solución Implementada
Extender el enum existente agregando `'client'` y mapear los roles de staff:

```sql
-- Agregar 'client' al enum existente
ALTER TYPE user_role ADD VALUE 'client';

-- Mapeo de roles:
-- - admin = admin (sin cambios)
-- - vet, assistant, receptionist = staff (equivalentes)
-- - client = client (nuevo)
```

## 📊 MAPEO DE ROLES

| Rol en DB | Tipo | Permisos | Descripción |
|-----------|------|----------|-------------|
| **admin** | Staff | Completos | Administrador de la clínica |
| **vet** | Staff | Completos | Veterinario |
| **assistant** | Staff | Completos | Asistente veterinario |
| **receptionist** | Staff | Completos | Recepcionista |
| **client** | Cliente | Limitados | Dueño de mascota |

## 🔐 POLÍTICAS RLS

### Función Helper
```sql
CREATE OR REPLACE FUNCTION is_staff_or_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'vet', 'assistant', 'receptionist')
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
```

### Permisos por Rol

#### Staff (admin, vet, assistant, receptionist)
- ✅ Ver todos los clientes
- ✅ Ver todas las mascotas
- ✅ Ver todas las citas
- ✅ Ver todas las facturas
- ✅ Crear/editar/eliminar cualquier registro
- ✅ Gestionar comunicaciones

#### Client
- ✅ Ver solo SU perfil
- ✅ Ver solo SUS mascotas
- ✅ Crear/editar SUS mascotas
- ✅ Ver solo SUS citas
- ✅ Solicitar citas para SUS mascotas
- ✅ Cancelar SUS citas (si están pendientes/programadas)
- ✅ Ver solo SUS facturas
- ✅ Ver solo comunicaciones enviadas a ÉL
- ❌ NO puede ver datos de otros clientes

## 💻 CÓDIGO TYPESCRIPT

### Tipos Actualizados
```typescript
// lib/auth-helpers.ts
export type UserRole = 'admin' | 'vet' | 'assistant' | 'receptionist' | 'client';
export type StaffRole = 'admin' | 'vet' | 'assistant' | 'receptionist';

// Helper para verificar si es staff
export function isStaffRole(role: UserRole): role is StaffRole {
    return ['admin', 'vet', 'assistant', 'receptionist'].includes(role);
}
```

### Funciones de Autorización
```typescript
// Requiere rol de cliente
await requireClient(); // Redirige a /dashboard si es staff

// Requiere rol de staff
await requireStaff(); // Redirige a /client si es cliente

// Verificar rol específico
const isAdmin = await hasRole('admin');
const isStaff = await hasRole(['admin', 'vet', 'assistant', 'receptionist']);
```

## 🔄 REDIRECCIÓN BASADA EN ROLES

### Login
```typescript
// app/login/actions.ts
if (profile.role === 'client') {
    redirect("/client");
} else {
    // admin, vet, assistant, receptionist
    redirect("/dashboard");
}
```

### Protección de Rutas
```typescript
// /client/* - Solo clientes
await requireClient();

// /dashboard/* - Solo staff
await requireStaff();
```

## 📝 MIGRACIÓN DE USUARIOS EXISTENTES

### Usuarios de Staff Existentes
Los usuarios con roles `admin`, `vet`, `assistant`, `receptionist` continúan funcionando normalmente. No se requiere migración.

### Nuevos Clientes
Al registrarse, se crea automáticamente con `role='client'`:

```typescript
// app/auth/register/page.tsx
await supabase.from('profiles').insert({
    id: authData.user.id,
    role: 'client', // ✅ Nuevo valor del enum
    full_name: `${firstName} ${lastName}`,
    phone: phone || null,
});
```

## 🧪 VERIFICACIÓN

### 1. Verificar Enum
```sql
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;
```

**Resultado esperado:**
```
admin
vet
assistant
receptionist
client  ← Nuevo
```

### 2. Verificar Políticas
```sql
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'clients', 'patients', 'appointments')
ORDER BY tablename, policyname;
```

### 3. Probar Acceso
```sql
-- Como cliente (user_id = '...')
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'client-user-id';

-- Debería ver solo sus datos
SELECT * FROM patients; -- Solo sus mascotas
SELECT * FROM appointments; -- Solo sus citas
```

## ⚠️ NOTAS IMPORTANTES

1. **No se puede eliminar valores del enum** - PostgreSQL no permite `ALTER TYPE ... DROP VALUE`. Por eso extendemos en lugar de reemplazar.

2. **Compatibilidad hacia atrás** - Todos los roles existentes (`admin`, `vet`, `assistant`, `receptionist`) siguen funcionando sin cambios.

3. **Migración idempotente** - Puede ejecutarse múltiples veces sin errores gracias a:
   ```sql
   IF NOT EXISTS (
       SELECT 1 FROM pg_enum WHERE enumlabel = 'client' ...
   ) THEN
       ALTER TYPE user_role ADD VALUE 'client';
   END IF;
   ```

4. **Función `is_staff_or_admin()`** - Centraliza la lógica de verificación de staff para evitar duplicación en políticas RLS.

## 🚀 PRÓXIMOS PASOS

1. ✅ Ejecutar migración actualizada
2. ✅ Verificar que el enum tiene 'client'
3. ✅ Probar registro de nuevo cliente
4. ✅ Verificar redirección basada en roles
5. ✅ Probar RLS (cliente solo ve sus datos)
6. ✅ Probar que staff ve todos los datos

---

**Última Actualización:** 2026-01-08  
**Estado:** ✅ Compatible con schema existente  
**Versión:** 2.0 (Compatible)
