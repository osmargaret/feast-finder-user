import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Navigate, Outlet } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Initializing Terminal...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

   return (
     <div className="flex min-h-screen text-foreground font-sans overflow-hidden selection:bg-primary/30">
       <Sidebar />
       <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <TopBar />
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
             <div className="max-w-[1600px] mx-auto p-6 md:p-10 lg:p-12 min-h-full">
                <Outlet />
             </div>
          </div>
       </main>
     </div>
   );
};

export default AdminLayout;
