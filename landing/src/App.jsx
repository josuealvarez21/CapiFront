import { useEffect, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  ShieldCheck,
  MessageSquareText,
  Mic,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  ChartPie,
} from 'lucide-react';
import dashboardImg from './assets/dashboard.png';

/* La landing se basa en el comportamiento real del producto:
   - Registro de ingresos/gastos por categoría
   - Metas de ahorro con proyección
   - Presupuestos mensuales con límite ("Límite Escudo")
   - CapiBot: asistente IA por chat que registra, categoriza y proyecta
     con confirmación, y responde por voz (texto a voz + transcripción)
   - Acceso libre y completo, sin planes de pago por ahora
   Sin métricas inventadas (usuarios, dinero, rating). */

const NAV_LINKS = [
  { href: '#producto', label: 'Producto' },
  { href: '#ia', label: 'Asistente IA' },
  { href: '#control', label: 'Control' },
  { href: '#seguridad', label: 'Seguridad' },
];

/* Revelado sutil al entrar en viewport: un único momento de movimiento. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.transition = 'opacity .6s ease-out, transform .6s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-ca-line bg-ca-canvas/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-ca flex h-16 items-center justify-between" aria-label="Principal">
        <a href="#inicio" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ca-balance text-black">
            <Wallet size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">Cápi</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ca-muted transition-colors hover:text-ca-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#cta"
            className="text-sm font-semibold text-ca-text transition-colors hover:text-ca-balance"
          >
            Iniciar sesión
          </a>
          <a href="#cta" className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            Empieza gratis
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="rounded-lg p-2 text-ca-text md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ca-line bg-ca-canvas px-5 pb-6 pt-3 md:hidden">
          <ul className="mb-5 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ca-text hover:bg-white/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <a href="#cta" onClick={() => setOpen(false)} className="btn-ghost w-full">
              Iniciar sesión
            </a>
            <a href="#cta" onClick={() => setOpen(false)} className="btn-primary w-full">
              Empieza gratis
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Rejilla tenue de fondo: "planilla de control financiero" */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 75%)',
        }}
      />

      <div className="container-ca relative grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="eyebrow">
            <Sparkles size={14} className="text-ca-balance" />
            Finanzas personales, en una sola conversación
          </p>

          <h1 className="heading text-[2.6rem] sm:text-6xl md:text-[4.2rem]">
            Tu dinero, claro.
            <br />
            <span className="text-ca-balance">Controlado por IA.</span>
          </h1>

          <p className="lead mt-6 max-w-xl">
            Cápi reúne ingresos, gastos, metas de ahorro y presupuestos en un solo panel.
            Registra cada movimiento y déjale la proyección a tu asistente, que entiende cómo
            hablas.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#cta" className="btn-primary">
              Empieza gratis <ArrowRight size={17} />
            </a>
            <a href="#producto" className="btn-ghost">
              Ver cómo funciona
            </a>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-ca-muted">
            <ShieldCheck size={16} className="text-ca-balance" />
            Acceso completo y gratuito. Sin tarjetas, sin planes ocultos.
          </p>
        </div>

        <div className="relative">
          <div className="reveal relative">
            <div
              aria-hidden
              className="absolute -inset-x-6 -top-10 bottom-0 -z-10 rounded-[3rem]"
              style={{
                background:
                  'radial-gradient(60% 60% at 50% 40%, rgba(34,197,94,0.16), transparent 70%)',
              }}
            />
            <div className="overflow-hidden rounded-3xl border border-ca-line bg-ca-surface shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-ca-line px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-ca-red/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-ca-amber/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-ca-balance/70" />
                <span className="ml-3 text-xs text-ca-muted">Panel de Cápi</span>
              </div>
              <img
                src={dashboardImg}
                alt="Vista previa del panel de control de Cápi con el balance, los movimientos y los gráficos de ingresos y gastos."
                className="block w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, accent = 'text-ca-balance', children }) {
  const FeatureIcon = icon;
  return (
    <div className="rounded-2xl border border-ca-line bg-ca-surface p-6">
      <FeatureIcon size={22} className={`${accent} mb-4`} />
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ca-muted">{children}</p>
    </div>
  );
}

function Producto() {
  return (
    <section id="producto" className="py-20 md:py-28">
      <div className="container-ca">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Producto</p>
          <h2 className="heading text-4xl sm:text-5xl">
            Todo lo que necesitas para decidir, no para calcular.
          </h2>
          <p className="lead mt-5">
            Cápi carga tu flujo de caja y lo traduce en una vista accionable: cuánto entra, cuánto
            sale y hacia dónde va tu próximo peso.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="reveal">
            <Feature icon={TrendingUp} title="Ingresos y gastos" accent="text-ca-blue">
              Registra cada movimiento con su categoría. El panel separa lo que ganas de lo que se
              va al instante.
            </Feature>
          </div>
          <div className="reveal">
            <Feature icon={ChartPie} title="Vista de impacto" accent="text-ca-violet">
              La distribución por categoría te muestra dónde se concentra tu dinero a simple vista.
            </Feature>
          </div>
          <div className="reveal">
            <Feature icon={ShieldCheck} title="Límite Escudo" accent="text-ca-red">
              Define presupuestos mensuales por categoría y detecta cuándo te estás pasando antes de
              que tu ahorro se resienta.
            </Feature>
          </div>
          <div className="reveal">
            <Feature icon={Target} title="Metas de ahorro" accent="text-ca-amber">
              Define un objetivo y una fecha. Cápi proyecta cuántos meses faltan y cuánto abonar cada
              ciclo.
            </Feature>
          </div>
        </div>
      </div>
    </section>
  );
}

function IA() {
  return (
    <section id="ia" className="py-20 md:py-28">
      <div className="container-ca grid items-center gap-12 lg:grid-cols-2">
        <div className="reveal order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl border border-ca-line bg-ca-surface shadow-xl">
            <div className="flex items-center gap-2 border-b border-ca-line px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ca-blue">
                <MessageSquareText size={18} />
              </span>
              <div>
                <p className="text-sm font-bold">CapiBot</p>
                <p className="text-xs text-ca-muted">Asistente financiero</p>
              </div>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <p className="max-w-[80%] rounded-2xl rounded-bl-sm bg-ca-balance/90 p-3 text-black">
                Me gasté 60 mil en el mercado este finde.
              </p>
              <p className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-ca-raised p-3 text-ca-text">
                Registrado como gasto en <strong>Comida</strong> por $60.000. Confírmalo abajo y lo
                aplico para reflejarlo en tu dashboard al instante.
              </p>
              <div className="ml-auto w-fit rounded-xl border border-ca-line bg-white/[0.02] p-3 text-xs">
                <p className="text-ca-muted">A confirmar — Movimiento</p>
                <p className="mt-1 font-semibold text-ca-text">Comida · $60.000</p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-ca-balance px-3 py-1 font-bold text-black">
                    Confirmar
                  </span>
                  <span className="rounded-full border border-ca-line px-3 py-1 text-ca-muted">
                    Cancelar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reveal order-1 lg:order-2">
          <p className="eyebrow">Asistente IA</p>
          <h2 className="heading text-4xl sm:text-5xl">
            Habla como lo piensas. Él registra por ti.
          </h2>
          <p className="lead mt-5">
            Dile a CapiBot <strong className="text-ca-text">“me gasté 20 lucas en almuerzo”</strong>{' '}
            y él interpreta el monto, la categoría y la fecha, prepara la confirmación y lo guarda
            cuando tú apruebas. Sin formularios, sin menús.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ca-muted">
            <li className="flex items-start gap-3">
              <Mic size={18} className="mt-0.5 shrink-0 text-ca-balance" />
              <span>
                Habla por voz y recibe respuestas habladas a la altura de la conversación.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingDown size={18} className="mt-0.5 shrink-0 text-ca-red" />
              <span>Pide “¿cómo voy este mes?” y lee un resumen real de tu balance.</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-ca-blue" />
              <span>Cada acción de plata se confirma antes de guardarse. Nada entra sin tu visto bueno.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Control() {
  const steps = [
    {
      n: '01',
      icon: Mic,
      title: 'Díselo, no lo llenes',
      text: 'Registra un gasto o ingreso conversando con CapiBot, o directamente desde el formulario.',
    },
    {
      n: '02',
      icon: TrendingUp,
      title: 'Categoriza y confirma',
      text: 'La IA asigna la categoría y la fecha; tú apruebas. El dashboard se actualiza al momento.',
    },
    {
      n: '03',
      icon: Wallet,
      title: 'Proyecta y ajusta',
      text: 'Metas y presupuestos se recalculan con cada movimiento, para que decidas sobre datos vivos.',
    },
  ];

  return (
    <section id="control" className="py-20 md:py-28">
      <div className="container-ca">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Control</p>
          <h2 className="heading text-4xl sm:text-5xl">
            Del bolsillo, a la decisión, en tres pasos.
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ca-line bg-ca-line md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="reveal bg-ca-surface p-8">
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl font-extrabold text-ca-muted opacity-40">
                  {step.n}
                </span>
                <step.icon size={22} className="text-ca-balance" />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ca-muted">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Seguridad() {
  return (
    <section id="seguridad" className="py-20 md:py-28">
      <div className="container-ca grid items-center gap-10 lg:grid-cols-2">
        <div className="reveal">
          <p className="eyebrow">Seguridad</p>
          <h2 className="heading text-4xl sm:text-5xl">Tus planillas, tuya.</h2>
          <p className="lead mt-5">
            Cada cuenta está aislada con contraseñas cifradas y acceso por token. Ingresa con correo
            y contraseña, o continúa con tu cuenta de Google; tu información se mantiene entre tú y
            Cápi.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="rounded-full border border-ca-line px-4 py-2 text-xs font-medium text-ca-muted">
              Contraseñas cifradas
            </span>
            <span className="rounded-full border border-ca-line px-4 py-2 text-xs font-medium text-ca-muted">
              Sesión por token
            </span>
            <span className="rounded-full border border-ca-line px-4 py-2 text-xs font-medium text-ca-muted">
              Inicio con Google
            </span>
          </div>
        </div>

        <div className="reveal flex justify-center">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-ca-line bg-ca-surface">
            <ShieldCheck size={52} className="text-ca-balance" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="py-20 md:py-28">
      <div className="container-ca">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] border border-ca-line bg-ca-surface px-6 py-16 text-center md:py-20">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(55% 60% at 50% 0%, rgba(34,197,94,0.14), transparent 70%)',
            }}
          />
          <div className="relative">
            <h2 className="heading mx-auto max-w-2xl text-4xl sm:text-5xl">
              Empieza gratis. Descubre cuánto control te falta.
            </h2>
            <p className="lead mx-auto mt-5 max-w-xl">
              Crea tu cuenta en menos de un minuto y deja que CapiBot ponga tu dinero en orden. Todo
              el acceso, sin costo.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#cta" className="btn-primary w-full sm:w-auto">
                Crear cuenta gratis <ArrowRight size={17} />
              </a>
              <a href="#producto" className="btn-ghost w-full sm:w-auto">
                Volver a ver el producto
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ca-line py-12">
      <div className="container-ca flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ca-balance text-black">
            <Wallet size={16} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-extrabold">Cápi</span>
        </div>
        <p className="text-sm text-ca-muted">
          © {new Date().getFullYear()} Cápi. Hecho para tener tu destino financiero claro.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();
  return (
    <div className="min-h-screen bg-ca-canvas text-ca-text">
      <Navbar />
      <main>
        <Hero />
        <Producto />
        <IA />
        <Control />
        <Seguridad />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}