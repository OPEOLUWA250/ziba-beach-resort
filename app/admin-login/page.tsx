"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);
  const [recoveryIdentifier, setRecoveryIdentifier] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newRecoveryPassword, setNewRecoveryPassword] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [recoveryUiEnabled, setRecoveryUiEnabled] = useState(false);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);

  useEffect(() => {
    const fromEnv = process.env.NEXT_PUBLIC_SHOW_ADMIN_RECOVERY_UI === "true";
    const fromQuery =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("recover") === "1";

    if (fromEnv || fromQuery) {
      setRecoveryUiEnabled(true);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      // Stealth reveal shortcut for trusted operators only.
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        setRecoveryUiEnabled(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (failedLoginAttempts > 0) {
      setRecoveryUiEnabled(true);
    }
  }, [failedLoginAttempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setFailedLoginAttempts((prev) => prev + 1);
        return;
      }

      router.push("/admin/operations");
    } catch {
      setError("Unable to login. Please try again.");
      setFailedLoginAttempts((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoveryMessage(null);
    setIsRecovering(true);

    try {
      const response = await fetch("/api/admin/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          identifier: recoveryIdentifier.trim() || undefined,
          recoveryKey,
          newPassword: newRecoveryPassword,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setRecoveryError(payload.error || "Recovery failed");
        return;
      }

      setRecoveryMessage(
        "Recovery successful. You are now signed in as SUPER_ADMIN.",
      );
      setRecoveryKey("");
      setNewRecoveryPassword("");
      setRecoveryIdentifier("");
      router.push("/admin/operations");
    } catch {
      setRecoveryError("Unable to recover account. Please try again.");
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-light text-white mb-2">Admin Login</h1>
        <p className="text-gray-400 mb-8">Sign in to access the dashboard</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-900/50 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">
              Username or Email
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              placeholder="admin username or email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-blue-500"
                placeholder="••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white rounded-lg py-3 font-semibold disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {recoveryUiEnabled && (
          <div className="mt-6 border-t border-gray-800 pt-5">
            <button
              type="button"
              onClick={() => {
                setShowRecoveryForm((prev) => !prev);
                setRecoveryError(null);
                setRecoveryMessage(null);
              }}
              className="w-full text-left flex items-center gap-2 text-amber-300 hover:text-amber-200 text-sm"
            >
              <KeyRound size={16} /> Emergency SUPER_ADMIN recovery
            </button>

            {showRecoveryForm && (
              <form onSubmit={handleRecovery} className="mt-4 space-y-3">
                {recoveryError && (
                  <div className="p-3 rounded-lg bg-red-900/30 border border-red-900/50 text-red-300 text-xs">
                    {recoveryError}
                  </div>
                )}

                {recoveryMessage && (
                  <div className="p-3 rounded-lg bg-green-900/30 border border-green-900/50 text-green-300 text-xs">
                    {recoveryMessage}
                  </div>
                )}

                <p className="text-xs text-gray-400 leading-relaxed">
                  Use this only when SUPER_ADMIN access is lost. Requires the
                  server-side recovery key from your deployment secrets.
                </p>

                <input
                  value={recoveryIdentifier}
                  onChange={(e) => setRecoveryIdentifier(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="SUPER_ADMIN email or username (optional)"
                />

                <input
                  value={newRecoveryPassword}
                  onChange={(e) => setNewRecoveryPassword(e.target.value)}
                  type="password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="New password"
                  required
                />

                <input
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  type="password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Recovery key"
                  required
                />

                <button
                  type="submit"
                  disabled={isRecovering}
                  className="w-full bg-amber-700 hover:bg-amber-600 text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
                >
                  {isRecovering ? "Recovering..." : "Recover SUPER_ADMIN"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
