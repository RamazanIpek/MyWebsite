import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Ramazan İpek | Portföy",
  description: "Yazılım geliştirici portföy sitesi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-black text-white">
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
