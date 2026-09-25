"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertTriangle } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Alert from "@/components/ui/Alert";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Username and password required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // SAVE TOKEN
      localStorage.setItem("token", data.token);

      router.push("/admin/photos");
    } catch (error) {
      console.error(error);
      setError("Cannot connect server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="app-hero !h-full" aria-hidden="true" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-[26px] border border-line-soft bg-card p-8 md:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-cente">
              <Image
                src="/Pandawa_Logo_Short_W.png"
                alt="Pandawa"
                width={56}
                height={56}
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-extrabold">Admin Login</h1>

            <p className="mt-2 text-sm text-mid">Sign in to Pandawa CMS</p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <Label>Username</Label>

              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-low"
                />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-11"
                />
              </div>
            </div>

            <div>
              <Label>Password</Label>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-low"
                />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                  placeholder="Enter password"
                  className="pl-11"
                />
              </div>
            </div>

            {error && (
              <Alert tone="error">
                <span className="inline-flex items-center gap-2">
                  <AlertTriangle size={15} />
                  {error}
                </span>
              </Alert>
            )}

            <Button
              fullWidth
              size="lg"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
