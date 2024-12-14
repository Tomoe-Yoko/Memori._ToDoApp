import { RefObject } from "react";

export const handleMouseDown = (
  e: React.MouseEvent,
  isDragging: React.MutableRefObject<boolean>,
  startX: React.MutableRefObject<number>,
  scrollLeft: React.MutableRefObject<number>,
  tabContainerRef: RefObject<HTMLDivElement>
) => {
  isDragging.current = true;
  startX.current = e.pageX - (tabContainerRef.current?.offsetLeft || 0);
  scrollLeft.current = tabContainerRef.current?.scrollLeft || 0;
};

export const handleMouseLeaveOrUp = (
  isDragging: React.MutableRefObject<boolean>
) => {
  isDragging.current = false;
};

export const handleMouseMove = (
  e: React.MouseEvent,
  isDragging: React.MutableRefObject<boolean>,
  startX: React.MutableRefObject<number>,
  scrollLeft: React.MutableRefObject<number>,
  tabContainerRef: RefObject<HTMLDivElement>
) => {
  if (!isDragging.current) return;
  e.preventDefault();
  const x = e.pageX - (tabContainerRef.current?.offsetLeft || 0);
  const walk = (x - startX.current) * 2; // スクロール速度を調整
  if (tabContainerRef.current) {
    tabContainerRef.current.scrollLeft = scrollLeft.current - walk;
  }
};

export const handleWheel = (
  event: WheelEvent,
  tabContainerRef: RefObject<HTMLDivElement>
) => {
  if (tabContainerRef.current) {
    tabContainerRef.current.scrollLeft += event.deltaY;
  }
};
