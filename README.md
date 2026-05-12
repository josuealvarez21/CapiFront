# 🐹 CapiFront — Interfaz de Finanzas Personales

> Frontend del ecosistema **Cápi**, una plataforma de gestión de finanzas personales. Construido con Next.js 16, React 19 y TailwindCSS v4.

---

## 📋 Descripción

CapiFront es la interfaz de usuario de la aplicación Cápi. Ofrece:

- **Dashboard interactivo**: Resumen financiero con gráficos de distribución de gastos, últimos movimientos, metas de ahorro y presupuestos.
- **Gestión de movimientos**: Registro de ingresos y gastos con categorización y fechas.
- **Metas de ahorro**: Visualización de progreso, asignación de fondos y seguimiento de objetivos.
- **Presupuestos**: Control visual de límites de gasto por categoría.
- **Autenticación completa**: Login con email/password, registro, recuperación de contraseña y Google OAuth2.
- **Perfil de usuario**: Configuración de nombre y foto de perfil.
- **Diseño premium**: Dark mode, glassmorphism, gradientes, micro-animaciones con Framer Motion.
- **Mobile First**: Interfaz totalmente responsive, con `BottomNav` para navegación móvil y layouts adaptables que escalan perfectamente en tablets y desktop.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** | 16.2.2 | Framework React con App Router |
| **React** | 19.2.4 | Librería de UI |
| **TypeScript** | 5.x | Tipado estático |
| **TailwindCSS** | 4.x | Framework de utilidades CSS |
| **Framer Motion** | 12.x | Animaciones declarativas |
| **Recharts** | 3.x | Gráficos y visualizaciones |
| **Lucide React** | 1.7+ | Iconografía |
| **@react-oauth/google** | 0.13+ | Integración Google OAuth2 |

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- [CapiBackend](https://github.com/josuealvarez21/CapiBackend) corriendo en `localhost:8000`

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/josuealvarez21/CapiFront.git
   cd CapiFront
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   copy .env.example .env.local
   # Edita .env.local con la URL del backend y tu Google Client ID
   ```

   > **Nota**: Next.js usa `.env.local` para variables de entorno locales. El Google Client ID debe ser un Web OAuth 2.0 Client registrado en [Google Cloud Console](https://console.cloud.google.com/apis/credentials) con `http://localhost:3000` como **Origen JavaScript autorizado**.

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Verificar**
   - Aplicación: [http://localhost:3000](http://localhost:3000)
   - Asegúrate de que el backend esté corriendo en [http://localhost:8000](http://localhost:8000)

---

## 📖 Uso

### Flujo Principal

1. **Registro**: Navega a `/register` para crear una cuenta.
2. **Login**: Inicia sesión en `/login` con email/password o Google.
3. **Dashboard**: Accede al panel principal en `/` donde verás:
   - Resumen financiero (balance, ingresos, gastos del mes)
   - Gráfico de distribución de gastos por categoría
   - Últimos movimientos registrados
   - Progreso de metas de ahorro
   - Estado de presupuestos
4. **Agregar movimientos**: Usa los modales del dashboard para registrar ingresos/gastos.
5. **Metas**: Crea y gestiona metas de ahorro con asignación de fondos.
6. **Perfil**: Configura tu nombre y foto de perfil desde el panel de settings.

### Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Verificación de ESLint |

---

## 📁 Estructura del Proyecto

```text
CapiFront/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Dashboard principal (modular)
│   ├── layout.tsx        # Layout base y configuración (Auth, Google OAuth)
│   └── (auth)/           # Rutas de autenticación (login, register, forgot-password)
├── components/           # Componentes UI reutilizables
│   ├── Sidebar.tsx
│   ├── SummaryCards.tsx
│   ├── MovementsList.tsx
│   ├── SavingsPlanner.tsx
│   ├── charts/           # Gráficos (Recharts)
│   └── modals/           # Componentes modales reutilizables
├── context/              # Contextos globales de React (AuthContext)
├── hooks/                # Custom hooks (useDashboard)
├── lib/                  # Utilidades y servicios
│   ├── api.ts            # Cliente HTTP centralizado
│   ├── savings.ts        # Lógica de distribución de ahorros
│   ├── types.ts          # Interfaces TypeScript
│   └── utils.tsx         # Utilidades y helpers
├── docs/                 # Documentación técnica
├── public/               # Assets estáticos
├── eslint.config.mjs     # Configuración ESLint
├── next.config.ts        # Configuración Next.js
├── package.json          # Dependencias y scripts
└── tsconfig.json         # Configuración TypeScript
```

---

## 📚 Documentación

- [Arquitectura del Sistema](docs/architecture.md)
- [Componentes y Páginas](docs/components.md)
- [Decisiones Técnicas](docs/technical_decisions.md)

---

## 🔗 Proyecto Relacionado

- **Backend**: [CapiBackend](https://github.com/josuealvarez21/CapiBackend) — API REST con FastAPI + MySQL

---

## 🤝 Contribución

1. Fork el repositorio
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de uso privado / educativo.

---

> **Cápi** — Controla tu destino financiero 🐹💰
