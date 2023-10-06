import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./article.module.scss";
import formatDate from "./formatDate";
import {
  faAngleLeft,
  faClock,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props = {
  title: string;
  author: string;
  date: Date;
  listHref: string;
  contentHtml: string;
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
      </ul>
      <p
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: props.contentHtml
        }}
      ></p>
    </div>
  );
}
