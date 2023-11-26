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
import {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import Canvas from "./canvas/canvas";
import CanvasController from "./canvas/canvasController";
import SocketCanvas from "./canvas/socketCanvas";

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
  commentCount: { [lineNumber: number]: number };
  commentCreator: (line: number) => ReactNode;
  sharedSourceCodeId: number;
};

export default function CommentableCodeViewer(props: Props) {
  const [commentToggledLine, toggleCommenctLine] = useState<number | null>(
    null
  );
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 1,
    height: 1
  });
  const [canvasActive, setCanvasActive] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const changeCanvasSizeOnResize = () => {
    if (containerRef !== null)
      setCanvasSize({
        width: (containerRef.current?.getBoundingClientRect().width ?? 17) - 16,
        height:
          (containerRef.current?.getBoundingClientRect().height ?? 17) - 16
      });
  };

  useEffect(() => {
    changeCanvasSizeOnResize();
    window.addEventListener("resize", changeCanvasSizeOnResize);

    return () => window.removeEventListener("resize", changeCanvasSizeOnResize);
  }, [containerRef, props.code]);

  useEffect(() => {
    const closeCommenctLineOnOutsideClick: (
      this: HTMLElement,
      evt: MouseEvent
    ) => void = (evt) => {
      let now: HTMLElement | null = evt.target as HTMLElement;
      let clickedComment = false;
      while (now !== null) {
        if (typeof now.className === "undefined") {
          now = (now.parentNode as HTMLElement) ?? null;
          continue;
        }
        if (
          typeof now.className === "string" &&
          now.className.includes(styles.comments)
        ) {
          clickedComment = true;
          break;
        }
        now = now.parentNode as HTMLElement;
      }

      if (!clickedComment) toggleCommenctLine(null);
    };

    document.body.addEventListener("click", closeCommenctLineOnOutsideClick);
    return () =>
      document.body.removeEventListener(
        "click",
        closeCommenctLineOnOutsideClick
      );
  });

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
    const activateComment = (
      line: number
    ): MouseEventHandler<HTMLAnchorElement> => {
      return (evt) => {
        evt.preventDefault();
        if (commentToggledLine !== line) toggleCommenctLine(line);
        else toggleCommenctLine(null);
      };
    };

    return html.split("\n").map((line, idx) => (
      <div
        key={idx}
        className={classNames(
          styles.line,
          commentToggledLine === idx ? styles.commentActive : null,
          (props.commentCount[idx + 1] ?? 0) > 0 ? styles.hasComments : null,
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
        <span
          dangerouslySetInnerHTML={{ __html: line }}
          className={styles.lineHtml}
        ></span>
        <span className={styles.commentIcon}>
          &nbsp;
          <a href="#" onClick={activateComment(idx)}>
            <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
            {(props.commentCount[idx + 1] ?? 0) > 0 ? (
              <span className={styles.count}>
                {props.commentCount[idx + 1]}
              </span>
            ) : (
              ""
            )}
          </a>
          {commentToggledLine === idx && (
            <div className={styles.comments}>
              {props.commentCreator(idx + 1)}
            </div>
          )}
        </span>
      </div>
    ));
  };

  return (
    <div
      className={classNames(styles.code, props.className)}
      ref={containerRef}
    >
      <div
        className={classNames(
          styles.canvasContainer,
          !canvasActive && styles.inactive
        )}
      >
        <SocketCanvas
          className={styles.canvas}
          width={canvasSize.width}
          height={canvasSize.height}
          active={canvasActive}
          onActiveToggle={setCanvasActive}
          sharedSourceCodeId={props.sharedSourceCodeId}
        ></SocketCanvas>
      </div>
      {lines(highlightCode(props.code))}
    </div>
  );
}
