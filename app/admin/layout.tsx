import { SideBar } from "@/components/admin/layout/SideBar";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="flex h-screen">
            <SideBar />
            <section className="flex-1 p-6 overflow-y-auto" >
            {children}
            </section>
        </main>
    );
  }