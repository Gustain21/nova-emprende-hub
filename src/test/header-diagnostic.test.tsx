import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/layout/Header";
import { DIAGNOSTIC_URL } from "@/config/diagnostic";

const trackEventMock = vi.fn();

vi.mock("@/lib/analytics/track", () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null }),
}));

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe("Header — acceso al Diagnóstico", () => {
  beforeEach(() => {
    trackEventMock.mockClear();
  });

  it("muestra 'Diagnóstico gratuito' en el menú de escritorio con la URL centralizada", () => {
    renderHeader();
    const links = screen
      .getAllByRole("link", { name: "Diagnóstico gratuito" })
      .filter((el) => el.closest("nav")?.className.includes("hidden lg:flex"));
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", DIAGNOSTIC_URL);
    expect(links[0]).not.toHaveAttribute("target");
    expect(links[0].className).toContain("rounded-full");
    expect(links[0].className).toContain("border-brand-orange");
  });

  it("registra diagnostic_cta_clicked con source_page header_desktop", () => {
    renderHeader();
    const link = screen
      .getAllByRole("link", { name: "Diagnóstico gratuito" })
      .find((el) => el.closest("nav")?.className.includes("hidden lg:flex"))!;
    fireEvent.click(link);
    expect(trackEventMock).toHaveBeenCalledWith("diagnostic_cta_clicked", {
      source_page: "header_desktop",
    });
  });

  it("lo coloca después de Ecosistema y antes de Packs", () => {
    renderHeader();
    const desktopNav = document.querySelector("nav.hidden.lg\\:flex")!;
    const labels = Array.from(desktopNav.querySelectorAll("a")).map(
      (a) => a.textContent
    );
    const idxDiag = labels.indexOf("Diagnóstico gratuito");
    expect(labels[idxDiag - 1]).toBe("Ecosistema");
    expect(labels[idxDiag + 1]).toBe("Packs");
  });

  it("muestra 'Diagnóstico gratuito' en el menú móvil y registra header_mobile", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    const mobileNav = document.querySelector("nav.brand-container")!;
    const link = Array.from(mobileNav.querySelectorAll("a")).find(
      (a) => a.textContent === "Diagnóstico gratuito"
    )!;
    expect(link).toHaveAttribute("href", DIAGNOSTIC_URL);
    expect(link).not.toHaveAttribute("target");
    expect(link.className).toContain("rounded-full");
    expect(link.className).toContain("w-full");
    fireEvent.click(link);
    expect(trackEventMock).toHaveBeenCalledWith("diagnostic_cta_clicked", {
      source_page: "header_mobile",
    });
  });
});
