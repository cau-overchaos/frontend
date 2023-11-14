import { ReactNode } from "react";
import styles from "./comments.module.scss";

type CommentProp = {
  inviteButton: boolean;
  onInviteClick: () => void;
  comment: string;
  nickname: string;
  profileImgUrl?: string;
};

type CommentsProp = {
  children: ReactNode;
  onNewComment: (comment: string) => void;
};

export function Comment() {}

export default function Comments(props: CommentsProp) {
  return (
    <div className={styles.comments}>
      <form className={styles.newComment}></form>
    </div>
  );
}
