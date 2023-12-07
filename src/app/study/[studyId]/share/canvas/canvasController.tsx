import { useState } from "react";
import Canvas, { CanvasProps, Point } from "./canvas";
import styles from "./canvasController.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faEraser,
  faPencil,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

export type CanvasControllerProp = Omit<CanvasProps, "onDraw"> & {
  active: boolean;
  onActiveToggle: (newActiveVal: boolean) => void;
  imageData: ImageData | null;
  onNewImageData: (newVal: ImageData | null) => void;
  onDraw: (a: Point, b: Point, color: string, newImage: ImageData) => void;
  onClear?: () => void;
};

export default function CanvasController(props: CanvasControllerProp) {
  const [erasing, setErasing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("black");
  return (
    <div
      style={{
        width: props.width,
        height: props.height
      }}
      className={classNames(styles.container, props.className)}
    >
      <div className={styles.tools}>
        {["#000000", "#FF0000", "#8B0000", "#0000FF"].map((i) => (
          <a
            href="#"
            className={
              !erasing && props.active && color === i ? styles.active : ""
            }
            style={{ color: i }}
            onClick={(evt) => {
              evt.preventDefault();
              props.onActiveToggle(true);
              setErasing(false);
              setColor(i);
            }}
          >
            <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
          </a>
        ))}
        <a
          href="#"
          className={erasing && props.active ? styles.active : ""}
          onClick={(evt) => {
            evt.preventDefault();
            props.onActiveToggle(true);
            setErasing(true);
          }}
        >
          <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
        </a>
        <a
          href="#"
          onClick={(evt) => {
            evt.preventDefault();
            props.onActiveToggle(true);
            props.onNewImageData(null);
            (props.onClear ?? function () {})();
          }}
        >
          <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
        </a>
        <a
          href="#"
          className={!props.active ? styles.active : ""}
          onClick={(evt) => {
            evt.preventDefault();
            props.onActiveToggle(false);
          }}
        >
          <FontAwesomeIcon icon={faCode}></FontAwesomeIcon>
        </a>
      </div>
      <Canvas
        {...props}
        className=""
        image={props.imageData ?? undefined}
        onDraw={(a, b, img) => {
          props.onNewImageData(img);
          props.onDraw(a, b, color + "80", img);
        }}
        onErase={(a, b, img) => {
          props.onNewImageData(img);
          props.onErase(a, b, img);
        }}
        erasing={erasing}
        color={color + "80"}
      ></Canvas>
    </div>
  );
}
