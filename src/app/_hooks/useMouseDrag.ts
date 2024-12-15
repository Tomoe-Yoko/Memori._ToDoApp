import { useRef, useEffect, RefObject } from "react";

export const useMouseDrag = (tabContainerRef: RefObject<HTMLDivElement>) => {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (tabContainerRef.current?.offsetLeft || 0);
    scrollLeft.current = tabContainerRef.current?.scrollLeft || 0;
  };

  const handleMouseLeaveOrUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (tabContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2; // スクロール速度を調整
    if (tabContainerRef.current) {
      tabContainerRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  useEffect(() => {
    const container = tabContainerRef.current;
    if (container) {
      const handleWheel = (event: WheelEvent) => {
        container.scrollLeft += event.deltaY;
      };
      container.addEventListener("wheel", handleWheel);
      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [tabContainerRef]);

  return {
    handleMouseDown,
    handleMouseLeaveOrUp,
    handleMouseMove,
  };
};
