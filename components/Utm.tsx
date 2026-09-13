"use client";
import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";

/** Невидимый компонент: запоминает метки источника при первом заходе. */
export default function Utm() {
  useEffect(() => { captureUtm(); }, []);
  return null;
}
