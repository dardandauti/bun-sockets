// components/Cursor

import { useRef, useCallback, useLayoutEffect } from "react";
import { usePerfectCursor } from "../hooks/useCursor";

export function Cursor({
  point,
  color,
  name,
}: {
  point: number[];
  color: string;
  name: string;
}) {
  const rCursor = useRef<SVGSVGElement>(null);

  const animateCursor = useCallback((point: number[]) => {
    const elm = rCursor.current;
    if (!elm) return;
    elm.style.setProperty(
      "transform",
      `translate(${point[0]}px, ${point[1]}px)`
    );
  }, []);

  const onPointMove = usePerfectCursor(animateCursor);

  useLayoutEffect(() => onPointMove(point), [onPointMove, point]);

  return (
    <div>
      <svg
        ref={rCursor}
        width="22"
        height="24"
        viewBox="0 0 22 24"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill={color}
        fillRule="evenodd"
      >
        <path
          d="M0.839502 2.81347C0.839502 1.27386 2.50617 0.311616 3.8395 1.08142L20.3395 10.6077C21.6728 11.3775 21.6728 13.302 20.3395 14.0718L3.8395 23.5981C2.50617 24.3679 0.839502 23.4056 0.839502 21.866L0.839502 2.81347Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
