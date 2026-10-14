import { describe, it, expect } from "vitest";
import { parseAuthLinkError, resendCooldownLeft, RESEND_COOLDOWN_MS } from "@/lib/auth/authLinkError";

describe("parseAuthLinkError", () => {
  it("otp_expired en fragmento → caducado", () => {
    expect(
      parseAuthLinkError("#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid"),
    ).toBe("caducado");
  });
  it("otro error → invalido", () => {
    expect(parseAuthLinkError("", "?error=access_denied&error_code=bad_jwt")).toBe("invalido");
  });
  it("callback válido con tokens no se toca", () => {
    expect(parseAuthLinkError("#access_token=x&refresh_token=y&type=signup")).toBeNull();
    expect(parseAuthLinkError("", "?code=abc")).toBeNull();
  });
});

describe("cooldown reenvío", () => {
  it("bloquea 60 s y luego libera", () => {
    expect(RESEND_COOLDOWN_MS).toBe(60_000);
    expect(resendCooldownLeft(1_000 + 59_000, 1_000)).toBe(1_000);
    expect(resendCooldownLeft(1_000 + 60_000, 1_000)).toBe(0);
  });
});
