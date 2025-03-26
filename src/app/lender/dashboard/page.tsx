/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { DashboardFooter } from "@/components/layouts/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { create } from "zustand";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { DashboardHeader } from "@/components/layouts/Header";

type AuthState = {
  role: string | null;
  setRole: (role: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role:
    typeof window !== "undefined"
      ? localStorage.getItem("userRole") || null
      : null,
  setRole: (role) => {
    if (role === null) {
      localStorage.removeItem("userRole");
    } else {
      localStorage.setItem("userRole", role);
    }
    set({ role });
  },
}));

export default function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const [, setLanguage] = useState<"es" | "en" | "fr" | "de">("en");
  const { user, isAuthenticated, isLoading } = useAuth();
  const address = useGlobalAuthenticationStore((state) => state.address);
  const { role, setRole } = useAuthStore();
  const { t } = useTranslation();

  const [storedRole, setStoredRole] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("userRole") : null
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Handle wallet-based authentication
  useEffect(() => {
    if (address) {
      const role = localStorage.getItem("userRole");
      if (role) {
        setStoredRole(role);
        registerUserBeforeRedirect(address, role);
      } else if (!role) {
        setRole("lender"); // default role
      }
    }
  }, [address, setRole]);

  // Handle traditional authentication redirects
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "Lender") {
        router.push("/lender/dashboard");
      } else if (user.role === "Borrower") {
        router.push("/borrower/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"> </div>
      </div>
    );
  }

  // Add utility functions
  const retryFetch = async (
    url: string,
    options: RequestInit,
    retries = 3,
    delay = 1000
  ) => {
    // ... existing retryFetch implementation ...
  };

  const registerUserBeforeRedirect = async (
    walletAddress: string,
    role: string
  ) => {
    // ... existing registerUserBeforeRedirect implementation ...
  };
  

  return (
    <div className={`h-screen flex flex-col ${theme === "dark" ? "dark" : ""}`}>
      <DashboardHeader
        theme={theme}
        setTheme={setTheme}
        setLanguage={setLanguage}
      />
      <main className="flex-1 flex flex-col sm:flex-row justify-center items-center bg-white dark:bg-darkbg text-black dark:text-gray-100 mt-20 gap-10">
        <h1 className="text-5xl md:text-6xl font-bold text-center md:text-left">
          {t("homepage.title", "Welcome to")} <br />{" "}
          {t("homepage.title.part2", "TrustBridge")}
        </h1>
        <hr className="hidden md:block bg-gray-200 dark:bg-gray-600 w-0.5 h-96" />
        <p className="text-xl md:w-1/2 text-gray-700 dark:text-gray-300 leading-relaxed text-center md:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-bold">
            {t("homepage.subtitle", "TrustBridge is a decentralized platform")}
          </span>{" "}
          {t(
            "homepage.body",
            "designed to facilitate P2P microloans securely, transparently, and efficiently. We connect lenders and borrowers through blockchain technology, leveraging smart contracts to automate and secure transactions. Our approach promotes financial inclusion, empowering global communities by providing accessible and reliable tools to manage loans without traditional intermediaries."
          )}
        </p>
      </main>
      <DashboardFooter />
    </div>
  );
}