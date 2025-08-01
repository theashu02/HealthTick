"use client";
import React from "react";
import AuthWrapper from "./components/auth/AuthWrapper";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <>
      <AuthWrapper />
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
    </>
  );
}
