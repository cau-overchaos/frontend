import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./article.module.scss";
import formatDate from "./formatDate";
import {
  faAngleLeft,
  faCalendar,
  faClock,
  faTag,
  faTags,
  faUser,
  faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  title: string;
  author: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  wantedCount?: number;
  date: Date;
  listHref: string;
  children: ReactNode;
};

export default function Article(props: Props) {
  return (
    <div className={styles.article}>
      <Link href={props.listHref} className={styles.goToList}>
        <FontAwesomeIcon icon={faAngleLeft}></FontAwesomeIcon>&nbsp;게시글
        목록으로
      </Link>
      <h1 className={styles.title}>{props.title}</h1>
      <ul className={styles.info}>
        <li>
          <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>{" "}
          {formatDate(props.date, true)}
        </li>
        <li>
          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> {props.author}
        </li>
        {(props.startDate || props.endDate) && (
          <li>
            <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>&nbsp;
            {props.startDate ? formatDate(props.startDate) : ""} ~&nbsp;
            {props.endDate ? formatDate(props.endDate) : ""}
          </li>
        )}
        {props.wantedCount && (
          <li>
            <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>&nbsp;
            {props.wantedCount}인 필요
          </li>
        )}
        {(props.tags?.length ?? 0) > 0 && (
          <li>
            <FontAwesomeIcon
              icon={props.tags?.length === 1 ? faTag : faTags}
            ></FontAwesomeIcon>
            &nbsp;
            {props.tags?.join(", ")}
          </li>
        )}
      </ul>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
}
