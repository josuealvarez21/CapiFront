interface KeyPointsProps {
  items: string[];
  title?: string;
}

export default function KeyPoints({ items, title = 'Puntos clave' }: KeyPointsProps) {
  return (
    <section
      aria-labelledby="puntos-clave"
      className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 text-left"
    >
      <h2 id="puntos-clave" className="mb-3 text-sm font-black uppercase tracking-widest text-[#4ade80]">
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-gray-300">
            <span aria-hidden="true" className="mt-1 text-[#4ade80]">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
