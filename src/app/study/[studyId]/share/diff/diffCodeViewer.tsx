import { IdeHighlighterType } from "../../ide/ide";
import CommentableCodeViewer, { DiffType } from "../commentableCodeViewer";
import styles from "./diffCodeViewer.module.scss";

type Props = {
  highlight: IdeHighlighterType;
  left: {
    code: string;
    diffs: DiffType[];
  };
  right: {
    code: string;
    diffs: DiffType[];
  };
};

export default function DiffCodeViewer(props: Props) {
  return (
    <div className={styles.codes}>
      <CommentableCodeViewer
        linePadding="0px 25px"
        highlight={props.highlight}
        code={props.left.code}
        className={styles.left}
        diffs={props.left.diffs}
        commentCreator={() => <div></div>}
        commentCount={{}}
      ></CommentableCodeViewer>
      <CommentableCodeViewer
        linePadding="0px 25px"
        highlight={props.highlight}
        code={props.right.code}
        className={styles.right}
        diffs={props.right.diffs}
        commentCreator={() => <div></div>}
        commentCount={{}}
      ></CommentableCodeViewer>
    </div>
  );
}
