"use client";

import apiClient from "@/app/api_client/api_client";
import { RecruitPost, RecruitPostComment } from "@/app/api_client/recruits";
import Article from "@/app/board/article";
import MainLayout from "@/app/main_layout";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Comments, { Comment } from "./comments";

export default function WantedArticlePage() {
  const params = useParams();
  const [post, setPost] = useState<RecruitPost | null>(null);
  const [comments, setComments] = useState<RecruitPostComment[] | null>(null);
  const [refreshComments, setRefreshComments] = useState<boolean>(false);
  const [isCurrentUserStudyroomManager, setIsCurrentUserStudyroomManager] =
    useState<boolean>(false);
  const articleId = parseInt(params.articleId as string);

  useEffect(() => {
    if (post === null)
      apiClient
        .recruitPosts()
        .getPost(articleId)
        .then(setPost)
        .catch((i) => alert(`오류: ${i.message}`));
  }, [post]);

  useEffect(() => {
    if (comments === null || refreshComments)
      apiClient
        .recruitPosts()
        .getComments(articleId)
        .then((i) => {
          if (refreshComments) setRefreshComments(false);
          setComments(i.comments);
          setIsCurrentUserStudyroomManager(i.isCurrentUserStudyRoomManager);
        });
  }, [comments, refreshComments]);

  const postNewComment = (comment: string) => {
    apiClient
      .recruitPosts()
      .createComment(articleId, comment)
      .then(() => {
        setRefreshComments(true);
      });
  };

  const inviteUser = (userId: string) => {
    if (post === null) return alert("잠시후 다시 시도해주세요.");
    apiClient
      .studyroom(post?.studyRoom.id)
      .addMember(userId)
      .then(() => {
        alert("초대했습니다!");
        setRefreshComments(true);
      })
      .catch((err) => {
        alert(`오류가 발생했습니다: ${err.message}`);
      });
  };

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
      <Comments onNewComment={postNewComment}>
        {comments?.map((i) => (
          <Comment
            inviteButton={
              isCurrentUserStudyroomManager && !i.writer.alreadyStudyMember
            }
            nickname={i.writer.name}
            comment={i.comment}
            onInviteClick={() => {
              inviteUser(i.writer.id);
            }}
          ></Comment>
        ))}
      </Comments>
    </MainLayout>
  );
}
