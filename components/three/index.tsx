"use client";
import dynamic from "next/dynamic";

// Three.js scenes are code-split and never server-rendered.
export const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
export const GalleryScene = dynamic(() => import("./GalleryScene"), { ssr: false });
export const DeviceScene = dynamic(() => import("./DeviceScene"), { ssr: false });
export const MonitorScene = dynamic(() => import("./MonitorScene"), { ssr: false });
