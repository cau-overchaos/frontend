import classNames from "classnames";
import CommentableCodeViewer, {
  Props as CodeViewerProps
} from "../commentableCodeViewer";
import styles from "./sharedCodeViewer.module.scss";

export default function SharedCodeViewer(props: CodeViewerProps) {
  return (
    <CommentableCodeViewer
      {...props}
      className={classNames(props.className, styles.code)}
    ></CommentableCodeViewer>
  );
}
