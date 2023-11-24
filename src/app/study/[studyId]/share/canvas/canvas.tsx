import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
type Point = {
  x: number;
  y: number;
};

export type CanvasProps = {
  className?: string;
  erasing?: boolean;
  image?: ImageData;
  drawStrokeWidth?: number;
  eraseStrokeWidth?: number;
  color?: CanvasRenderingContext2D["strokeStyle"];
  onDraw: (start: Point, end: Point, newImageData: ImageData) => void;
  onErase: (start: Point, end: Point, newImageData: ImageData) => void;
  width?: number;
  height?: number;
};

export default function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [previousPos, setPreviousPos] = useState<Point | null>(null);
  const canvasWidth = useMemo(
    () => Math.max(props.image?.width ?? 0, props.width ?? 0),
    [props.width, props.height, props.image]
  );
  const canvasHeight = useMemo(
    () => Math.max(props.image?.height ?? 0, props.height ?? 0),
    [props.width, props.height, props.image]
  );
  const offscreenCanvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  if (props.image)
    offscreenCanvas.getContext("2d")?.putImageData(props.image, 0, 0);

  const draw: MouseEventHandler<HTMLCanvasElement> = (evt) => {
    if (canvasRef.current === null || !drawing) return;

    const context = offscreenCanvas.getContext("2d");
    if (context === null) return;

    const endPos = {
      x: evt.clientX - canvasRef.current.getBoundingClientRect().x,
      y: evt.clientY - canvasRef.current.getBoundingClientRect().y
    };
    let lineWidth;
    if (props.erasing) {
      context.globalCompositeOperation = "destination-out";
      lineWidth = props.eraseStrokeWidth ?? 5;
    } else {
      context.globalCompositeOperation = "source-over";
      lineWidth = props.drawStrokeWidth ?? 3;
    }
    const startPos = previousPos ?? endPos;
    setPreviousPos(endPos);
    context.strokeStyle = props.color ?? "black";
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(startPos.x, startPos.y);
    context.lineTo(endPos.x, endPos.y);
    context.stroke();
    context.closePath();

    const newImageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    if (props.erasing) {
      props.onErase(startPos, endPos, newImageData);
    } else {
      props.onDraw(startPos, endPos, newImageData);
    }
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (props.image) context?.putImageData(props.image, 0, 0);
    else {
      context?.clearRect(0, 0, canvasWidth, canvasHeight); // Clear
    }
  }, [props.image, canvasRef, props.width, props.height]);

  return (
    <canvas
      ref={canvasRef}
      width={props.width}
      height={props.height}
      onMouseDown={(evt) => {
        setDrawing(true);
        draw(evt);
      }}
      onMouseLeave={(evt) => {
        setDrawing(false);
        setPreviousPos(null);
      }}
      onMouseMove={(evt) => {
        draw(evt);
      }}
      onMouseUp={(evt) => {
        setDrawing(false);
        setPreviousPos(null);
      }}
      className={props.className}
    ></canvas>
  );
}
