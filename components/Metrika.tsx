import site from "@/content/site.json";

/**
 * Счётчик Яндекс Метрики.
 * Намеренно обычный <script>, а не next/script: с next/script тег попадал
 * в Suspense-границу и в статическом HTML не оказывался — счётчик не грузился вовсе.
 */
export default function Metrika() {
  const id = site.site.metrikaId;
  if (!id) return null;
  const code = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<e.scripts.length;j++){if(e.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${id}","ym");ym(${id},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: code }} />
      <noscript><div><img src={`https://mc.yandex.ru/watch/${id}`} style={{ position: "absolute", left: "-9999px" }} alt="" /></div></noscript>
    </>
  );
}
