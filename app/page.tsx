"use client";
import React from "react";
import AuthWrapper from "./components/auth/AuthWrapper";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <>
      <AuthWrapper />
      <div className="absolute top-4 right-16 z-50 md:top-5 md:right-5">
        <ModeToggle />
      </div>
    </>
  );
}
