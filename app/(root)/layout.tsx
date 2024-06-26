import LeftSidebar from "@/components/LeftSidebar";
import MobileNav from "@/components/MobileNav";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster"
import PodcastPlayer from "@/components/PodcastPlayer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
        <main className="relative flex bg-black-3">
            <LeftSidebar/>
            
            <section className="flex flex-col min-h-screen flex-1 px-4 sm:px-14">
              <div className="mx-auto flex flex-col w-full max-sm:px-4">
                <div className="flex h-16 items-center justify-between md:hidden">
                  <Image 
                    src='/icons/logo-diamond.svg' 
                    width={50} 
                    height={50}
                    alt='logo'
                    />
                  <MobileNav />
                </div>
                <div className="flex flex-col md:pb-14">
                  <Toaster />
                  {children}
                </div>
              </div>
            </section>
            <RightSidebar/>
        </main>
        <PodcastPlayer />
    </div>
  );
}

