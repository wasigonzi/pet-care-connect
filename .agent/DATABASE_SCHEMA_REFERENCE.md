# DATABASE SCHEMA REFERENCE - Client Portal

## 📊 ENUM TYPES

### user_role
**Valores válidos:**
```sql
CREATE TYPE user_role AS ENUM (
    'admin',
    'vet',
    'assistant',
    'receptionist',
    'client'  -- Agregado por migración
);
```

**Mapeo para el portal:**
- `admin`, `vet`, `assistant`, `receptionist` → **Staff** (acceso a `/dashboard`)
- `client` → **Cliente** (acceso a `/client`)

---

### appointment_status
**Valores válidos:**
```sql
CREATE TYPE appointment_status AS ENUM (
    'scheduled',    -- Programada
    'confirmed',    -- Confirmada
    'in_progress',  -- En progreso
    'completed',    -- Completada
    'cancelled',    -- Cancelada
    'no_show'       -- No asistió
);
```

**Uso en el portal de clientes:**
- Crear cita → `status = 'scheduled'`
- Cancelar cita → `status = 'cancelled'`
- Editar solo si → `status IN ('scheduled', 'confirmed')`

---

## 🗂️ TABLAS PRINCIPALES

### profiles
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'client',
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### clients
```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- Agregado
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    -- ... otros campos
);
```

### patients
```sql
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,  -- NO owner_id
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Unknown')),
    -- ... otros campos
);
```

### appointments
```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    vet_id UUID REFERENCES profiles(id),
    appointment_type TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    -- ... otros campos
);
```

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### Error: "invalid input value for enum user_role: 'staff'"
**Causa:** Intentar usar `'staff'` que no existe en el enum.  
**Solución:** Usar `'admin'`, `'vet'`, `'assistant'`, o `'receptionist'`.

### Error: "invalid input value for enum appointment_status: 'pending'"
**Causa:** Intentar usar `'pending'` que no existe en el enum.  
**Solución:** Usar `'scheduled'` para citas nuevas.

### Error: "column 'owner_id' does not exist"
**Causa:** La tabla `patients` usa `client_id`, no `owner_id`.  
**Solución:** Usar `client_id` en todas las queries.

### Error: "unsafe use of new value 'client' of enum type user_role"
**Causa:** Intentar usar el nuevo valor `'client'` antes de que se confirme (commit).  
**Solución:** Dividir la migración en dos partes (enum primero, luego el resto).

---

## 🔐 RLS POLICIES - RESUMEN

### Clientes pueden:
- ✅ Ver/editar su propio perfil
- ✅ Ver/editar su registro de cliente
- ✅ Ver/crear/editar/eliminar SUS mascotas
- ✅ Ver/crear SUS citas
- ✅ Editar SUS citas si `status IN ('scheduled', 'confirmed')`
- ✅ Cancelar SUS citas
- ✅ Ver SUS facturas
- ✅ Ver SUS comunicaciones

### Staff puede:
- ✅ Ver todos los perfiles
- ✅ Ver/editar todos los clientes
- ✅ Ver/editar todas las mascotas
- ✅ Ver/editar todas las citas (sin restricción de status)
- ✅ Ver/editar todas las facturas
- ✅ Ver/editar todas las comunicaciones

---

## 📝 CÓDIGO TYPESCRIPT - TIPOS

```typescript
// Tipos de roles
export type UserRole = 'admin' | 'vet' | 'assistant' | 'receptionist' | 'client';
export type StaffRole = 'admin' | 'vet' | 'assistant' | 'receptionist';

// Tipos de status de citas
export type AppointmentStatus = 
    | 'scheduled'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';

// Helper para verificar si es staff
export function isStaffRole(role: UserRole): role is StaffRole {
    return ['admin', 'vet', 'assistant', 'receptionist'].includes(role);
}
```

---

## 🚀 VALORES CORRECTOS PARA USAR

### Al crear un perfil de cliente:
```typescript
await supabase.from('profiles').insert({
    id: userId,
    role: 'client',  // ✅ Correcto
    full_name: name,
    phone: phone,
});
```

### Al crear una mascota:
```typescript
await supabase.from('patients').insert({
    client_id: clientId,  // ✅ Correcto (NO owner_id)
    name: 'Max',
    species: 'Perro',
    breed: 'Labrador',
});
```

### Al crear una cita:
```typescript
await supabase.from('appointments').insert({
    client_id: clientId,
    patient_id: petId,
    status: 'scheduled',  // ✅ Correcto (NO 'pending')
    datetime: '2026-01-10 10:00:00',
    reason: 'Consulta General',
});
```

### Al cancelar una cita:
```typescript
await supabase.from('appointments')
    .update({ status: 'cancelled' })  // ✅ Correcto
    .eq('id', appointmentId);
```

---

## ✅ CHECKLIST DE VALIDACIÓN

- [ ] Enum `user_role` tiene valor `'client'`
- [ ] Tabla `profiles` existe
- [ ] Tabla `clients` tiene columna `user_id`
- [ ] Tabla `patients` usa `client_id` (no `owner_id`)
- [ ] Políticas RLS creadas para todas las tablas
- [ ] Server actions usan `client_id` en lugar de `owner_id`
- [ ] Server actions usan `'scheduled'` en lugar de `'pending'`
- [ ] Status badges incluyen todos los valores del enum
- [ ] Funciones helper `is_staff_or_admin()` creadas

---

**Última Actualización:** 2026-01-08  
**Estado:** ✅ Completamente compatible con schema existente  
**Versión:** 3.0 (Final)
