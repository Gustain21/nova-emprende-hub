import { describe, it, expect } from "vitest";
import { readAttribution } from "@/lib/attribution";

const granted = { v: 1, analytics: true, marketing: false, ts: "" };
const denied = { v: 1, analytics: false, marketing: false, ts: "" };
const q = "?utm_source=Diagnostico&utm_campaign=lanz&origen=diagnostico-big-bang&currency=USD&foo=bar";

describe("atribución del checkout", () => {
  it("con consentimiento: envía UTM y origen permitido, ignora currency y claves desconocidas", () => {
    expect(readAttribution(q, granted)).toEqual({ utm_source: "diagnostico", utm_campaign: "lanz", origen: "diagnostico-big-bang" });
  });
  it("con consentimiento solo de marketing también envía UTM", () => {
    expect(readAttribution(q, { ...denied, marketing: true }).utm_source).toBe("diagnostico");
  });
  it("consentimiento denegado: no envía UTM, solo origen técnico", () => {
    expect(readAttribution(q, denied)).toEqual({ origen: "diagnostico-big-bang" });
  });
  it("sin decisión de consentimiento: no envía UTM", () => {
    expect(readAttribution(q, null)).toEqual({ origen: "diagnostico-big-bang" });
  });
  it("origen fuera de la lista fija se descarta", () => {
    expect(readAttribution("?origen=juan-perez", granted)).toEqual({});
  });
  it("descarta valores con @, largos o con caracteres raros", () => {
    expect(readAttribution(`?utm_source=a@b.com&utm_medium=${"x".repeat(65)}&utm_campaign=hola%20mundo`, granted)).toEqual({});
  });
});
