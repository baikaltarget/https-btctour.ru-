import Header from "./Header";
import Footer from "./Footer";
export default function EnShell({ children, altHref }: { children: React.ReactNode; altHref: string }) {
  return (<><Header lang="en" altHref={altHref} /><main>{children}</main><Footer lang="en" /></>);
}
