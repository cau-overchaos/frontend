"use client";

import { useEffect, useMemo, useState } from "react";
import People, { Person } from "./people";
import apiClient, { StudyroomMember } from "@/app/api_client";
import { useParams } from "next/navigation";

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

  return (
    <People inviteButton onInviteClick={() => {}}>
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
          }
          onDeleteClick={() =>
            studyRoom.deleteMember(i.userId).catch((err) => alert(err.message))
          }
          adminMode={adminMode ?? false}
        ></Person>
      ))}
    </People>
  );
}
