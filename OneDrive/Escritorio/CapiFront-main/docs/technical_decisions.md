# 🧠 Decisiones Técnicas — CapiFront

## 1. Next.js 16 con App Router

**Decisión**: Usar Next.js 16 con App Router en lugar de Pages Router o Vite.

**Justificación**:
- App Router es el estándar moderno de Next.js con mejor soporte para layouts.
- Server Components disponibles para optimización futura (actualmente todo es Client Component).
- File-based routing simplifica la estructura del proyecto.
- Optimización automática de fuentes, imágenes y bundles.
- Next.js es el framework más popular para producción con React.

---

## 2. React 19

**Decisión**: Usar React 19, la versión más reciente.

**Justificación**:
- Mejoras de rendimiento nativos con React Server Components.
- Mejor manejo de Suspense y streaming.
- API estable y compatible con las dependencias del proyecto.
- Preparado para las últimas características del ecosistema React.

---

## 3. TailwindCSS v4 con Plugin PostCSS

**Decisión**: Usar TailwindCSS v4 con `@tailwindcss/postcss` en lugar de la config tradicional.

**Justificación**:
- TailwindCSS v4 elimina la necesidad de `tailwind.config.js` (zero-config).
- Detección automática de clases en el proyecto.
- Mejor rendimiento de compilación con el nuevo engine.
- `@theme inline` permite definir variables CSS nativas integradas con Tailwind.
- PostCSS plugin es la forma recomendada para Next.js.

**Configuración**:
```mjs
// postcss.config.mjs
const config = {
  plugins: { "@tailwindcss/postcss": {} }
};
```

---

## 4. Client Components ("use client")

**Decisión**: Todas las páginas son Client Components.

**Justificación**:
- La app requiere interactividad en cada página (formularios, modales, animaciones).
- Uso extensivo de hooks de React (`useState`, `useEffect`, `useContext`).
- Framer Motion necesita acceso al DOM del cliente.
- Recharts renderiza gráficos SVG interactivos.
- Acceso a `localStorage` para gestión de tokens.

**Trade-off**: Se pierde la optimización de Server Components, pero la naturaleza SPA del dashboard lo hace necesario.

---

## 5. Framer Motion para Animaciones

**Decisión**: Usar Framer Motion en lugar de CSS transitions puras.

**Justificación**:
- API declarativa que se integra naturalmente con React.
- Animaciones de entrada (`initial`, `animate`) para componentes.
- Gestos interactivos (`whileHover`, `whileTap`) configurables.
- Spring physics para animaciones más naturales.
- Layout animations automáticas.

**Uso principal**:
- Animación de entrada de cards y formularios (`opacity`, `y`, `scale`)
- Micro-animaciones en hover de botones e iconos
- Transiciones de modales

---

## 6. Recharts para Visualización de Datos

**Decisión**: Usar Recharts para gráficos financieros.

**Justificación**:
- Librería declarativa basada en componentes React.
- Soporta PieChart, BarChart, LineChart necesarios para finanzas.
- Responsive por defecto con `ResponsiveContainer`.
- Customización completa de colores y tooltips.
- Peso razonable comparado con D3.js puro.

**Uso**: Gráfico de distribución de gastos por categoría (PieChart/DonutChart).

---

## 7. Lucide React para Iconografía

**Decisión**: Usar Lucide React en lugar de Heroicons o react-icons.

**Justificación**:
- Fork activamente mantenido de Feather Icons.
- Importación individual (tree-shakeable) para bundles más pequeños.
- Consistencia visual en todos los iconos (mismo stroke width, estilo).
- Amplia colección con iconos relevantes para finanzas.
- Props directas para tamaño y estilo (`size`, `className`).

---

## 8. Google OAuth via @react-oauth/google

**Decisión**: Usar el SDK oficial `@react-oauth/google`.

**Justificación**:
- SDK oficial mantenido por Google.
- Hook `useGoogleLogin()` para flow personalizado.
- `GoogleOAuthProvider` como wrapper simple.
- No requiere cargar el SDK de Google manualmente.
- Compatible con React 19.

**Estado actual**: El flow de Google está parcialmente implementado (el token de Google se obtiene pero no se valida contra el backend).

---

## 9. Dark Mode como Diseño Principal

**Decisión**: La app usa un tema oscuro premium como diseño principal.

**Justificación**:
- Tendencia moderna en apps financieras (Revolut, Wise, N26).
- Reduce fatiga visual para uso prolongado.
- Permite efectos visuales como glow y glassmorphism.
- Mejor contraste para datos numéricos y gráficos.
- El sistema de colores usa CSS custom properties para futura extensibilidad.

---

## 10. Dashboard Monolítico

**Decisión**: El dashboard es un solo archivo `page.tsx` de ~1700 líneas.

**Justificación**:
- Decisión pragmática para la v0.1 del producto.
- Toda la lógica está contenida y fácil de seguir.

**Deuda técnica reconocida**:
- Debe refactorizarse en componentes separados: `Sidebar`, `SummaryCards`, `PieChart`, `MovementsList`, `GoalsSection`, `BudgetsSection`, `Modal`.
- Los formularios deberían extraerse en custom hooks.
- La comunicación con la API debería centralizarse en un servicio/hook.

---

## 11. Autenticación con localStorage

**Decisión**: Almacenar el JWT en `localStorage`.

**Justificación**:
- Simplicidad para la versión actual.
- Persiste entre recargas y tabs del navegador.
- Fácil de implementar con React Context.

**Riesgos y mejoras futuras**:
- `localStorage` es vulnerable a XSS. En producción, considerar:
  - `httpOnly` cookies con refresh tokens.
  - Short-lived access tokens con refresh silencioso.
- El objeto `user` debería obtenerse del backend, no ser un placeholder.
