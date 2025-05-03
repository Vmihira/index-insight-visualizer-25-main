
export interface IndexData {
  index_name: string;
  index_date: string;
  open_index_value: string;
  high_index_value: string;
  low_index_value: string;
  closing_index_value: string;
  points_change: string;
  change_percent: string;
  volume: string;
  turnover_rs_cr: string;
  pe_ratio: string;
  pb_ratio: string;
  div_yield: string;
}

export function parseCSV(csvText: string): IndexData[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.replace(/"/g, ''));
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.replace(/"/g, ''));
    const entry: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });
    
    return entry as unknown as IndexData;
  });
}

export function getUniqueIndexNames(data: IndexData[]): string[] {
  const uniqueNames = new Set<string>();
  data.forEach(item => {
    if (item.index_name) {
      uniqueNames.add(item.index_name);
    }
  });
  return Array.from(uniqueNames);
}

export function formatValue(value: string): string {
  if (value === "NaN" || !value) {
    return "N/A";
  }
  
  // Try to parse as a number
  const num = parseFloat(value);
  if (isNaN(num)) {
    return value;
  }
  
  // Format numbers with appropriate commas and decimals
  return num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

export function isPositiveChange(value: string): boolean | null {
  if (value === "NaN" || !value) {
    return null;
  }
  
  const num = parseFloat(value);
  if (isNaN(num)) {
    return null;
  }
  
  return num > 0;
}
