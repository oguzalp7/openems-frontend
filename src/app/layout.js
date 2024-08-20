
import { Providers } from "./providers";
import { AuthProvider } from "@/context/AuthContext";
export const metadata = {
  title: "MS-Randevu",
  description: "Müberya Sağlam Pro. Make-up Studio",
  manifest: "/manifest.json", 
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
            <AuthProvider>
              {children}
            </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}