"use client";

import * as React from "react";
import { Check, Copy, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * TOTP two-factor-auth enrollment flow. Three steps:
 *
 *   1. Show the QR code + manual secret. User scans into their authenticator.
 *   2. User types the 6-digit code; we POST it to verify.
 *   3. Show one-time backup codes (with copy + download). Mark setup complete.
 *
 *   <TwoFactorSetup
 *     loadProvisioningUri={async () => {
 *       const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
 *       return res.json(); // { provisioningUri, secret }
 *     }}
 *     verifyCode={(code) => fetch("/api/auth/2fa/verify", { method: "POST", body: JSON.stringify({ code }) }).then(r => r.ok)}
 *     loadBackupCodes={async () => {
 *       const res = await fetch("/api/auth/2fa/backup-codes", { method: "POST" });
 *       return res.json(); // string[]
 *     }}
 *     onComplete={() => router.push("/settings/security?2fa=enabled")}
 *   />
 *
 * The QR code renders from `provisioningUri` (otpauth://...), encoded LOCALLY
 * via the `qrcode` package. It is never sent to a third-party image service:
 * the provisioning URI embeds the TOTP shared secret, so handing it to an
 * external host (or letting it land in a CDN access log) would let that host
 * generate valid codes for every user who enrolls.
 *
 * Pass `renderQr` to swap in your own QR component.
 */

/**
 * Encodes the otpauth:// URI to a data-URI QR entirely in the browser. The
 * secret never leaves the page.
 */
function LocalQr({ uri, brandName }: { uri: string; brandName: string }) {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    import("qrcode")
      .then((qr) => qr.toDataURL(uri, { width: 196, margin: 1 }))
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [uri]);

  if (failed) {
    return (
      <p className="text-sm text-muted-foreground">
        Could not render the QR code. Enter the secret below manually instead.
      </p>
    );
  }

  if (!dataUrl) {
    return <div className="h-[196px] w-[196px] animate-pulse rounded-md border border-border bg-muted" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- data: URI, no optimisation needed
    <img
      alt={`2FA QR for ${brandName}`}
      width={196}
      height={196}
      src={dataUrl}
      className="rounded-md border border-border"
    />
  );
}

interface TwoFactorSetupProps {
  /** Server call: starts the enrollment, returns the provisioning URI + manual secret. */
  loadProvisioningUri: () => Promise<{ provisioningUri: string; secret: string }>;
  /** Server call: confirm the user's 6-digit code. Returns true on success. */
  verifyCode: (code: string) => Promise<boolean>;
  /** Server call: return N one-time backup codes (8–10 of them). */
  loadBackupCodes: () => Promise<string[]>;
  /** Fired after the user clicks Done on the backup-codes screen. */
  onComplete?: () => void;
  /** Override the QR renderer (e.g. use an in-house SVG lib). */
  renderQr?: (provisioningUri: string) => React.ReactNode;
  /** Brand label shown on the QR step. Default: "Acme". */
  brandName?: string;
  className?: string;
}

type Step = "scan" | "verify" | "backup" | "done";

export function TwoFactorSetup({
  loadProvisioningUri,
  verifyCode,
  loadBackupCodes,
  onComplete,
  renderQr,
  brandName = "Acme",
  className,
}: TwoFactorSetupProps) {
  const [step, setStep] = React.useState<Step>("scan");
  const [provisioning, setProvisioning] = React.useState<{ provisioningUri: string; secret: string } | null>(
    null,
  );
  const [code, setCode] = React.useState("");
  const [backupCodes, setBackupCodes] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Start the enrollment as soon as the component mounts
  React.useEffect(() => {
    void (async () => {
      try {
        const data = await loadProvisioningUri();
        setProvisioning(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't start 2FA setup");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleVerify() {
    setError(null);
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your authenticator");
      return;
    }
    setLoading(true);
    try {
      const ok = await verifyCode(code);
      if (!ok) {
        setError("Invalid code. Try again.");
        return;
      }
      const codes = await loadBackupCodes();
      setBackupCodes(codes);
      setStep("backup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {step === "scan" && (
        <Scan
          provisioning={provisioning}
          renderQr={renderQr}
          brandName={brandName}
          onContinue={() => setStep("verify")}
        />
      )}

      {step === "verify" && (
        <Verify
          code={code}
          setCode={setCode}
          onSubmit={handleVerify}
          onBack={() => setStep("scan")}
          loading={loading}
          error={error}
        />
      )}

      {step === "backup" && (
        <BackupCodes
          codes={backupCodes}
          onDone={() => {
            setStep("done");
            onComplete?.();
          }}
        />
      )}

      {error && step === "scan" ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}

/* ─────────── Step 1: scan QR ─────────── */
function Scan({
  provisioning,
  renderQr,
  brandName,
  onContinue,
}: {
  provisioning: { provisioningUri: string; secret: string } | null;
  renderQr?: TwoFactorSetupProps["renderQr"];
  brandName: string;
  onContinue: () => void;
}) {
  if (!provisioning) {
    return (
      <div className="grid place-items-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Add an authenticator app
        </h2>
        <p className="text-sm text-muted-foreground">
          Scan the QR code with Google Authenticator, 1Password, Authy, or any TOTP app.
        </p>
      </header>

      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6">
        {renderQr ? (
          renderQr(provisioning.provisioningUri)
        ) : (
          <LocalQr uri={provisioning.provisioningUri} brandName={brandName} />
        )}
        <div className="w-full">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Or enter this secret manually
          </div>
          <SecretRow secret={provisioning.secret} />
        </div>
      </div>

      <Button onClick={onContinue} className="self-start">
        Continue
      </Button>
    </div>
  );
}

function SecretRow({ secret }: { secret: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 font-mono text-sm">
      <span className="tracking-widest">{secret}</span>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(secret);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* ignore */
          }
        }}
        className="rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Copy secret"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

/* ─────────── Step 2: verify code ─────────── */
function Verify({
  code,
  setCode,
  onSubmit,
  onBack,
  loading,
  error,
}: {
  code: string;
  setCode: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <header>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Enter the 6-digit code
        </h2>
        <p className="text-sm text-muted-foreground">
          Open your authenticator app and enter the current code.
        </p>
      </header>

      <Input
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="123456"
        className="max-w-xs text-center font-mono text-2xl tracking-[0.5em]"
      />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={loading || code.length !== 6}>
          {loading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
          Verify
        </Button>
      </div>
    </form>
  );
}

/* ─────────── Step 3: backup codes ─────────── */
function BackupCodes({ codes, onDone }: { codes: string[]; onDone: () => void }) {
  const text = codes.join("\n");

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Two-factor auth enabled — save your backup codes
          </h2>
          <p className="text-sm text-muted-foreground">
            Use a backup code if you ever lose access to your authenticator app. Each code works once.
          </p>
        </div>
      </header>

      <ul className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm">
        {codes.map((c) => (
          <li key={c} className="rounded-sm bg-background px-2 py-1.5 text-center tracking-widest">
            {c}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
            } catch {
              /* ignore */
            }
          }}
        >
          <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy all
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "backup-codes.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download .txt
        </Button>
        <Button onClick={onDone} className="ml-auto">
          I've saved them
        </Button>
      </div>
    </div>
  );
}
