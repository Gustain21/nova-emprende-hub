import { describe, it, expect } from "vitest";
import { readAttribution } from "@/lib/attribution";

describe("atribución del checkout", () => {
  it("acepta UTM/origen permitidos e ignora currency y claves desconocidas", () => {
    expect(readAttribution("?utm_source=Diagnostico&origen=diagnostico-big-bang&currency=USD&foo=bar")).toEqual({
      utm_source: "diagnostico",
      origen: "diagnostico-big-bang",
    });
  });
  it("descarta PII y valores largos o con caracteres raros", () => {
    expect(readAttribution(`?utm_source=a@b.com&utm_medium=${"x".repeat(65)}&utm_campaign=hola%20mundo`)).toEqual({});
  });
});
