"use client";

import { ReactNode, useState } from "react";
import styles from "./comments.module.scss";
import { Button, Input } from "@/app/common/inputs";
import DefaultProfileImageUrl from "@/app/default_profile_image_url";

type CommentProp = {
  inviteButton: boolean;
  onInviteClick: () => void;
  comment: string;
  nickname: string;
  profileImgUrl?: string;
};

type CommentsProp = {
  children: ReactNode;
  profileImgUrl?: string;
  onNewComment: (comment: string) => void;
};

export function Comment(props: CommentProp) {
  return (
    <div className={styles.comment}>
      <div
        className={styles.profileImg}
        style={{
          backgroundImage: `url("${
            props.profileImgUrl ?? DefaultProfileImageUrl()
          }")`
        }}
      ></div>
      <div className={styles.content}>
        {props.comment}{" "}
        <span className={styles.author}>--{props.nickname}</span>
      </div>
      {props.inviteButton && (
        <div className={styles.inviteBtn}>
          <Button small onClick={props.onInviteClick}>
            초대
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Comments(props: CommentsProp) {
  const [newComment, setNewComment] = useState<string>("");

  return (
    <div className={styles.comments}>
      <hr></hr>
      <form
        className={styles.newComment}
        onSubmit={(evt) => {
          evt.preventDefault();
          props.onNewComment(newComment);
        }}
      >
        <div
          className={styles.profileImg}
          style={{
            backgroundImage: `url("${
              props.profileImgUrl ?? DefaultProfileImageUrl()
            }")`
          }}
        ></div>
        <div className={styles.input}>
          <Input
            placeholder="새 댓글을 입력해주세요..."
            value={newComment}
            onChange={(evt) => setNewComment(evt.target.value)}
          ></Input>
        </div>
      </form>
      {props.children}
    </div>
  );
}
