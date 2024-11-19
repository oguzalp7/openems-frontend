
import { Providers } from "./providers";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContaxt";


export const metadata = {
  title: "PulseFlow - LV",
  description: "La Vittoria PulseFlow IoT Platform",
  manifest: "/manifest.json", 
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}