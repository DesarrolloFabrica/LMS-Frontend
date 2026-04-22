import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type SelectableCardRenderArgs<T> = {
  item: T;
  index: number;
  selected: boolean;
  onSelect: () => void;
  /** id estable para aria-controls hacia el panel de detalle */
  detailPanelId: string;
};

export type SelectableCardPanelProps<T> = {
  items: T[];
  getItemId: (item: T) => string;
  /** Clases del contenedor del grid de tarjetas */
  gridClassName?: string;
  renderCard: (args: SelectableCardRenderArgs<T>) => ReactNode;
  renderDetail: (item: T | null) => ReactNode;
};

/**
 * Grid de tarjetas seleccionables y panel de detalle animado debajo.
 * Cada sección define el contenido; la accesibilidad base usa aria-pressed en la tarjeta.
 */
export function SelectableCardPanel<T>({
  items,
  getItemId,
  gridClassName,
  renderCard,
  renderDetail,
}: SelectableCardPanelProps<T>) {
  const reactId = useId();
  const detailPanelId = `${reactId}-detail`;

  const firstId = useMemo(() => (items[0] ? getItemId(items[0]) : null), [items, getItemId]);

  const [selectedId, setSelectedId] = useState<string | null>(firstId);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }
    const ids = items.map(getItemId);
    setSelectedId((prev) => {
      if (prev && ids.includes(prev)) return prev;
      return ids[0] ?? null;
    });
  }, [items, getItemId]);

  const selected = useMemo(
    () => items.find((i) => getItemId(i) === selectedId) ?? null,
    [items, getItemId, selectedId],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className={cn("grid gap-4", gridClassName)} role="list">
        {items.map((item, index) => {
          const id = getItemId(item);
          const isSelected = id === selectedId;
          return (
            <div key={id} role="listitem" className="min-w-0">
              {renderCard({
                item,
                index,
                selected: isSelected,
                onSelect: () => setSelectedId(id),
                detailPanelId,
              })}
            </div>
          );
        })}
      </div>

      <div id={detailPanelId} role="region" aria-live="polite" className="min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId ?? "none"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderDetail(selected)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
