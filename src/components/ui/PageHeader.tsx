export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-2 space-y-2 sm:mb-4">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2rem]">{title}</h1>
      {description ? <p className="max-w-2xl text-base leading-relaxed text-slate-600">{description}</p> : null}
    </header>
  );
}
