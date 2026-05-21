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
- **CapiBot 🤖**: Asistente IA integrado en el Dashboard para resolver dudas financieras en lenguaje natural con respuestas en tiempo real.
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
| **Google Gemini API** | - | Asistente IA (CapiBot) con streaming SSE |

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

> **Admin predefinido**: `admin@capi.com` / `Admin123!` (rol `admin`)

3. **Dashboard**: Accede al panel principal en `/` donde verás:
3. **Dashboard**: Accede al panel principal en `/` donde verás:
   - Resumen financiero (balance, ingresos, gastos del mes)
   - Gráfico de distribución de gastos por categoría
   - Últimos movimientos registrados
   - Progreso de metas de ahorro
   - Estado de presupuestos
4. **Agregar movimientos**: Usa los modales del dashboard para registrar ingresos/gastos.
5. **Metas**: Crea y gestiona metas de ahorro con asignación de fondos.
6. **CapiBot**: Haz clic en el ícono flotante en la esquina inferior derecha para hablar con el asistente IA sobre tus finanzas.
7. **Perfil**: Configura tu nombre y foto de perfil desde el panel de settings.

---

## 🤖 CapiBot — Asistente IA de Finanzas

> Chatbot inteligente integrado directamente en el Dashboard para resolver dudas financieras en lenguaje natural.

### Descripción

CapiBot es un asistente conversacional impulsado por inteligencia artificial que permite a los usuarios interactuar con sus datos financieros mediante preguntas en lenguaje natural. Está accesible desde un **widget flotante** en la esquina inferior derecha del Dashboard.

**Capacidades principales:**
- Responder preguntas sobre ingresos, gastos, metas y presupuestos del usuario autenticado
- Ejecutar acciones contextuales como registrar movimientos, ajustar metas o modificar presupuestos mediante tarjetas de confirmación
- Mantener contexto de la conversación para respuestas coherentes y seguimiento
- Streaming de respuestas en tiempo real con animación de escritura

### Stack Tecnológico

| Componente | Tecnología |
|---|---|
| **Modelo de IA** | Google Gemini API (`gemini-2.5-flash-lite`) |
| **Streaming** | Server-Sent Events (SSE) — respuestas en tiempo real |
| **Frontend** | React custom hook (`useChat.ts`) + Framer Motion (animaciones) |
| **Backend** | FastAPI con SSE endpoint + tools de base de datos |
| **Herramientas (Tools)** | Consultas SQL sobre movimientos, metas, presupuestos del usuario |

### Variables de Entorno (Backend)

```env
GOOGLE_API_KEY=tu_api_key_aqui
GEMINI_API_KEY=tu_api_key_aqui
GEMINI_MODEL=gemini-2.5-flash-lite
```

### Flujo de Trabajo (Frontend ↔ Backend)

1. El usuario escribe un mensaje en el `ChatInput` del widget flotante
2. El hook `useChat` envía `POST /api/v1/chat/ask` con el mensaje y el historial de la conversación
3. El backend recibe el mensaje, lo envía a Gemini API junto con las herramientas (tools) disponibles para consultar la base de datos
4. Gemini decide si responder directamente o invocar una tool (ej. obtener gastos del mes)
5. La respuesta se transmite al frontend mediante **SSE (Server-Sent Events)** en fragmentos de texto
6. El frontend renderiza cada fragmento en el `ChatMessage` con efecto de escritura en tiempo real
7. Si la respuesta incluye una acción (ej. registrar un gasto), se muestra una `ConfirmationCard` para que el usuario confirme antes de ejecutar

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
