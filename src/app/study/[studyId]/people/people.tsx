"use client";

import classNames from "classnames";
import styles from "./people.module.scss";
import SolvedAcTier from "../assignments/solved_ac_tier";
import { Button } from "@/app/common/inputs";
import DefaultProfileImageUrl from "@/app/default_profile_image_url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

type PersonProps = {
  nickname: string;
  profileImgUrl?: string;
  admin: boolean;
  bojId: string;
  solvedTier: number;
  adminMode: boolean;
  onDeleteClick: () => void;
  onAuthorityClick: () => void;
};

type PeopleProps = {
  inviteButton: boolean;
  onInviteClick: () => void;
  children?: ReactNode;
};

export function Person(props: PersonProps) {
  return (
    <div className={styles.person}>
      <div className={classNames(styles.line, styles.user)}>
        <img
          className={styles.profileImg}
          src={props.profileImgUrl ?? DefaultProfileImageUrl()}
        ></img>
        <div className={styles.nickname}>{props.nickname}</div>
      </div>
      <div className={classNames(styles.line, styles.typeAndBojId)}>
        <div className={styles.type}>{props.admin ? "관리자" : "스터디원"}</div>
        <div className={styles.bojId}>BOJ: {props.bojId}</div>
      </div>
      <div className={styles.tier}>
        <SolvedAcTier level={props.solvedTier}></SolvedAcTier>
      </div>
      <div className={styles.actions}>
        {props.adminMode && (
          <Button small onClick={props.onDeleteClick}>
            삭제
          </Button>
        )}
        {props.adminMode && (
          <Button small onClick={props.onAuthorityClick}>
            관리자 권한 {props.admin ? "해제" : "부여"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function People(props: PeopleProps) {
  return (
    <div className={styles.container}>
      <h1>인원</h1>

      <div className={styles.people}>
        {props.children}
        {props.inviteButton && (
          <div className={styles.invite} onClick={props.onInviteClick}>
            <div className={styles.icon}>
              <FontAwesomeIcon icon={faUserPlus}></FontAwesomeIcon>
            </div>
            <div>스터디원 초대</div>
          </div>
        )}
      </div>
    </div>
  );
}
