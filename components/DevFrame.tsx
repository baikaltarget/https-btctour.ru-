import { DEV } from "@/lib/content";
/** Красная рамка для блоков, которые должен проверить/заполнить заказчик. Отключается в site.json → dev.showTodos */
export default function DevFrame({ note, children, className = "", inline = false }: { note?: string; children?: React.ReactNode; className?: string; inline?: boolean }) {
  if (!DEV.showTodos || !note) return <>{children}</>;
  const Tag = inline ? "span" : "div";
  return (
    <Tag className={`todo-frame ${className}`} data-todo={"ПРОВЕРИТЬ: " + note}>
      {children}
    </Tag>
  );
}
