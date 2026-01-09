import DashboardNavbar from '@/components/organisms/DashboardNavbar';
import DashboardSidebar from '@/components/organisms/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

type DashboardLayoutWrapperProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayoutWrapper({ 
  children, 
}: DashboardLayoutWrapperProps) {
   

  return (
   <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 w-full">
          <DashboardNavbar  />
          <main className="flex-1 w-full container-custom min-h-screen  lg:bg-(--secondary-foreground) pt-5 pb-20 md:py-5">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
