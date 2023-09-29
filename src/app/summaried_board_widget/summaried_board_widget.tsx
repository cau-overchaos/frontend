import { ReactNode } from "react";
import styles from "./summaried_board_widget.module.scss";
import Link from "next/link";

type BoardWidgetPropsType = {
  boardName: string;
  children?: ReactNode | ReactNode[];
};

type ArticlePropTypes = {
  title: string;
  href: string;
  tags: string[];
  startDate: Date;
  dueDate: Date;
};

function formatDate(date: Date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export default function SummariedBoardWidget(props: BoardWidgetPropsType) {
  return (
    <div className={styles.widget}>
      <h2 className={styles.boardName}>{props.boardName}</h2>
      <ul className={styles.articles}>{props.children}</ul>
    </div>
  );
}

export function SummariedArticle(props: ArticlePropTypes) {
  return (
    <li className={styles.article}>
      <Link href={props.href}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.dueDate}>
          신청 마감일: {formatDate(props.startDate)}
        </div>
        <div className={styles.startDate}>
          개최일: {formatDate(props.dueDate)}
        </div>
        <ul className={styles.tags}>
          {props.tags.map((i) => (
            <li className={styles.tag} key={i}>
              {i}
            </li>
          ))}
        </ul>
      </Link>
    </li>
  );
}
