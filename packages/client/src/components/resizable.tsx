import "./resizable.css";
import { FC, useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
}

const Resizable: FC<ResizableProps> = ({ direction, children }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(innerWidth * 0.75);

  useEffect(() => {
    let timer: any;
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);
      });
    };
    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, [innerWidth, width]);

  useEffect(() => {
    if (innerWidth * 0.75 < width) {
      setWidth(innerWidth * 0.75);
    }
  }, [innerWidth, width]);

  const resizableProps: Record<typeof direction, ResizableBoxProps> = {
    horizontal: {
      width,
      height: Infinity,
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.75, Infinity],
      resizeHandles: ["e"],
      className: "resize-horizontal",
      onResizeStop: (event, { size: { width } }) => {
        setWidth(width);
      },
    },
    vertical: {
      width: Infinity,
      height: 300,
      resizeHandles: ["s"],
      minConstraints: [Infinity, 50],
      maxConstraints: [Infinity, innerHeight * 0.9],
    },
  };

  return <ResizableBox {...resizableProps[direction]}>{children}</ResizableBox>;
};

export default Resizable;
