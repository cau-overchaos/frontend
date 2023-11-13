"use client";

import apiClient from "@/app/api_client/api_client";
import { DetailedStudyroomInfo } from "@/app/api_client/studyroom";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StudyroomDetails from "./studyroomDetail";

export default function StudyIndexPage() {
  const params = useParams();
  const [details, setDetails] = useState<DetailedStudyroomInfo | null>(null);

  useEffect(() => {
    if (details === null)
      apiClient
        .studyroom(parseInt(params.studyId as string))
        .getDetails()
        .then(setDetails);
  }, [details]);

  return <StudyroomDetails details={details}></StudyroomDetails>;
}
