import Header from "./Header";
import Footer from "./Footer";
import MobileBar from "./MobileBar";
export default function Shell({ children, altHref }: { children: React.ReactNode; altHref?: string }) {
  return (
    <>
      <Header altHref={altHref} />
      <main>{children}</main>
      <Footer />
      <MobileBar />
    </>
  );
}
