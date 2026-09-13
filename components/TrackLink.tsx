"use client";
import { goal, type Goal } from "@/lib/ym";

/** Ссылка, которая отправляет цель в Метрику по клику. Нужна, чтобы не делать клиентскими целые серверные блоки. */
export default function TrackLink({
  href, event, params, className, children, target, rel,
}: {
  href: string;
  event: Goal;
  params?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}) {
  return (
    <a href={href} className={className} target={target} rel={rel} onClick={() => goal(event, params)}>
      {children}
    </a>
  );
}
