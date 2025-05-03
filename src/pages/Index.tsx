
import IndexList from "@/components/IndexList";
import IndexChart from "@/components/IndexChart";
import Spinner from "@/components/Spinner";
import { DataProvider, useData } from "@/contexts/DataContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { loading, error } = useData();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white border rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white py-4 px-6 border-b shadow-sm flex items-center justify-between z-10">
        <h1 className="text-2xl font-bold text-financial-blue flex items-center">
          <span className="text-3xl mr-2">📊</span>
          Index Insight Visualizer
        </h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden bg-financial-blue text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {sidebarOpen ? "Hide" : "Show"} Indexes
        </button>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div 
          className={cn(
            "border-r bg-sidebar transition-all duration-300 relative",
            sidebarOpen ? "w-64" : "w-0 md:w-0"
          )}
        >
          <IndexList />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "absolute top-1/2 -right-3 bg-white border border-gray-200 rounded-full p-1 shadow-md text-gray-500 hover:text-financial-blue transition-colors hidden md:flex",
              sidebarOpen ? "-right-3" : "-right-3"
            )}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <IndexChart />
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
};

export default Index;
