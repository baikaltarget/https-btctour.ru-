import Header from "./Header";
import Footer from "./Footer";
import MobileBar from "./MobileBar";
import CookieBar from "./CookieBar";
export default function Shell({ children, altHref }: { children: React.ReactNode; altHref?: string }) {
  return (
    <>
      <Header altHref={altHref} />
      <main>{children}</main>
      <Footer />
      <MobileBar />
      <CookieBar />
    </>
  );
}
