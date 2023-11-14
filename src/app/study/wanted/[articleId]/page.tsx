"use client";

import apiClient from "@/app/api_client/api_client";
import { RecruitPost } from "@/app/api_client/recruits";
import Article from "@/app/board/article";
import MainLayout from "@/app/main_layout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WantedArticlePage() {
  const params = useParams();
  const [post, setPost] = useState<RecruitPost | null>(null);

  useEffect(() => {
    if (post === null)
      apiClient
        .recruitPosts()
        .getPost(parseInt(params.articleId as string))
        .then(setPost)
        .catch((i) => alert(`오류: ${i.message}`));
  });

  return post === null ? (
    <div></div>
  ) : (
    <MainLayout>
      <Article
        title={post.title}
        date={post.createdAt}
        listHref="/study/wanted"
        endDate={post.dueDate}
        userCount={post.studyRoom.userCount}
        tags={post.studyRoom.programmingLanguages.map((i) => i.name)}
      >
        {post.content}
      </Article>
    </MainLayout>
  );
}
