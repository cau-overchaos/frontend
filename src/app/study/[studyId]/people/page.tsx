"use client";

import { useEffect, useMemo, useState } from "react";
import People, { Person } from "./people";
import apiClient, { StudyroomMember } from "@/app/api_client/api_client";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styles from "./people.module.scss";

export default function PeoplePage() {
  const params = useParams();
  const [loading, setLoading] = useState<
    "firstLoading" | "refreshing" | "loaded"
  >("firstLoading");
  const [members, setMembers] = useState<StudyroomMember[]>([]);
  const [adminMode, setAdminMode] = useState<boolean | null>(null);
  const studyRoom = useMemo(
    () => apiClient.studyroom(parseInt(params.studyId as string)),
    [params]
  );

  useEffect(() => {
    if (loading !== "loaded") {
      studyRoom
        .getMembers()
        .then(setMembers)
        .then(() => setLoading("loaded"));
    }
  });

  useEffect(() => {
    if (adminMode === null) studyRoom.amIAdmin().then(setAdminMode);
  });

  return loading === "firstLoading" ? (
    <div className={styles.loading}>
      <FontAwesomeIcon spin icon={faSpinner}></FontAwesomeIcon>
    </div>
  ) : (
    <People
      inviteButton
      onInviteClick={() => {
        const id = prompt("초대할 사람의 ID를 입력해주세요.");
        if (id?.trim() !== "" && id !== null) {
          apiClient
            .studyroom(parseInt(params.studyId as string))
            .addMember(id)
            .then(() => {
              setLoading("refreshing");
            })
            .catch((err) => {
              alert("오류: " + err.message);
            });
        }
      }}
    >
      {members.map((i) => (
        <Person
          admin={i.admin}
          bojId={i.judgeAccount}
          nickname={i.name}
          solvedTier={i.solvedTier}
          key={i.userId}
          onAuthorityClick={() =>
            studyRoom
              .toggleMemberAuthoritory(i.userId)
              .catch((err) => alert(err.message))
              .then(() => {
                setLoading("refreshing");
              })
          }
          onDeleteClick={() =>
            studyRoom
              .deleteMember(i.userId)
              .catch((err) => alert(err.message))
              .then(() => {
                setLoading("refreshing");
              })
          }
          adminMode={(adminMode ?? false) && !i.isMe}
        ></Person>
      ))}
    </People>
  );
}
