import { useEffect, useState } from "react";

export function useCountGridCols(ref) {
  const [cols, setCols] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const updateCols = () => {
      const styles = window.getComputedStyle(ref.current);
      const columnCount = styles
        .getPropertyValue("grid-template-columns")
        .split(" ").length;

      setCols(columnCount);
    };

    updateCols();

    const observer = new ResizeObserver(updateCols);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return cols;
}