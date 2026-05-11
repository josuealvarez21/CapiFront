# 🧩 Componentes y Páginas — CapiFront

## Estructura de Páginas

```mermaid
graph LR
    subgraph Routes["Rutas de la App"]
        R1["/ → Dashboard"]
        R2["/login → Login"]
        R3["/register → Registro"]
        R4["/forgot-password → Recuperación"]
    end
    
    subgraph Shared["Compartidos"]
        S1["AuthContext"]
        S2["layout.tsx"]
    end
    
    S2 --> R1
    S2 --> R2
    S2 --> R3
    S2 --> R4
    S1 -.->|useAuth()| R1
    S1 -.->|useAuth()| R2
```

---

## 📄 layout.tsx — Root Layout

**Ruta**: `app/layout.tsx`
**Tipo**: Server Component (wrapper)

### Responsabilidades
- Definir el HTML base (`<html>`, `<body>`)
- Cargar fuentes de Google (Geist Sans y Mono)
- Envolver la app con `GoogleOAuthProvider` y `AuthProvider`
- Definir metadata SEO

### Props
- `children`: React.ReactNode — Las páginas renderizadas

### Dependencias
- `next/font/google` (Geist, Geist_Mono)
- `@react-oauth/google` (GoogleOAuthProvider)
- `context/AuthContext` (AuthProvider)

---

## 📄 page.tsx — Dashboard Principal

**Ruta**: `app/page.tsx` → URL: `/`
**Tipo**: Client Component (`"use client"`)
**Tamaño**: ~1700 líneas (componente monolítico)

### Responsabilidades
Este es el componente principal de la aplicación y maneja:

1. **Carga de datos**: Fetch al endpoint `/dashboard/` con el token JWT
2. **Resumen financiero**: Balance total, ingresos y gastos del mes
3. **Gráfico de gastos**: Distribución por categoría (Recharts PieChart)
4. **Movimientos**: Listado, creación (modal) y eliminación
5. **Metas de ahorro**: Visualización, creación, asignación de fondos y eliminación
6. **Presupuestos**: Barras de progreso, creación y eliminación
7. **Configuración de perfil**: Cambio de nombre y foto de perfil
8. **Navegación lateral**: Sidebar con secciones

### Estado Interno (useState)

| Variable | Tipo | Descripción |
|---|---|---|
| `dashboardData` | object | Datos del dashboard desde la API |
| `isLoading` | boolean | Flag de carga inicial |
| `activeSection` | string | Sección activa del sidebar |
| `showAddMovement` | boolean | Modal de agregar movimiento |
| `showAddGoal` | boolean | Modal de agregar meta |
| `showAddBudget` | boolean | Modal de agregar presupuesto |
| `showSettings` | boolean | Panel de configuración |
| `categories` | array | Categorías desde la API |
| `newMovement` | object | Datos del formulario de movimiento |
| `newGoal` | object | Datos del formulario de meta |
| `newBudget` | object | Datos del formulario de presupuesto |
| `settingsName` | string | Nombre editado del usuario |
| `settingsPhotoUrl` | string | URL de foto de perfil |

### Secciones del Dashboard

| Sección | Descripción |
|---|---|
| `dashboard` | Vista principal con resumen y gráficos |
| `movimientos` | Lista completa de movimientos con CRUD |
| `metas` | Metas de ahorro con barras de progreso |
| `presupuestos` | Presupuestos con indicadores visuales |
| `settings` | Configuración del perfil de usuario |

### Funciones Clave

- `fetchDashboardData()`: Carga todos los datos del dashboard
- `handleAddMovement()`: Crea un movimiento y recarga datos
- `handleDeleteMovement(id)`: Elimina un movimiento
- `handleAddGoal()`: Crea una meta de ahorro
- `handleDeleteGoal(id)`: Elimina una meta
- `handleAllocateToGoals()`: Asignación masiva de fondos a metas
- `handleAddBudget()`: Crea un presupuesto
- `handleDeleteBudget(id)`: Elimina un presupuesto
- `handleUpdateProfile()`: Actualiza nombre/foto del usuario

### UI Components (inline)

El dashboard contiene varios sub-componentes renderizados inline:
- **Sidebar**: Navegación lateral con iconos Lucide
- **SummaryCards**: 3 cards con balance, ingresos y gastos
- **PieChart**: Gráfico de distribución (Recharts)
- **MovementsList**: Lista de últimos movimientos
- **GoalsSection**: Cards de metas con progress bars
- **BudgetsSection**: Cards de presupuestos con barras de progreso
- **Modals**: Formularios flotantes para CRUD

> **Nota**: Este componente se beneficiaría de una refactorización para extraer sub-componentes en archivos separados.

---

## 📄 login/page.tsx — Página de Login

**Ruta**: `app/login/page.tsx` → URL: `/login`
**Tipo**: Client Component (`"use client"`)

### Responsabilidades
- Formulario de login con email y password
- Botón de login con Google OAuth2
- Link a registro y recuperación de contraseña
- Animaciones de entrada con Framer Motion

### Estado
| Variable | Tipo | Descripción |
|---|---|---|
| `email` | string | Email del usuario |
| `password` | string | Contraseña |
| `isLoading` | boolean | Estado de carga del submit |

### Flujo
1. Usuario llena email y password
2. Submit envía POST a `/auth/login` (form-urlencoded)
3. Si OK → `login(token)` del AuthContext → redirect a `/`
4. Si error → muestra alerta con detalle

### Design
- Card centrada con glassmorphism y glow effects
- Gradiente azul → verde en el ícono
- Ícono: `Fingerprint` de Lucide

---

## 📄 register/page.tsx — Página de Registro

**Ruta**: `app/register/page.tsx` → URL: `/register`
**Tipo**: Client Component (`"use client"`)

### Responsabilidades
- Formulario de registro con nombre, email y password
- Validación de campos requeridos
- Redirect a login tras registro exitoso

### Estado
| Variable | Tipo | Descripción |
|---|---|---|
| `nombre` | string | Nombre completo |
| `email` | string | Email |
| `password` | string | Contraseña |
| `isLoading` | boolean | Estado de carga |

### Flujo
1. Usuario llena nombre, email y password
2. Submit envía POST a `/auth/signup` (JSON)
3. Si OK → alerta de éxito → redirect a `/login`
4. Si error → muestra detalle del error

### Design
- Gradiente verde en el ícono
- Ícono: `ShieldCheck` de Lucide
- Glow effect verde

---

## 📄 forgot-password/page.tsx — Recuperación de Contraseña

**Ruta**: `app/forgot-password/page.tsx` → URL: `/forgot-password`
**Tipo**: Client Component (`"use client"`)

### Responsabilidades
- Formulario de un solo campo (email)
- Mostrar confirmación tras envío exitoso
- Link de regreso al login

### Estado
| Variable | Tipo | Descripción |
|---|---|---|
| `email` | string | Email registrado |
| `isSent` | boolean | Si el email fue enviado |
| `isLoading` | boolean | Estado de carga |

### Flujo
1. Usuario ingresa su email
2. Submit envía POST a `/auth/forgot-password?email=...`
3. Si OK → muestra mensaje de confirmación
4. Si error → alerta "correo no encontrado"

### Design
- Gradiente púrpura en el ícono
- Ícono: `Key` de Lucide
- Vista condicional: formulario vs. confirmación

---

## 🔐 context/AuthContext.tsx — Proveedor de Autenticación

**Ruta**: `context/AuthContext.tsx`
**Tipo**: Client Component (`"use client"`)

### Responsabilidades
- Almacenar y gestionar el estado de autenticación global
- Persistir el token JWT en `localStorage`
- Proveer funciones `login()` y `logout()` a toda la app
- Verificar autenticación existente al montar la app

### API Expuesta (via useAuth hook)

```typescript
interface AuthContextType {
  user: any;           // Objeto usuario (placeholder)
  token: string | null; // JWT token
  login: (token: string) => void;  // Guarda token + redirect
  logout: () => void;              // Limpia token + redirect
  loading: boolean;    // Flag de inicialización
}
```

### Comportamiento
- **Mount**: Revisa `localStorage` por token existente → restaura sesión
- **login()**: Guarda en localStorage → actualiza estado → redirect a `/` (con 10ms delay)
- **logout()**: Limpia localStorage → resetea estado → redirect a `/login`
- **loading**: `true` durante la verificación inicial para evitar flash de contenido

### Nota de Mejora
El `user` actualmente es un placeholder hardcodeado. En una mejora futura debería decodificar el JWT o hacer un fetch al backend para obtener datos reales del usuario.
