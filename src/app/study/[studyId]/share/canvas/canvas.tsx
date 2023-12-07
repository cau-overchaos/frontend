import {
  CSSProperties,
  MouseEvent,
  MouseEventHandler,
  TouchEvent,
  TouchEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
export type Point = {
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
  style?: CSSProperties;
};

type CanvasMethod = {
  erasePoints: (start: Point, end: Point) => void;
  drawPoints: (start: Point, end: Point, color: string) => void;
};

export const draw = (
  canvas: {
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    width: number;
    height: number;
  },
  startPos: Point,
  endPos: Point,
  erase?: boolean,
  color: string | CanvasGradient | CanvasPattern = "black",
  lineWidth?: number
): ImageData | null => {
  if (erase ?? true) {
    canvas.context.globalCompositeOperation = "destination-out";
  } else {
    canvas.context.globalCompositeOperation = "source-over";
  }

  canvas.context.strokeStyle = color;
  canvas.context.lineWidth = lineWidth ?? (erase ? 5 : 3);
  canvas.context.beginPath();
  canvas.context.moveTo(startPos.x, startPos.y);
  canvas.context.lineTo(endPos.x, endPos.y);
  canvas.context.stroke();
  canvas.context.closePath();

  return canvas.context.getImageData(0, 0, canvas.width, canvas.height);
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
  let notFire = false;

  if (props.image)
    offscreenCanvas.getContext("2d")?.putImageData(props.image, 0, 0);

  const drawOnTouch: TouchEventHandler<HTMLCanvasElement> = (evt) => {
    drawOnClientPos(evt.touches[0].clientX, evt.touches[0].clientY);
  };

  const drawOnClick: MouseEventHandler<HTMLCanvasElement> = (
    evt: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {
    drawOnClientPos(evt.clientX, evt.clientY);
  };

  const drawOnClientPos = (x: number, y: number) => {
    if (canvasRef.current === null || !drawing) return;
    if (notFire) return;
    else notFire = true;

    const context = offscreenCanvas.getContext("2d");
    if (context === null) return;

    const endPos = {
      x: x - canvasRef.current.getBoundingClientRect().x,
      y: y - canvasRef.current.getBoundingClientRect().y
    };
    const startPos = previousPos ?? endPos;
    setPreviousPos(endPos);
    const newImageData = draw(
      {
        context,
        width: canvasWidth,
        height: canvasHeight
      },
      startPos,
      endPos,
      props.erasing,
      props.color ?? "black"
    );

    if (newImageData === null) {
      return;
    } else if (props.erasing) {
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
      style={props.style}
      onMouseDown={(evt) => {
        setDrawing(true);
        drawOnClick(evt);
      }}
      onMouseLeave={(evt) => {
        setDrawing(false);
        setPreviousPos(null);
      }}
      onMouseMove={(evt) => {
        drawOnClick(evt);
      }}
      onMouseUp={(evt) => {
        setDrawing(false);
        setPreviousPos(null);
      }}
      onTouchStart={(evt) => {
        setDrawing(true);
        drawOnTouch(evt);
      }}
      onTouchMove={(evt) => {
        drawOnTouch(evt);
      }}
      onTouchEnd={(evt) => {
        setDrawing(false);
        setPreviousPos(null);
      }}
      className={props.className}
    ></canvas>
  );
}
