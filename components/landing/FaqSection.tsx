import type { FaqItem } from '@/lib/content/site-content';

interface FaqSectionProps {
  items: FaqItem[];
  id?: string;
}

export default function FaqSection({ items, id = 'preguntas-frecuentes' }: FaqSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 id={`${id}-titulo`} className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-8 space-y-6">
          {items.map((item) => (
            <div key={item.question} className="border-b border-white/10 pb-6">
              <h3 className="text-base font-bold text-white">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
