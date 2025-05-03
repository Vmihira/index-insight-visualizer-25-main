
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Spinner = ({ className, size = "md" }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-t-3 border-b-3",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div 
        className={cn(
          "animate-spin rounded-full border-t-financial-blue border-b-financial-blue border-r-transparent border-l-transparent",
          sizeClasses[size],
          className
        )}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
