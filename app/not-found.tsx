import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="wrap py-24 text-center">
        <h1>Такой страницы нет</h1>
        <p className="mx-auto mt-4 max-w-md text-ink/80">Возможно, тур переехал. Посмотрите все туры на Байкал или напишите нам — подскажем.</p>
        <p className="mt-6 flex justify-center gap-3"><Link href="/baikal/" className="btn-primary">Туры на Байкал</Link><Link href="/kontakty/" className="btn-ghost">Контакты</Link></p>
      </main>
      <Footer />
    </>
  );
}
