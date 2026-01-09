# CMS Landing Editor - Fix Report

## PROBLEMA IDENTIFICADO
El módulo "Gestión de Contenido Web" retornaba 500 (Internal Server Error) al intentar guardar cualquier sección.

## CAUSAS RAÍZ ENCONTRADAS

### 1. Falta de columna `created_at` en `landing_sections`
**Archivo afectado:** `supabase/migrations/20260108190000_create_landing_cms.sql`
**Línea:** 12-19
**Problema:** La tabla `landing_sections` no tenía la columna `created_at`, pero el código en `actions.ts` intentaba ordenar por `created_at` (línea 66).
**Síntoma:** Error SQL al ejecutar la query de ordenamiento.

### 2. Manejo de errores insuficiente
**Archivo afectado:** `app/dashboard/admin/landing/actions.ts`
**Problema:** 
- No había logging detallado para identificar el punto exacto de fallo
- Los errores se propagaban sin contexto útil
- El cliente no recibía mensajes de error específicos

### 3. Falta de validación de datos
**Problema:** No había validación de que `pageId` y `key` fueran válidos antes de intentar guardar.

## SOLUCIONES IMPLEMENTADAS

### 1. Migración para agregar `created_at`
**Archivo:** `supabase/migrations/20260108194000_add_created_at_to_sections.sql`
```sql
ALTER TABLE landing_sections 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```
- Agrega la columna si no existe
- Backfill de datos existentes usando `updated_at`

### 2. Logging robusto en Server Actions
**Archivo:** `app/dashboard/admin/landing/actions.ts`
**Cambios:**
- Agregado logging en cada paso del proceso (fetch, update, insert, delete)
- Try/catch con mensajes de error específicos
- Logs con prefijo `[saveSection]` para facilitar debugging

### 3. Mejora en manejo de errores del cliente
**Archivo:** `app/dashboard/admin/landing/components/cms-editor.tsx`
**Cambios:**
- Captura y muestra el mensaje de error específico
- Logging en consola del navegador para debugging
- Toast con mensaje detallado del error

### 4. Test de Playwright
**Archivo:** `tests/cms-save.spec.ts`
**Propósito:** Verificar que el guardado funciona end-to-end

## VERIFICACIÓN

### Pasos para confirmar el fix:

1. **Aplicar migraciones:**
```bash
# Las migraciones se aplicarán automáticamente en el próximo deploy
# O manualmente con:
npx supabase db push
```

2. **Verificar en UI:**
- Ir a `/dashboard/admin/landing`
- Editar cualquier sección (Footer, Hero, Branding, etc.)
- Click en "Guardar [Sección]"
- Debe aparecer toast verde: "Sección [nombre] guardada exitosamente"
- Recargar página
- Verificar que los cambios persisten

3. **Verificar en Supabase:**
```sql
SELECT * FROM landing_sections ORDER BY updated_at DESC LIMIT 5;
```
Debe mostrar las filas actualizadas con el contenido correcto.

4. **Verificar logs del servidor:**
En el terminal de `npm run dev`, buscar:
```
[saveSection] Called for key=footer, pageId=...
[saveSection] Updating section ...
```

5. **Ejecutar tests:**
```bash
npx playwright test tests/cms-save.spec.ts
```

## ESTRUCTURA DE DATOS

### Tabla `landing_sections`
```
id: UUID (PK)
page_id: UUID (FK -> landing_pages)
key: TEXT (hero, footer, branding, etc.)
content: JSONB
order: INTEGER
updated_at: TIMESTAMP
created_at: TIMESTAMP (NUEVO)
```

### Constraint único
```sql
UNIQUE (page_id, key)
```
Previene duplicados y permite upsert confiable.

## POLÍTICAS RLS CONFIRMADAS

- **Público:** SELECT en secciones de páginas publicadas
- **Autenticados:** Full access (INSERT, UPDATE, DELETE)

## PRÓXIMOS PASOS RECOMENDADOS

1. ✅ Aplicar migración `20260108194000_add_created_at_to_sections.sql`
2. ✅ Aplicar migración `20260108193000_fix_landing_duplicates.sql` (constraint único)
3. ⏳ Ejecutar test de Playwright para confirmar
4. ⏳ Verificar que "Publicar" también funciona correctamente
5. ⏳ Agregar validación con Zod en el futuro para mayor robustez

## ESTADO ACTUAL
- ✅ Logging agregado
- ✅ Manejo de errores mejorado
- ✅ Migración creada
- ⏳ Pendiente: Aplicar migraciones en Supabase
- ⏳ Pendiente: Ejecutar tests
