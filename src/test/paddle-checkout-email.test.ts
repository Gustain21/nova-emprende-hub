import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks de dependencias externas de paddleClient: no tocan red real.
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { token: "test-token", environment: "sandbox" },
        error: null,
      }),
    },
  },
}));
vi.mock("@/lib/analytics/track", () => ({ trackPurchase: vi.fn() }));
vi.mock("@/lib/analytics/money", () => ({ paddleMinorToMajor: (v: unknown) => v }));

async function loadModule() {
  vi.resetModules();
  return await import("@/lib/paddle/paddleClient");
}

function installFakePaddle() {
  const checkoutOpen = vi.fn();
  (window as any).Paddle = {
    Environment: { set: vi.fn() },
    Initialize: vi.fn(),
    Checkout: { open: checkoutOpen },
  };
  return checkoutOpen;
}

describe("openPaddleCheckout — prefill del email del comprador", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).Paddle;
  });

  it("pasa customer.email cuando se proporciona, junto a transactionId", async () => {
    const checkoutOpen = installFakePaddle();
    const { openPaddleCheckout } = await loadModule();

    await openPaddleCheckout("txn_test_123", { customerEmail: "comprador@example.com" });

    expect(checkoutOpen).toHaveBeenCalledTimes(1);
    const args = checkoutOpen.mock.calls[0][0];
    expect(args.transactionId).toBe("txn_test_123");
    expect(args.customer).toEqual({ email: "comprador@example.com" });
    expect(args.settings).toMatchObject({ displayMode: "overlay", theme: "dark", locale: "es" });
  });

  it("no pasa customer cuando no se proporciona email (ruta _ptxn sin formulario)", async () => {
    const checkoutOpen = installFakePaddle();
    const { openPaddleCheckout } = await loadModule();

    await openPaddleCheckout("txn_test_456");

    expect(checkoutOpen).toHaveBeenCalledTimes(1);
    const args = checkoutOpen.mock.calls[0][0];
    expect(args.transactionId).toBe("txn_test_456");
    expect(args.customer).toBeUndefined();
  });

  it("normaliza el email con trim/lowercase solo en la página, no en el cliente", async () => {
    // El cliente debe reenviar el email tal cual recibe; la normalización
    // pertenece a PagarProducto (emailToSend ya normalizado).
    const checkoutOpen = installFakePaddle();
    const { openPaddleCheckout } = await loadModule();

    await openPaddleCheckout("txn_test_789", { customerEmail: "  Comprador@Example.COM  " });

    expect(checkoutOpen.mock.calls[0][0].customer).toEqual({
      email: "  Comprador@Example.COM  ",
    });
  });
});
