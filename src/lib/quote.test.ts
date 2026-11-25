import assert from "node:assert/strict";
import { test } from "node:test";
import catalog from "../../prisma/catalog.json";
import { fold, quoteLink, regreet, slugify } from "./quote";

test("fold strips accents and case", () => {
  assert.equal(fold("  Cámaras ELÉCTRICAS "), "camaras electricas");
});

test("slugify makes clean URL pieces", () => {
  assert.equal(slugify("Cámara IMOU Ranger con giro"), "camara-imou-ranger-con-giro");
  assert.equal(slugify("Fuente de 12 V de 1 A y 2 A"), "fuente-de-12-v-de-1-a-y-2-a");
});

test("every product gets its own address within its category", () => {
  for (const c of catalog.categories) {
    const slugs = c.products.map((p) => slugify(p.name));
    assert.equal(new Set(slugs).size, slugs.length, `duplicate product address in ${c.slug}`);
    assert.ok(slugs.every(Boolean), `empty product address in ${c.slug}`);
  }
});

// Colombia is UTC-5: 16:59 UTC is 11:59 there, 17:00 UTC is noon.
const MORNING = new Date("2026-11-24T16:59:00Z");
const NOON = new Date("2026-11-24T17:00:00Z");
const text = (href: string) => new URL(href).searchParams.get("text");

test("quote link greets by the hour in Colombia and carries the product", () => {
  assert.equal(new URL(quoteLink()).host, "wa.me");
  assert.equal(text(quoteLink(undefined, MORNING)), "¡Buenos días, Nocta! Me gustaría cotizar");
  assert.equal(text(quoteLink("Cámaras Dahua", NOON)), "¡Buenas tardes, Nocta! Me gustaría cotizar lo siguiente: Cámaras Dahua");
  assert.equal(text(quoteLink(undefined, new Date("2026-11-25T04:59:00Z"))), "¡Buenas tardes, Nocta! Me gustaría cotizar"); // 23:59
  assert.equal(text(quoteLink(undefined, new Date("2026-11-25T05:00:00Z"))), "¡Buenos días, Nocta! Me gustaría cotizar"); // 00:00
});

test("a link built in the morning greets the afternoon when tapped then", () => {
  assert.equal(regreet(quoteLink("Fotoceldas", MORNING), NOON), quoteLink("Fotoceldas", NOON));
});
