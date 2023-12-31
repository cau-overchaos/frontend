"use client";

import { useEffect, useState } from "react";
import Assignment, {
  Assignee,
  AssignmentContainer,
  Datetime
} from "./assignment/assignment";
import apiClient, {
  AssignmentInfo as AssignmentData
} from "@/app/api_client/api_client";
import { useParams } from "next/navigation";
import DefaultProfileImageUrl from "@/app/default_profile_image_url";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import loadingStyles from "./loading.module.scss";
import gravatarUrl from "@/app/gravatarUrl";

export default function AssignemntsPage() {
  const params = useParams();
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const interval = setInterval(
      () =>
        apiClient
          .getAssignments(parseInt(params.studyId as string))
          .then(setAssignments)
          .then(() => setLoading(false)),
      500
    );

    return () => clearInterval(interval);
  });

  return loading ? (
    <div className={loadingStyles.loading}>
      <FontAwesomeIcon icon={faSpinner} spin></FontAwesomeIcon>
    </div>
  ) : (
    <AssignmentContainer>
      {assignments.map((i) => (
        <Assignment
          problemId={i.problem.pid}
          problemName={i.problem.title}
          solvedAcTier={i.problem.difficultyLevel}
          key={
            i.problem.pid + " " + i.dueDate.getTime() + i.startDate.getTime()
          }
        >
          <Datetime dueDate={i.dueDate} startDate={i.startDate}></Datetime>
          {i.solvedUsers.map((j) => (
            <Assignee
              key={j.id}
              nickname={j.name}
              profileImageUrl={gravatarUrl(null, j.id, j.name)}
            ></Assignee>
          ))}
        </Assignment>
      ))}
    </AssignmentContainer>
  );
}
