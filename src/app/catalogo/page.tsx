import type { Metadata } from "next";
import { CatalogView } from "@/components/CatalogView";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Cámaras, alarmas, cercas eléctricas y motores para puertas de Hikvision, Dahua, IMOU y DSC. Cotice por WhatsApp.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogPage() {
  return <CatalogView catalog={await getCatalog()} />;
}
