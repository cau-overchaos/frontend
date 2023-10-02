import classNames from "classnames";
import styles from "./lineComments.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faReply } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DefaultProfileImageUrl from "@/app/default_profile_image_url";

type SubComment = {
  id: string;
  authorId: string;
  profileImgUrl: string | null;
  content: string;
};
type Comment = SubComment & { subcomments: SubComment[] };

type Props = {
  comments: Comment[];
  onNewCommentRequest: (message: string) => void;
  onNewSubcommentRequest: (message: string, replyTo: string) => void;
};

type CommentProps = {
  profileImageUrl?: string | null;
  comment: SubComment;
  onReplyClick: () => void;
  subcomment?: boolean;
};

function LineComment(props: CommentProps) {
  return (
    <div className={styles.comment}>
      <div
        className={styles.profile}
        style={{
          backgroundImage: `url("${
            props.profileImageUrl ?? DefaultProfileImageUrl()
          }")`
        }}
      ></div>
      <div className={styles.content}>{props.comment.content}</div>
      <div className={styles.replyTo}>
        <a
          href="#"
          onClick={(evt) => {
            evt.preventDefault();
            props.onReplyClick();
          }}
        >
          <FontAwesomeIcon icon={faReply}></FontAwesomeIcon>
        </a>
      </div>
    </div>
  );
}

function ReplyingTo(props: {
  onCloseButtonClick: () => void;
  onEnter: (message: string) => void;
}) {
  return (
    <div className={styles.comment}>
      <div className={styles.profile}></div>
      <input
        type="text"
        placeholder="답댓글을 입력해주세요."
        onKeyUp={(evt) => {
          if (evt.key === "Enter") {
            props.onEnter((evt.target as HTMLInputElement).value);
            evt.preventDefault();
          }
        }}
      ></input>
      <a
        href="#"
        onClick={(evt) => {
          evt.preventDefault();
          props.onCloseButtonClick();
        }}
      >
        <FontAwesomeIcon icon={faClose}></FontAwesomeIcon>
      </a>
    </div>
  );
}

export default function LineComments(props: Props) {
  const [replyingTo, setReplyingTo] = useState<string | null>();

  return (
    <div className={styles.container}>
      <div className={styles.arrow}>
        <svg width="10" height="10">
          <polygon points="10,0 0,5 10,10" fill="#EBFFE5" />
        </svg>
      </div>
      <div className={styles.commentsPopup}>
        <div className={styles.newComment}>
          <div className={styles.profile}></div>
          <input
            type="text"
            placeholder="댓글을 입력해주세요..."
            onKeyUp={(evt) => {
              if (evt.key === "Enter") {
                props.onNewCommentRequest(
                  (evt.target as HTMLInputElement).value
                );
                evt.preventDefault();
              }
            }}
          ></input>
        </div>
        <div className={styles.divider} />
        <div className={styles.comments}>
          {props.comments.map((i) => [
            <LineComment
              comment={i}
              onReplyClick={() => setReplyingTo(i.id)}
            ></LineComment>,
            i.subcomments.length !== 0 || replyingTo === i.id ? (
              <div className={classNames(styles.comments, styles.subcomments)}>
                {i.subcomments
                  .map((j) => (
                    <LineComment
                      subcomment
                      comment={j}
                      onReplyClick={() => setReplyingTo(i.id)}
                    ></LineComment>
                  ))
                  .concat(
                    replyingTo === i.id
                      ? [
                          <ReplyingTo
                            onCloseButtonClick={() => setReplyingTo(null)}
                            onEnter={(message) =>
                              props.onNewSubcommentRequest(message, i.id)
                            }
                          ></ReplyingTo>
                        ]
                      : []
                  )}
              </div>
            ) : null
          ])}
        </div>
      </div>
    </div>
  );
}
