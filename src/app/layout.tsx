import localFont from "next/font/local";
import "./globals.css";

import TopNavigation from "./_components/top-navigation";

const yekanbakh = localFont({
  src: [
    {
      path: "../../public/fonts/IRANYekanWebLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANYekanWebRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANYekanWebMedium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANYekanWebBold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/IRANYekanWebBlack.woff2",
      weight: "900",
      style: "normal",
    },
  ],

  variable: "--font-yekanbakh",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="">
      <body
        className={`${yekanbakh.variable}  antialiased bg-secondary-900 text-sm `}
      >
        <TopNavigation />
        {children}
      </body>
    </html>
  );
}
