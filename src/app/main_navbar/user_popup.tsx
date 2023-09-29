import classNames from "classnames";
import styles from "./user_popup.module.scss";
import popupStyles from "./popup.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import apiClient from "../api_client";

type propsType = {
  nickname?: string;
  backgroundUrl?: string;
  loggedIn?: boolean;
};

export default function UserPopup(props: propsType) {
  const doLogout = async () => {
    await apiClient.logout();
    location.href = "/";
  };

  return (
    <div className={popupStyles.container}>
      <div className={popupStyles.popup}>
        <div className={classNames(popupStyles.top, styles.profile)}>
          <div
            className={styles.image}
            style={
              props.backgroundUrl
                ? { backgroundImage: `url(${props.backgroundUrl})` }
                : {}
            }
          ></div>
          <div className={styles.nickname}>{props.nickname ?? "나그네"}</div>
        </div>
        <hr className={popupStyles.divider}></hr>
        <div className={popupStyles.bottom}>
          <ul className={styles.menu}>
            <li>
              {props.loggedIn ? (
                <a href="#" onClick={doLogout}>
                  <FontAwesomeIcon
                    className={styles.icon}
                    icon={faSignOut}
                  ></FontAwesomeIcon>
                  <span>로그아웃</span>
                </a>
              ) : (
                <Link href="/login">
                  <FontAwesomeIcon
                    className={styles.icon}
                    icon={faSignIn}
                  ></FontAwesomeIcon>
                  <span>로그인</span>
                </Link>
              )}
            </li>
            {props.loggedIn && (
              <li>
                <a href="#">
                  <FontAwesomeIcon
                    className={styles.icon}
                    icon={faCog}
                  ></FontAwesomeIcon>
                  <span>설정</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
