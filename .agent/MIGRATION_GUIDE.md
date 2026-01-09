# CLIENT PORTAL - MIGRATION GUIDE

## ⚠️ IMPORTANTE: ORDEN DE EJECUCIÓN

Las migraciones DEBEN ejecutarse en orden debido a limitaciones de PostgreSQL con enums.

## 📋 PASOS DE INSTALACIÓN

### Paso 1: Ejecutar Part 1 (Enum Extension)
**Archivo:** `20260108200000_client_portal_part1_enum.sql`

```sql
-- Copiar y pegar en Supabase Dashboard → SQL Editor
-- Este archivo agrega 'client' al enum user_role
```

**Resultado esperado:**
```
✅ Added "client" value to user_role enum
```

**⚠️ IMPORTANTE:** Espera a que esta query se complete y confirme (COMMIT) antes de continuar.

---

### Paso 2: Ejecutar Part 2 (Main Migration)
**Archivo:** `20260108200001_client_portal_part2_main.sql`

```sql
-- Copiar y pegar en Supabase Dashboard → SQL Editor
-- Este archivo crea tablas, políticas y funciones
```

**Resultado esperado:**
```
✅ Client Portal migration completed successfully!
📊 Profiles table: READY
🔐 RLS policies: ACTIVE
👥 Role mapping: admin=admin, vet/assistant/receptionist=staff, client=client
🚀 System ready for client registration
```

---

## 🔍 VERIFICACIÓN

### 1. Verificar Enum
```sql
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
ORDER BY enumsortorder;
```

**Debe mostrar:**
```
admin
vet
assistant
receptionist
client  ← Debe aparecer
```

### 2. Verificar Tabla Profiles
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

**Debe incluir:**
- `id` (uuid)
- `role` (user_role) DEFAULT 'client'
- `full_name` (text)
- `phone` (text)
- `avatar_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 3. Verificar Políticas RLS
```sql
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('profiles', 'clients', 'patients', 'appointments')
ORDER BY tablename, policyname;
```

**Debe mostrar políticas para:**
- profiles (4 políticas)
- clients (3 políticas)
- patients (4 políticas)
- appointments (4 políticas)

---

## 🧪 PRUEBAS

### Test 1: Registro de Cliente
1. Ir a `/auth/register`
2. Completar formulario
3. Verificar redirect a `/client`
4. Verificar que se creó perfil con `role='client'`

```sql
-- Verificar en Supabase
SELECT id, role, full_name, email
FROM profiles
JOIN auth.users ON profiles.id = auth.users.id
WHERE role = 'client';
```

### Test 2: Login con Roles
**Cliente:**
- Login → Debe redirigir a `/client`

**Staff (admin/vet/assistant/receptionist):**
- Login → Debe redirigir a `/dashboard`

### Test 3: RLS (Row Level Security)
**Como cliente:**
```sql
-- Debe ver solo sus mascotas
SELECT * FROM patients WHERE owner_id IN (
    SELECT id FROM clients WHERE user_id = auth.uid()
);
```

**Como staff:**
```sql
-- Debe ver todas las mascotas
SELECT * FROM patients;
```

---

## ❌ TROUBLESHOOTING

### Error: "enum value already exists"
**Solución:** El valor 'client' ya fue agregado. Puedes saltar el Part 1 y ejecutar solo Part 2.

### Error: "unsafe use of new value"
**Causa:** Intentaste usar el nuevo valor 'client' antes de que se confirmara (commit).

**Solución:** 
1. Ejecuta Part 1 SOLO
2. Espera a que termine
3. Luego ejecuta Part 2

### Error: "table already exists"
**Solución:** Las migraciones son idempotentes. Puedes ejecutarlas múltiples veces sin problemas.

### Error: "policy already exists"
**Solución:** Las políticas se eliminan antes de crearse. Esto es normal y esperado.

---

## 🗑️ ROLLBACK (Si es necesario)

### Eliminar Políticas
```sql
-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Clients
DROP POLICY IF EXISTS "Clients can view own record" ON clients;
DROP POLICY IF EXISTS "Clients can update own record" ON clients;
DROP POLICY IF EXISTS "Staff can manage clients" ON clients;

-- Patients
DROP POLICY IF EXISTS "Clients can view own pets" ON patients;
DROP POLICY IF EXISTS "Clients can create own pets" ON patients;
DROP POLICY IF EXISTS "Clients can update own pets" ON patients;
DROP POLICY IF EXISTS "Staff can manage all pets" ON patients;

-- Appointments
DROP POLICY IF EXISTS "Clients can view own appointments" ON appointments;
DROP POLICY IF EXISTS "Clients can create own appointments" ON appointments;
DROP POLICY IF EXISTS "Clients can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Staff can manage all appointments" ON appointments;
```

### Eliminar Tabla Profiles
```sql
DROP TABLE IF EXISTS profiles CASCADE;
```

### Eliminar Funciones
```sql
DROP FUNCTION IF EXISTS get_user_role(UUID);
DROP FUNCTION IF EXISTS is_staff_or_admin();
DROP FUNCTION IF EXISTS update_updated_at_column();
```

### Eliminar Valor del Enum
⚠️ **NO SE PUEDE** eliminar valores de un enum en PostgreSQL.
Si necesitas hacerlo, debes:
1. Crear un nuevo enum
2. Migrar todos los datos
3. Eliminar el enum antiguo

---

## 📊 ARCHIVOS DE MIGRACIÓN

| Archivo | Orden | Descripción |
|---------|-------|-------------|
| `20260108200000_client_portal_part1_enum.sql` | 1️⃣ | Agrega 'client' al enum |
| `20260108200001_client_portal_part2_main.sql` | 2️⃣ | Crea tablas y políticas |
| `20260108200000_client_portal_system.sql` | ❌ | **OBSOLETO** - No usar |

---

## ✅ CHECKLIST DE INSTALACIÓN

- [ ] Ejecutar Part 1 (enum)
- [ ] Esperar confirmación
- [ ] Ejecutar Part 2 (main)
- [ ] Verificar enum tiene 'client'
- [ ] Verificar tabla profiles existe
- [ ] Verificar políticas RLS creadas
- [ ] Probar registro de cliente
- [ ] Probar login con roles
- [ ] Verificar RLS funciona

---

**Última Actualización:** 2026-01-08  
**Estado:** ✅ Listo para producción  
**Versión:** 2.1 (Split Migration)
