/** Фирменный элемент: линия ледяной трещины. Используется как разделитель секций и под заголовками. */
export default function IceLine({ className = "", width = 320 }: { className?: string; width?: number }) {
  return (
    <svg className={`ice-line ${className}`} width={width} height="14" viewBox="0 0 320 14" fill="none" aria-hidden="true">
      <path d="M0 7 L38 6 L52 2 L61 9 L96 8 L118 3 L131 10 L160 7 L182 11 L197 4 L226 6 L241 1 L253 8 L286 7 L302 12 L320 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M118 3 L112 0" stroke="currentColor" strokeWidth="1" /><path d="M241 1 L246 -2" stroke="currentColor" strokeWidth="1" />
      <path d="M182 11 L188 14" stroke="currentColor" strokeWidth="1" /><path d="M52 2 L48 -1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
