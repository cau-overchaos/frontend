import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import styles from "./popup.module.scss";
import classNames from "classnames";

type Props = {
  children: ReactNode;
  className?: string;
  onCloseClick: () => void;
  containerStyles?: CSSProperties;
  popupStyles?: CSSProperties;
};

export default function Popup({
  children,
  className,
  onCloseClick,
  containerStyles,
  popupStyles
}: Props) {
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
    <div
      className={classNames(styles.container)}
      style={containerStyles}
      onClick={closeWindowOnOutsideClick}
    >
      <div className={classNames(styles.popup, className)} style={popupStyles}>
        {children}
      </div>
    </div>
  );
}
