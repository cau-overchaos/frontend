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
  myProfileImgUrl?: string;
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
  myProfileImgUrl?: string;
  onCloseButtonClick: () => void;
  onEnter: (message: string) => void;
}) {
  const [message, setMessage] = useState<string>("");

  return (
    <div className={styles.comment}>
      <div
        className={styles.profile}
        style={{
          backgroundImage: `url("${
            props.myProfileImgUrl ?? DefaultProfileImageUrl()
          }")`
        }}
      ></div>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          props.onEnter(message);
        }}
      >
        <input
          type="text"
          placeholder="답댓글을 입력해주세요."
          value={message}
          onChange={(evt) => setMessage(evt.target.value)}
        ></input>
      </form>
      <a
        href="#"
        className={styles.cancelReply}
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
  const [comment, setComment] = useState<string>("");

  return (
    <div className={styles.container}>
      <div className={styles.arrow}>
        <svg width="10" height="10">
          <polygon points="10,0 0,5 10,10" className={styles.fill} />
        </svg>
      </div>
      <div className={styles.commentsPopup}>
        <div className={styles.newComment}>
          <div
            className={styles.profile}
            style={{
              backgroundImage: `url("${
                props.myProfileImgUrl ?? DefaultProfileImageUrl()
              }")`
            }}
          ></div>
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              props.onNewCommentRequest(comment);
            }}
          >
            <input
              type="text"
              placeholder="댓글을 입력해주세요..."
              value={comment}
              onChange={(evt) => setComment(evt.target.value)}
            ></input>
          </form>
        </div>
        <div className={styles.divider} />
        <div className={styles.comments}>
          {props.comments.map((i) => [
            <LineComment
              key={i.id}
              comment={i}
              profileImageUrl={i.profileImgUrl}
              onReplyClick={() => setReplyingTo(i.id)}
            ></LineComment>,
            i.subcomments.length !== 0 || replyingTo === i.id ? (
              <div className={classNames(styles.comments, styles.subcomments)}>
                {i.subcomments
                  .map((j) => (
                    <LineComment
                      key={j.id}
                      subcomment
                      comment={j}
                      profileImageUrl={j.profileImgUrl}
                      onReplyClick={() => setReplyingTo(i.id)}
                    ></LineComment>
                  ))
                  .concat(
                    replyingTo === i.id
                      ? [
                          <ReplyingTo
                            key={i.id + "_replying"}
                            myProfileImgUrl={props.myProfileImgUrl}
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
