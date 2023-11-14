import { DetailedStudyroomInfo } from "@/app/api_client/studyroom";
import styles from "./studyroomDetail.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faSpinner,
  faUserCog,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

export default function StudyroomDetails({
  details
}: {
  details: DetailedStudyroomInfo | null;
}) {
  if (details === null) {
    return (
      <div className={styles.loading}>
        <FontAwesomeIcon icon={faSpinner} spin></FontAwesomeIcon>
      </div>
    );
  }
  return (
    <div className={styles.root}>
      <h1>{details.title}</h1>
      <p>
        <ul className={styles.details}>
          <li>
            <FontAwesomeIcon icon={faUserCog}></FontAwesomeIcon>&nbsp;관리자:{" "}
            {details.managerUserIds.join(", ")}
          </li>
          <li>
            <FontAwesomeIcon icon={faCode}></FontAwesomeIcon>&nbsp; 사용
            언어:&nbsp;
            {details.programmingLanguages.map((i) => i.name).join(", ")}
          </li>
          <li>
            <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>&nbsp; 사용자 수:{" "}
            {details.userCount.current}/{details.userCount.maximum}
          </li>
        </ul>
      </p>
      <p>{details.description}</p>
    </div>
  );
}
