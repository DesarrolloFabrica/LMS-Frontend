export function TimelineItem({ title, date }: { title: string; date: string }) {
  return <div className="border-l border-slate-200 pl-4"><p className="font-medium">{title}</p><p className="text-xs text-slate-500">{date}</p></div>;
}

