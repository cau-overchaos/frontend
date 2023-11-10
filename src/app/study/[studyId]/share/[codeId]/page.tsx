"use client";

import { Button } from "@/app/common/inputs";
import { IdeHighlighterType } from "../../ide/ide";
import styles from "./page.module.scss";
import LineComments from "../lineComments";
import SharedCodeViewer from "./sharedCodeViewer";
import { useEffect, useState } from "react";
import { SharedSourceCode } from "@/app/api_client/studyroom";
import { useParams } from "next/navigation";
import apiClient from "@/app/api_client/api_client";
import { LineFeedbackWithChildren } from "@/app/api_client/feedbacks";
import gravatarUrl from "@/app/gravatarUrl";

function ApiLineComment(props: {
  roomId: number;
  sharedSrcCodeId: number;
  lineNumber: number;
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
      comments={
        comments?.map((i) => ({
          authorId: i.writer.nickname,
          content: i.comment,
          id: i.id.toString(),
          profileImgUrl: gravatarUrl(null, i.writer.nickname, i.writer.id),
          subcomments: i.children.map((j) => ({
            authorId: j.writer.nickname,
            content: j.comment,
            id: j.id.toString(),
            profileImgUrl: gravatarUrl(null, j.writer.nickname, j.writer.id)
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
          .then(() => setLoading("firstLoading"));
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
          .then(() => setLoading("firstLoading"));
      }}
    ></LineComments>
  );
}

export default function ViewCode() {
  const params = useParams();
  const [sharedSourceCode, setSharedSourceCode] =
    useState<SharedSourceCode | null>(null);
  const [sourceCode, setSourceCode] = useState<string | null>(null);

  const studyroomClient = apiClient.studyroom(
    parseInt(params.studyId as string)
  );

  useEffect(() => {
    if (sharedSourceCode === null) {
      studyroomClient
        .getSharedSourceCodeById(parseInt(params.codeId as string))
        .then(setSharedSourceCode);
    }
  }, [sharedSourceCode]);

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
      <Button>풀이 비교</Button>
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
  );
}
