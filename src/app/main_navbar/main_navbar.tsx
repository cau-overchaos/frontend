"use client";

import Link from "next/link";
import responsiveness from "../responsiveness.module.scss";
import styles from "./main_navbar.module.scss";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faSearch,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import UserPopup from "./user_popup";
import NotificationPopup from "./nofitications_popup.module";
import apiClient, { UserProfile } from "../api_client";
import md5 from "md5";
import SearchPopup from "./search_popup";

type MenuItem = {
  name: string;
  href: string;
};

type PropsType = {
  narrowContainer?: boolean;
};

export default function MainNavbar(props: PropsType) {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [userPopupActive, setUserPopupActive] = useState(false);
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const menus: MenuItem[] = [
    {
      name: "내 스터디",
      href: "#"
    },
    {
      name: "스터디원 모집",
      href: "#"
    },
    {
      name: "코딩 테스트 대회",
      href: "#"
    }
  ];

  useEffect(() => {
    const onAuthStateChanged = async () => {
      setUser(await apiClient.me());
    };

    onAuthStateChanged();
    apiClient.on("loggedInOrloggedOut", onAuthStateChanged);
    return () => {
      apiClient.off("loggedInOrloggedOut", onAuthStateChanged);
    };
  });

  const containerClass =
    props.narrowContainer === true
      ? responsiveness.narrowContainer
      : responsiveness.container;
  return (
    <nav className={styles.navbar}>
      <div className={classNames(containerClass, styles.container)}>
        <div className={styles.logo}>
          <Link href="/">알고모여</Link>
        </div>
        <div className={classNames(responsiveness.desktopOnly, styles.menu)}>
          {menus.map((i) => (
            <div className={styles.item} key={i.href}>
              <Link href={i.href}>{i.name}</Link>
            </div>
          ))}
        </div>
        <div className={styles.icons}>
          <div className={styles.item}>
            <Link href="#">
              <FontAwesomeIcon
                icon={faSearch}
                onClick={() => setSearchActive(!searchActive)}
              ></FontAwesomeIcon>
            </Link>
          </div>
          <div className={styles.item}>
            <Link
              href="#"
              onClick={() => {
                setUserPopupActive(false);
                setNotificationsActive(!notificationsActive);
              }}
            >
              <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
            </Link>
            {notificationsActive && <NotificationPopup></NotificationPopup>}
          </div>
          <div className={styles.item}>
            <Link
              href="#"
              onClick={() => {
                setNotificationsActive(false);
                setUserPopupActive(!userPopupActive);
              }}
            >
              <FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon>
            </Link>
            {userPopupActive && (
              <UserPopup
                backgroundUrl={
                  user === null
                    ? "https://www.gravatar.com/avatar/a?d=mp"
                    : user?.profileImage ??
                      `https://www.gravatar.com/avatar/${md5(
                        user?.userId ?? user?.name ?? ""
                      )}?d=identicon`
                }
                nickname={user?.name}
                loggedIn={user !== null}
              ></UserPopup>
            )}
          </div>
          <div className={styles.item}>
            <Link
              href="#"
              onClick={() => setMobileMenuActive(!mobileMenuActive)}
              className={responsiveness.mobileOnly}
            >
              <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
            </Link>
          </div>
        </div>
      </div>
      {mobileMenuActive && (
        <div
          className={classNames(
            styles.mobileMenu,
            responsiveness.mobileOnly,
            responsiveness.container
          )}
        >
          {menus.map((i) => (
            <div className={styles.item} key={i.href}>
              <Link href={i.href} className={styles.item}>
                {i.name}
              </Link>
            </div>
          ))}
        </div>
      )}
      <SearchPopup
        active={searchActive}
        onAutocompleteRequest={async (query) => {
          // TO-DO: impl autocomplete logic
          return [];
        }}
        onSearchRequest={(query) => {
          // TO-DO: impl search logic
          setSearchActive(false);
        }}
        onCloseButtonClick={() => setSearchActive(false)}
      ></SearchPopup>
    </nav>
  );
}
