"use client";

import { Button } from "@/app/common/inputs";
import { IdeHighlighterType } from "../../ide/ide";
import styles from "./page.module.scss";
import LineComments from "../lineComments";
import SharedCodeViewer from "./sharedCodeViewer";
import { useEffect, useState } from "react";
import { SharedSourceCode } from "@/app/api_client/studyroom";
import { useParams } from "next/navigation";
import apiClient, { UserProfile } from "@/app/api_client/api_client";
import { LineFeedbackWithChildren } from "@/app/api_client/feedbacks";
import gravatarUrl from "@/app/gravatarUrl";
import SolvedAcTier from "../../assignments/solved_ac_tier";
import Article from "@/app/board/article";
import DefaultProfileImageUrl from "@/app/default_profile_image_url";

function ApiLineComment(props: {
  roomId: number;
  sharedSrcCodeId: number;
  lineNumber: number;
  me: UserProfile | null;
  onNewComment: () => void;
}) {
  const [loading, setLoading] = useState<"firstLoading" | "loading" | "loaded">(
    "firstLoading"
  );
  const [comments, setComments] = useState<LineFeedbackWithChildren[] | null>(
    null
  );

  useEffect(() => {
    if (loading === "firstLoading") {
      setLoading("loading");
      apiClient
        .studyroom(props.roomId)
        .getSharedSourceCodeById(props.sharedSrcCodeId)
        .then((i) => i.getFeedback().getFeedbacksByLineNumber(props.lineNumber))
        .then(setComments)
        .then((i) => setLoading("loaded"));
    }
  }, [loading]);

  return (
    <LineComments
      myProfileImgUrl={
        props.me === null
          ? DefaultProfileImageUrl()
          : gravatarUrl(null, props.me.userId, props.me.name)
      }
      comments={
        comments?.map((i) => ({
          authorId: i.writer.nickname,
          content: i.comment,
          id: i.id.toString(),
          profileImgUrl: gravatarUrl(null, i.writer.id, i.writer.nickname),
          subcomments: i.children.map((j) => ({
            authorId: j.writer.nickname,
            content: j.comment,
            id: j.id.toString(),
            profileImgUrl: gravatarUrl(null, j.writer.id, j.writer.nickname)
          }))
        })) ?? []
      }
      onNewCommentRequest={(message) => {
        apiClient
          .studyroom(props.roomId)
          .getSharedSourceCodeById(props.sharedSrcCodeId)
          .then((i) =>
            i.getFeedback().postFeedback({
              comment: message,
              lineNumber: props.lineNumber
            })
          )
          .then(() => setLoading("firstLoading"))
          .then(props.onNewComment);
      }}
      onNewSubcommentRequest={(message, replyTo) => {
        apiClient
          .studyroom(props.roomId)
          .getSharedSourceCodeById(props.sharedSrcCodeId)
          .then((i) =>
            i.getFeedback().postFeedback({
              comment: message,
              lineNumber: props.lineNumber,
              replyToId: parseInt(replyTo)
            })
          )
          .then(() => setLoading("firstLoading"))
          .then(props.onNewComment);
      }}
    ></LineComments>
  );
}

export default function ViewCode() {
  const params = useParams();
  const [sharedSourceCode, setSharedSourceCode] =
    useState<SharedSourceCode | null>(null);
  const [commentCount, setCommentCount] = useState<{
    [lineNumber: number]: number;
  } | null>(null);
  const [commentCountLoading, setCommentCountLoading] = useState<boolean>(true);
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [me, setMe] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (me === null) apiClient.me().then(setMe);
  }, [me]);

  const studyroomClient = apiClient.studyroom(
    parseInt(params.studyId as string)
  );

  useEffect(() => {}, [commentCount]);

  useEffect(() => {
    if (
      sharedSourceCode === null ||
      commentCount === null ||
      commentCountLoading
    ) {
      studyroomClient
        .getSharedSourceCodeById(parseInt(params.codeId as string))
        .then((i) => {
          setSharedSourceCode(i);
          return i.getFeedback().countFeedbacks();
        })
        .then(setCommentCount)
        .then(() => setCommentCountLoading(false));
    }
  }, [sharedSourceCode, commentCount, commentCountLoading]);

  useEffect(() => {
    if (sharedSourceCode !== null && sourceCode === null)
      sharedSourceCode.getSourceCode().then(setSourceCode);
  }, [sharedSourceCode, sourceCode]);

  let highligherType: IdeHighlighterType = IdeHighlighterType.C;
  if (sharedSourceCode?.language.name.toLowerCase().includes("python"))
    highligherType = IdeHighlighterType.Python;
  else if (sharedSourceCode?.language.name.toLowerCase().includes("javascript"))
    highligherType = IdeHighlighterType.Javascript;
  else if (sharedSourceCode?.language.name.toLowerCase().includes("java"))
    highligherType = IdeHighlighterType.Java;
  else if (sharedSourceCode?.language.name.toLowerCase().includes("c++"))
    highligherType = IdeHighlighterType.Cpp;

  return (
    <div className={styles.container}>
      <Article
        author={sharedSourceCode?.writer.nickname ?? ""}
        title={sharedSourceCode?.title ?? ""}
        date={sharedSourceCode?.createdAt ?? new Date(1970, 1, 1)}
        problem={sharedSourceCode?.problem}
        language={sharedSourceCode?.language.name}
        listHref="../share"
      >
        <SharedCodeViewer
          code={sourceCode ?? ""}
          highlight={highligherType}
          className={styles.code}
          commentCount={commentCount ?? {}}
          commentCreator={(line) => (
            <ApiLineComment
              me={me}
              roomId={parseInt(params.studyId as string)}
              lineNumber={line}
              sharedSrcCodeId={parseInt(params.codeId as string)}
              onNewComment={() => setCommentCountLoading(true)}
            ></ApiLineComment>
          )}
        ></SharedCodeViewer>
      </Article>
    </div>
  );

  /*return (
    <div className={styles.container}>
      <Button>풀이 비교</Button>
      <h1>코드 공유 - {sharedSourceCode?.title ?? "로딩중"}</h1>
      <p className={styles.description}>
        문제:&nbsp;
        <SolvedAcTier
          level={sharedSourceCode?.problem.difficultyLevel ?? 0}
        ></SolvedAcTier>
        &nbsp;
        {sharedSourceCode?.problem.title}
        <br />
      </p>
      <SharedCodeViewer
        code={sourceCode ?? ""}
        highlight={highligherType}
        className={styles.code}
        onCommentClick={(line) => (
          <ApiLineComment
            roomId={parseInt(params.studyId as string)}
            lineNumber={line}
            sharedSrcCodeId={parseInt(params.codeId as string)}
          ></ApiLineComment>
        )}
      ></SharedCodeViewer>
    </div>
  );*/
}
