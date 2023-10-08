import classNames from "classnames";
import styles from "./people.module.scss";
import SolvedAcTier from "../assignments/solved_ac_tier";
import { Button } from "@/app/common/inputs";
import DefaultProfileImageUrl from "@/app/default_profile_image_url";

export function Person() {
  return (
    <div className={styles.person}>
      <div className={classNames(styles.line, styles.user)}>
        <img className={styles.profileImg} src={DefaultProfileImageUrl()}></img>
        <div className={styles.nickname}>테스트</div>
      </div>
      <div className={classNames(styles.line, styles.typeAndBojId)}>
        <div className={styles.type}>관리자</div>
        <div className={styles.bojId}>BOJ: testBoj</div>
      </div>
      <div className={styles.tier}>
        <SolvedAcTier level={5}></SolvedAcTier>
      </div>
      <div className={styles.actions}>
        <Button small>삭제</Button>
        <Button small>관리자 권한 부여</Button>
      </div>
    </div>
  );
}

export default function People() {
  return (
    <div className={styles.container}>
      <h1>인원</h1>

      <div className={styles.people}>
        <Person></Person>
        <Person></Person>
        <Person></Person>
        <Person></Person>
        <Person></Person>
        <Person></Person>
        <Person></Person>
        <Person></Person>
        <Person></Person>
      </div>
    </div>
  );
}
