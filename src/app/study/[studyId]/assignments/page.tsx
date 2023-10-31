"use client";

import { useEffect, useState } from "react";
import Assignment, {
  Assignee,
  AssignmentContainer
} from "./assignment/assignment";
import apiClient, {
  AssignmentInfo as AssignmentData
} from "@/app/api_client/api_client";
import { useParams } from "next/navigation";
import DefaultProfileImageUrl from "@/app/default_profile_image_url";

export default function AssignemntsPage() {
  const params = useParams();
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  useEffect(() => {
    apiClient
      .getAssignments(parseInt(params.studyId as string))
      .then(setAssignments);
  });

  return (
    <AssignmentContainer>
      {assignments.map((i) => (
        <Assignment
          problemId={i.problem.pid}
          problemName={i.problem.title}
          solvedAcTier={i.problem.difficultyLevel}
        >
          {i.solvedUsers.map((j) => (
            <Assignee
              nickname={j.name}
              profileImageUrl={DefaultProfileImageUrl()}
            ></Assignee>
          ))}
        </Assignment>
      ))}
    </AssignmentContainer>
  );
}
