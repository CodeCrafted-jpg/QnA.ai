import "./globals.css";
import { AppStateProvider } from "@/lib/state";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandCenter } from "@/components/layout/CommandCenter";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="min-h-screen lg:pl-[260px]">{children}</main>
            <CommandCenter />
          </div>
        </AppStateProvider>
      </body>
    </html>
  );
}
