---
name: MVP Gestor Inventario Kioscos
overview: Plan completo para desarrollar el MVP del Gestor de Inventario Inteligente para drugstores/kioscos argentinos, cubriendo las 5 páginas principales (Dashboard, Productos, Ventas, Proveedores, Empleados) con Server Actions, PPR, autenticación basada en roles y métricas de márgenes de ganancia reales.
todos:
  - id: fase-0-middleware
    content: "Fase 0.1: Crear middleware.ts con proteccion de rutas y roles (mover logica de proxy.ts)"
    status: pending
  - id: fase-0-types
    content: "Fase 0.2: Crear carpeta types/ con tipos TypeScript por dominio (producto, venta, proveedor, empleado, dashboard)"
    status: pending
  - id: fase-0-auth-helper
    content: "Fase 0.3: Crear lib/auth.ts con helpers getUsuarioActual() y verificarDueno()"
    status: pending
  - id: fase-0-cleanup
    content: "Fase 0.4: Unificar carpetas duplicadas shared/SideBar y shared/Sidebar"
    status: pending
  - id: fase-2-actions
    content: "Fase 2: Crear actions/productos.ts con CRUD completo + validacion Zod"
    status: pending
  - id: fase-2-ui
    content: "Fase 2: Construir UI de productos (tabla, formulario dialog, filtros, columna de margen %)"
    status: pending
  - id: fase-3-actions
    content: "Fase 3: Crear actions/ventas.ts con busqueda rapida y registro atomico de ventas"
    status: pending
  - id: fase-3-ui
    content: "Fase 3: Construir UI de ventas (buscador rapido, carrito, confirmacion, historial)"
    status: pending
  - id: fase-1-actions
    content: "Fase 1: Crear actions/dashboard.ts con queries de metricas reales"
    status: pending
  - id: fase-1-ui
    content: "Fase 1: Construir Dashboard con PPR (Suspense + async components + skeletons + grafico recharts)"
    status: pending
  - id: fase-4-actions
    content: "Fase 4: Crear actions/proveedores.ts con CRUD + gestion de visitas"
    status: pending
  - id: fase-4-ui
    content: "Fase 4: Construir UI de proveedores (tabla, formulario, agenda de visitas)"
    status: pending
  - id: fase-5-actions
    content: "Fase 5: Crear actions/empleados.ts con CRUD completo"
    status: pending
  - id: fase-5-ui
    content: "Fase 5: Construir UI de empleados (tabla, formulario dialog, filtro por turno)"
    status: pending
isProject: false
---

# Plan MVP - Gestor de Inventario Inteligente para Drugstores/Kioscos

## Estado Actual del Proyecto

Ya tienes una base sólida:

- **Esquema Prisma completo** con los modelos: `Perfil`, `Categoria`, `Producto`, `Proveedor`, `VisitaProveedor`, `Venta`, `ItemVenta`, `Empleado` ([prisma/schema.prisma](prisma/schema.prisma))
- **Rutas creadas** (vacías): `/dashboard`, `/productos`, `/ventas`, `/proveedores`, `/empleados`
- **Auth básica**: login/logout con Supabase ([actions/auth.ts](actions/auth.ts))
- **Sidebar y layout**: navegación funcional ([shared/SideBar/SideBar.tsx](shared/SideBar/SideBar.tsx))
- **19 componentes shadcn/ui** ya instalados
- `**cacheComponents: true` habilitado en [next.config.ts](next.config.ts)

---

## Decisiones Técnicas Clave

### 1. Types de TypeScript (no Interfaces)

Usaremos `type` en todo el proyecto. Se creará una carpeta `types/` con tipos organizados por dominio.

### 2. Server Actions (no API Routes/Endpoints)

**Server Actions son la mejor opción para este proyecto** por estas razones:

- Se integran directamente con formularios de React 19 (hook `useActionState`)
- Son type-safe de punta a punta
- Reducen código boilerplate vs endpoints REST
- Perfectas para operaciones CRUD
- Funcionan con revalidación de cache de Next.js (`revalidatePath`)

Estructura de acciones:

```
actions/
├── auth.ts          (ya existe)
├── productos.ts     (CRUD productos + categorías)
├── ventas.ts        (registrar venta, listar ventas)
├── proveedores.ts   (CRUD proveedores + visitas)
├── empleados.ts     (CRUD empleados)
└── dashboard.ts     (queries para métricas)
```

### 3. PPR (Partial Pre-Rendering) y Cache Components

Next.js 16 con `cacheComponents: true` permite que partes estáticas de la página se pre-rendericen, mientras que los datos dinámicos se cargan con streaming via `<Suspense>`. Aplicaremos esto así:

```
Dashboard (ejemplo PPR):
┌─────────────────────────────────────────────┐
│  SHELL ESTÁTICO (pre-renderizado)           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Skeleton  │ │ Skeleton │ │ Skeleton │    │
│  │ Card      │ │ Card     │ │ Card     │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │        Skeleton Chart               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  DATOS DINÁMICOS (streaming con Suspense)   │
│  Card: $125.430 ingresos hoy               │
│  Card: 342 productos / 18 bajo stock       │
│  Chart: ventas por hora del día             │
└─────────────────────────────────────────────┘
```

Cada card/sección será un **componente async** envuelto en `<Suspense fallback={<Skeleton />}>`.

---

## Arquitectura de Carpetas Final

```
nextstore/
├── actions/
│   ├── auth.ts
│   ├── dashboard.ts
│   ├── productos.ts
│   ├── ventas.ts
│   ├── proveedores.ts
│   └── empleados.ts
├── types/
│   ├── producto.ts
│   ├── venta.ts
│   ├── proveedor.ts
│   ├── empleado.ts
│   └── dashboard.ts
├── app/(router)/(principal)/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── CardIngresos/
│   │       ├── CardProductos/
│   │       ├── CardBajoStock/
│   │       ├── CardGanancias/
│   │       └── ChartVentasDia/
│   ├── productos/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── TablaProductos/
│   │       ├── FormProducto/
│   │       └── DialogProducto/
│   ├── ventas/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── BuscadorProducto/
│   │       ├── CarritoVenta/
│   │       └── HistorialVentas/
│   ├── proveedores/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── TablaProveedores/
│   │       ├── FormProveedor/
│   │       ├── CalendarioVisitas/
│   │       └── DialogProveedor/
│   └── empleados/
│       ├── page.tsx
│       └── components/
│           ├── TablaEmpleados/
│           ├── FormEmpleado/
│           └── DialogEmpleado/
├── middleware.ts          (NUEVO - protección de rutas + roles)
└── ...
```

---

## Fase 0: Infraestructura Base

### 0.1 Crear `middleware.ts` (Protección de rutas y roles)

Actualmente tienes `proxy.ts` y `lib/supabase/proxy.ts` pero **no hay `middleware.ts`** en la raíz. Next.js necesita ese archivo exacto para ejecutar middleware. Se debe:

- Renombrar/mover la lógica de [proxy.ts](proxy.ts) a `middleware.ts`
- Agregar protección por rol: las rutas `/dashboard` y `/productos` solo accesibles para `DUENO`
- Las rutas `/ventas` accesibles para `DUENO` y `EMPLEADO`

### 0.2 Crear carpeta `types/` con tipos base

Tipos derivados del schema Prisma para uso en el frontend, usando `type` de TypeScript.

### 0.3 Arreglar duplicación de carpeta Sidebar

Existen dos carpetas: `shared/SideBar/` y `shared/Sidebar/`. Unificar en una sola.

---

## Fase 1: Dashboard (Solo DUEÑO)

Página: [app/(router)/(principal)/dashboard/page.tsx](app/(router)/(principal)/dashboard/page.tsx)

### Métricas reales del negocio (cards):

1. **Ingresos del día** - Suma de `venta.total` del día actual
2. **Ganancia real del día** - Suma de `venta.ganancia` (esto es el corazón: margen real)
3. **Total de productos** - Count de productos activos
4. **Productos con bajo stock** - Productos donde `stock <= stockMinimo`

### Gráfico de ventas del día:

- Gráfico de barras/área con `recharts` (ya instalado) mostrando ventas por hora del día actual
- Eje X: horas del día (8:00 - 22:00)
- Eje Y: monto vendido por hora

### Implementación PPR:

```tsx
// dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Suspense fallback={<CardSkeleton />}>
        <CardIngresos /> {/* async server component */}
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <CardGanancias /> {/* async server component */}
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <CardProductos /> {/* async server component */}
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <CardBajoStock /> {/* async server component */}
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <ChartVentasDia /> {/* async server component */}
      </Suspense>
    </div>
  );
}
```

### Server Action: `actions/dashboard.ts`

- `getIngresosHoy()` - Query con Prisma: ventas del día, suma de `total`
- `getGananciaHoy()` - Suma de `ganancia` del día
- `getProductosStats()` - Count total y count bajo stock
- `getVentasPorHora()` - Agrupación por hora para el gráfico

---

## Fase 2: Productos (Solo DUEÑO)

Página: [app/(router)/(principal)/productos/page.tsx](app/(router)/(principal)/productos/page.tsx)

### Funcionalidades:

- **Tabla** con todos los productos (nombre, categoría, precio costo, precio venta, margen %, stock, proveedor)
- **Crear producto** via dialog/modal con formulario
- **Editar producto** inline o via dialog
- **Eliminar producto** con confirmación
- **Filtros**: por categoría, por proveedor, por estado de stock
- **Columna de margen**: calcula `((precioVenta - precioCosto) / precioCosto) * 100` para mostrar el % de ganancia real

### Server Actions: `actions/productos.ts`

- `getProductos(filtros)` - Listar con paginación y filtros
- `crearProducto(data)` - Crear con validación Zod
- `actualizarProducto(id, data)` - Actualizar
- `eliminarProducto(id)` - Soft delete (activo = false)
- `getCategorias()` - Para el select del formulario
- `crearCategoria(nombre)` - Crear categoría nueva

### Validación con Zod:

Cada action valida los datos del formulario con schemas Zod antes de tocar la base de datos.

---

## Fase 3: Ventas (DUEÑO + EMPLEADOS)

Página: [app/(router)/(principal)/ventas/page.tsx](app/(router)/(principal)/ventas/page.tsx)

### Diseño orientado a velocidad:

Esta es la página más crítica en UX. El empleado debe poder registrar una venta en segundos.

```
┌─────────────────────────────────────────────────┐
│  BUSCADOR RÁPIDO DE PRODUCTOS                   │
│  [🔍 Buscar por nombre o código de barras...]    │
│                                                  │
│  Resultados instantáneos (debounce 300ms):       │
│  ┌──────────────────────────────────────────┐    │
│  │ Coca Cola 500ml    $1.200    [+ Agregar] │    │
│  │ Coca Cola 1.5L     $2.100    [+ Agregar] │    │
│  └──────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│  CARRITO DE VENTA ACTUAL                         │
│  ┌──────────────────────────────────────────┐    │
│  │ Coca Cola 500ml  x2  $2.400    [x]       │    │
│  │ Pan lactal        x1  $1.800    [x]       │    │
│  ├──────────────────────────────────────────┤    │
│  │ TOTAL:                          $4.200    │    │
│  └──────────────────────────────────────────┘    │
│  [CONFIRMAR VENTA]                               │
└─────────────────────────────────────────────────┘
```

### Flujo:

1. Empleado busca producto (texto o código de barras)
2. Click en "Agregar" suma al carrito (cantidad editable)
3. Click en "Confirmar Venta" ejecuta server action que:

- Crea el registro `Venta` con `total`, `costoTotal` y `ganancia` calculados
- Crea los `ItemVenta` asociados
- Descuenta stock de cada producto
- Usa transacción Prisma para atomicidad

1. Toast de confirmación y carrito se limpia

### Server Actions: `actions/ventas.ts`

- `buscarProductos(query)` - Búsqueda por nombre o código de barras
- `registrarVenta(items)` - Transacción atómica (crea venta + descuenta stock)
- `getHistorialVentas(fecha)` - Historial del día

---

## Fase 4: Proveedores (Solo DUEÑO)

Página: [app/(router)/(principal)/proveedores/page.tsx](app/(router)/(principal)/proveedores/page.tsx)

### Funcionalidades:

- **Tabla de proveedores** con info de contacto
- **CRUD completo** (crear, editar, eliminar proveedores)
- **Agenda de visitas**: calendario/lista de próximas visitas programadas
- **Estados de visita**: PENDIENTE, COMPLETADA, CANCELADA

### Server Actions: `actions/proveedores.ts`

- `getProveedores()` - Listar todos
- `crearProveedor(data)` - Con validación Zod
- `actualizarProveedor(id, data)` - Actualizar
- `eliminarProveedor(id)` - Eliminar (cascade a visitas)
- `getVisitas(filtros)` - Próximas visitas
- `agendarVisita(data)` - Crear visita
- `actualizarEstadoVisita(id, estado)` - Cambiar estado

---

## Fase 5: Empleados (Solo DUEÑO)

Página: [app/(router)/(principal)/empleados/page.tsx](app/(router)/(principal)/empleados/page.tsx)

### Funcionalidades:

- **Tabla de empleados** con nombre, DNI, teléfono, turno, estado
- **CRUD completo**
- **Filtro por turno**: MANANA, TARDE, NOCHE
- **Toggle activo/inactivo**

### Server Actions: `actions/empleados.ts`

- `getEmpleados(filtros)` - Listar con filtro por turno
- `crearEmpleado(data)` - Con validación Zod
- `actualizarEmpleado(id, data)` - Actualizar
- `eliminarEmpleado(id)` - Soft delete (activo = false)

---

## Control de Acceso por Rol

Se implementará un helper reutilizable:

```tsx
// lib/auth.ts
export async function getUsuarioActual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const perfil = await prisma.perfil.findUnique({
    where: { authId: user.id },
  });
  return perfil;
}

export async function verificarDueno() {
  const perfil = await getUsuarioActual();
  if (perfil?.rol !== "DUENO") redirect("/ventas");
  return perfil;
}
```

- Cada server action de Dashboard, Productos, Proveedores, Empleados llamará `verificarDueno()`
- Las actions de Ventas llamarán `getUsuarioActual()` (permite ambos roles)

---

## Orden de Implementación Sugerido

El orden está pensado para que cada fase se construya sobre la anterior y puedas probar incrementalmente:

1. **Fase 0** - Middleware + types + limpieza
2. **Fase 2** - Productos (necesitas datos para que todo lo demás funcione)
3. **Fase 3** - Ventas (el flujo core del negocio)
4. **Fase 1** - Dashboard (necesita ventas y productos cargados para mostrar métricas)
5. **Fase 4** - Proveedores
6. **Fase 5** - Empleados

