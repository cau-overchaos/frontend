import { MouseEventHandler, ReactNode } from "react";
import styles from "./popup.module.scss";
import classNames from "classnames";

type Props = {
  children: ReactNode;
  className?: string;
  onCloseClick: () => void;
};

export default function Popup({ children, className, onCloseClick }: Props) {
  const closeWindowOnOutsideClick: MouseEventHandler<HTMLDivElement> = (
    evt
  ) => {
    let now: HTMLElement | null = evt.target as HTMLElement;
    let clickedPopup = false;
    while (now !== null) {
      if (now.classList.contains(styles.popup)) {
        clickedPopup = true;
        break;
      }
      now = now.parentElement;
    }

    if (!clickedPopup) {
      onCloseClick();
    }
  };

  return (
    <div className={styles.container} onClick={closeWindowOnOutsideClick}>
      <div className={classNames(styles.popup, className)}>{children}</div>
    </div>
  );
}
