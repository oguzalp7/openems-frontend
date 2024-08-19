
import { Providers } from "./providers";

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
            {children}
        </Providers>
      </body>
    </html>
  );
}