import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/themes/prism.css";
import styles from "./commentableCodeViewer.module.scss";
import { IdeHighlighterType } from "../ide/ide";
import { encode } from "html-entities";
import classNames from "classnames";
import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export enum DiffType {
  Add,
  Delete,
  Normal
}

export type Props = {
  highlight: IdeHighlighterType;
  code: string;
  className?: string;
  diffs?: DiffType[];
  linePadding?: string;
  onCommentClick: (line: number) => ReactNode;
};

export default function CommentableCodeViewer(props: Props) {
  const highlightCode = (code: string) => {
    switch (props.highlight) {
      case IdeHighlighterType.C:
        return highlight(code, languages.c, "c");
      case IdeHighlighterType.Cpp:
        return highlight(code, languages.cpp, "cpp");
      case IdeHighlighterType.Java:
        return highlight(code, languages.java, "java");
      case IdeHighlighterType.Javascript:
        return highlight(code, languages.javascript, "javascript");
      case IdeHighlighterType.Python:
        return highlight(code, languages.python, "python");
      default:
        return encode(code);
    }
  };

  const lines = (html: string): ReactNode[] => {
    return html.split("\n").map((line, idx) => (
      <div
        className={classNames(
          styles.line,
          (props.diffs ?? [])[idx] === DiffType.Add
            ? styles.add
            : (props.diffs ?? [])[idx] === DiffType.Delete
            ? styles.delete
            : null
        )}
        style={{
          padding: props.linePadding
        }}
      >
        <span dangerouslySetInnerHTML={{ __html: line }}></span>
        <span className={styles.commentIcon}>
          &nbsp;
          <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
          <div className={styles.comments}>{props.onCommentClick(idx)}</div>
        </span>
      </div>
    ));
  };

  return (
    <div className={classNames(styles.code, props.className)}>
      {lines(highlightCode(props.code))}
    </div>
  );
}
