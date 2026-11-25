import Link from "next/link";
import { Intro } from "@/components/Intro";
import { MapEmbed } from "@/components/MapEmbed";
import { ProductCard } from "@/components/ProductCard";
import { type Review, ReviewsCarousel } from "@/components/ReviewsCarousel";
import { getCatalog } from "@/lib/catalog";
import { SHOPS } from "@/lib/site";

const ABOUT = [
  ["Instalamos", "Visitamos su casa o su negocio, le recomendamos los equipos y los dejamos instalados y funcionando."],
  ["Vigilamos", "Monitoreo y apoyo las 24 horas, también cuando cae la noche."],
  ["Respondemos", "Desde nuestras sedes salimos a atender su llamado, a cualquier hora."],
] as const;

// Sample reviews: NOCTA is a fictional brand.
const REVIEWS: Review[] = [
  { name: "Laura Ramírez", text: "Instalaron cámaras y una alarma en mi tienda en una sola tarde. Me explicaron todo con calma y ahora veo el local desde el celular." },
  { name: "Andrés Gómez", text: "Teníamos robos en el parqueadero del edificio. Desde que pusieron la cerca eléctrica y el monitoreo, cero problemas." },
  { name: "Marcela Torres", text: "Cumplidos con la hora y muy ordenados. El motor de la puerta quedó perfecto y respondieron rápido una duda un domingo." },
  { name: "Jorge Castillo", text: "Buen equipo, buen precio y atención inmediata cuando sonó la alarma de madrugada. Muy recomendados." },
  { name: "Paola Herrera", text: "El técnico fue muy paciente, me dejó la app configurada y me enseñó a revisar las grabaciones." },
  { name: "Felipe Rojas", text: "Cotizamos por WhatsApp y al otro día ya estaban instalando. Excelente servicio." },
];


const TITLE = "text-center font-black uppercase leading-none text-primary";
// One rhythm between sections: 96 px on phones, 144 px on wide screens (it was 224 px, which read as empty screens).
const SECTION = "py-12 md:py-[4.5rem]";

export default async function Home() {
  const catalog = await getCatalog();

  return (
    <>
      <noscript dangerouslySetInnerHTML={{ __html: "<style>.intro{display:none}.hero-left,.hero-right{translate:none}</style>" }} />
      <Intro />

      {/* ALARMAS / 24 HORAS: enter from the sides once the logo reaches the bar (globals.css). */}
      {/* Exactly the screen under the bar: the opening frame shows nothing of the next section. */}
      <section className="flex min-h-[calc(100svh-4rem)] items-center overflow-clip px-4 xl:min-h-[calc(100svh-5.5rem)]">
        <h1 className="w-full text-[15vw] font-black uppercase leading-[1.05] md:text-[10vw] xl:text-[7.3vw]">
          <span className="hero-left block md:pl-[8%] xl:pl-[14%]">Alarmas</span>{" "}
          <span className="hero-right block pl-[14%] text-primary md:pl-[40%] xl:pl-[50%]">24 horas</span>
        </h1>
      </section>

      {/* What NOCTA is, as a dark band of its own: it closes the opening and keeps apart from the services below. */}
      <section className="grid gap-4 bg-neutral px-4 py-16 text-white md:grid-cols-2 md:items-center md:gap-12 md:px-[8.6%] md:py-24">
        <h2 className="text-[11vw] font-black uppercase leading-none text-primary md:text-[6vw]">Expertos en</h2>
        <p className="text-[6.5vw] font-black leading-[1.1] md:text-[3vw]">Monitoreo, apoyo 24 horas, alarmas y cámaras de seguridad</p>
      </section>

      {/* What NOCTA does: the menu's "Servicios" lands here. */}
      <section id="servicios" className={`px-4 md:px-[10%] ${SECTION}`}>
        <h2 className={`${TITLE} text-[12vw] md:text-[6.25vw]`}>Servicios:</h2>
        <div className="mt-10 grid gap-5 md:mt-16 md:gap-8">
          {ABOUT.map(([title, text]) => (
            <article key={title} className="grid gap-3 bg-card px-5 py-7 md:grid-cols-2 md:items-center md:gap-12 md:px-[4%] md:py-[3.2%]">
              <h3 className="text-[7.5vw] font-black uppercase leading-none md:text-[3.3vw]">{title}</h3>
              <p className="font-semibold leading-snug md:text-[1.6vw]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* What we sell, four products per category: a swipeable row each on phones, a row of four on wide screens. */}
      <section id="catalogo" className={`px-4 md:px-[8.6%] ${SECTION}`}>
        <h2 className={`${TITLE} text-[12vw] md:text-[5vw]`}>Catálogo</h2>
        {catalog.map((c) => (
          <div key={c.slug} className="mt-10 md:mt-16">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-xl font-black uppercase md:text-[2.4vw]">
                <Link href={`/catalogo/${c.slug}`} className="transition-colors duration-200 hover:text-primary">
                  {c.title}
                </Link>
              </h3>
              <Link href={`/catalogo/${c.slug}`} aria-hidden tabIndex={-1} className="shrink-0 font-body text-sm font-semibold text-muted underline-offset-4 hover:text-primary hover:underline md:text-base">
                Ver todo ›
              </Link>
            </div>
            <ul className="-mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:mt-8 md:grid md:grid-cols-4 md:gap-8 md:overflow-visible md:px-0">
              {c.products.slice(0, 4).map((p) => (
                <li key={p.id} className="w-[42vw] shrink-0 snap-start md:w-auto">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-14 text-center md:mt-20">
          <p className="mx-auto max-w-[20ch] text-[7vw] font-black uppercase leading-tight text-primary md:max-w-none md:text-[3.4vw]">
            ¿Quiere ver todos nuestros productos?
          </p>
          <Link href="/catalogo" className="btn-catalog mt-6 md:mt-8">
            Ver catálogo completo
          </Link>
        </div>
      </section>

      {/* Sample reviews, no stars or titles. */}
      <section id="opiniones" aria-label="Lo que dicen nuestros clientes" className={SECTION}>
        <ReviewsCarousel reviews={REVIEWS} />
      </section>

      <section id="sedes" className={`px-4 md:px-[18%] ${SECTION}`}>
        <h2 className="text-[11vw] font-black uppercase leading-none text-primary md:text-[6.5vw]">Nuestras sedes</h2>
        {SHOPS.map((s) => (
          <div key={s.town} className="mt-10 md:mt-16">
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-1">
              <h3 className="text-3xl font-black uppercase md:text-[3.3vw]">{s.town}</h3>
              <p className="font-semibold md:text-[1.6vw]">{s.address}</p>
            </div>
            <MapEmbed town={s.town} query={s.map} />
          </div>
        ))}
      </section>
    </>
  );
}
