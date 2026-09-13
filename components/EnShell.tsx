import Header from "./Header";
import Footer from "./Footer";
import CookieBar from "./CookieBar";
export default function EnShell({ children, altHref }: { children: React.ReactNode; altHref: string }) {
  return (<><Header lang="en" altHref={altHref} /><main>{children}</main><Footer lang="en" /><CookieBar lang="en" /></>);
}
