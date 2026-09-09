import Image from "next/image";
export default function Logo() {
  return (
    <span className="inline-flex items-center no-underline">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image src="/img/logo.png" alt="БиТиСи — туризм на Байкале" width={165} height={40} priority className="h-9 w-auto md:h-10" />
    </span>
  );
}
