
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const IndexList = () => {
  const { indexNames, selectedIndex, setSelectedIndex } = useData();

  return (
    <div className="h-full w-full overflow-auto bg-sidebar p-4">
      <h2 className="text-xl font-bold mb-6 px-2 text-sidebar-foreground border-b pb-3 flex items-center">
        <span className="bg-financial-blue rounded-md w-2 h-6 mr-2"></span>
        Stock Indexes
      </h2>
      <ul className="space-y-0.5">
        {indexNames.map((indexName) => (
          <li key={indexName}>
            <button
              onClick={() => setSelectedIndex(indexName)}
              className={cn(
                "w-full text-left px-3 py-3 rounded-md transition-all flex items-center justify-between group",
                selectedIndex === indexName
                  ? "bg-financial-blue text-white shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <span className={cn("font-medium", selectedIndex === indexName ? "font-semibold" : "")}>{indexName}</span>
              {selectedIndex === indexName && (
                <ChevronRight className="h-4 w-4 text-white" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndexList;
