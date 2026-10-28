import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: { default: "PhotoCraftSquare — A little yarn. A lot of joy.", template: "%s · PhotoCraftSquare" }, description: "Crochet pieces and custom requests from PhotoCraftSquare, Islamabad. Thoughtful little gifts, bags and pieces for your home.", robots: { index: false, follow: false }, icons: { icon: "/favicon.svg" } };
export default function Layout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en"><body>{children}</body></html>; }
