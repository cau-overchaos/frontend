import { useState } from "react";
import Canvas, { CanvasProps } from "./canvas";
import styles from "./canvasController.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

type CanvasControllerProp = Omit<CanvasProps, "onDraw" | "onErase">;

export default function CanvasController(props: CanvasControllerProp) {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [erasing, setErasing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("black");
  return (
    <div
      style={{ width: props.width, height: props.height }}
      className={classNames(styles.container, props.className)}
    >
      <div className={styles.tools}>
        {["black", "red", "darkred", "blue"].map((i) => (
          <a
            href="#"
            className={!erasing && color === i ? styles.active : ""}
            style={{ color: i }}
            onClick={(evt) => {
              evt.preventDefault();
              setErasing(false);
              setColor(i);
            }}
          >
            <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
          </a>
        ))}
        <a
          href="#"
          className={erasing ? styles.active : ""}
          onClick={(evt) => {
            evt.preventDefault();
            setErasing(true);
          }}
        >
          <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
        </a>
        <a
          href="#"
          onClick={(evt) => {
            evt.preventDefault();
            setImageData(null);
          }}
        >
          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
        </a>
      </div>
      <Canvas
        {...props}
        className=""
        image={imageData ?? undefined}
        onDraw={(_, __, img) => setImageData(img)}
        onErase={(_, __, img) => setImageData(img)}
        erasing={erasing}
        color={color}
      ></Canvas>
    </div>
  );
}
