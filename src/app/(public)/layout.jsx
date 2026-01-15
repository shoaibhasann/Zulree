import Footer from "@/components/Footer";
import PublicSidebar from "@/components/PublicSidebar";

export default function PublicLayout({ children }){
    return (
      <>
        <PublicSidebar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </>
    );
}