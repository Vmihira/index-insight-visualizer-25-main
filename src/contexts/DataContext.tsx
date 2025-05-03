
import React, { createContext, useState, useContext, useEffect } from "react";
import { parseCSV, IndexData, getUniqueIndexNames } from "../utils/csvParser";

interface DataContextType {
  data: IndexData[];
  loading: boolean;
  error: string | null;
  selectedIndex: string | null;
  indexNames: string[];
  setSelectedIndex: (indexName: string) => void;
  getSelectedIndexData: () => IndexData | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [indexNames, setIndexNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This is where we would normally fetch the CSV from a server
        // For this example, we're using a hardcoded sample
        const response = await fetch("/dump.csv");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        
        setData(parsedData);
        
        const names = getUniqueIndexNames(parsedData);
        setIndexNames(names);
        
        // Set the first index as selected by default
        if (names.length > 0) {
          setSelectedIndex(names[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSelectedIndexData = (): IndexData | null => {
    if (!selectedIndex) return null;
    return data.find(item => item.index_name === selectedIndex) || null;
  };

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        selectedIndex,
        indexNames,
        setSelectedIndex,
        getSelectedIndexData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
