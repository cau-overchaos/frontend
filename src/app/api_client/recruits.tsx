import { ApiFetcher, ProgammingLanguage } from "./api_client";

export type RecruitPostInfo = {
  id: number;
  title: string;
  writer: {
    id: string;
    name: string;
  };
};
export type RecruitPostCreationForm = {
  studyRoomId: number;
  title: string;
  content: string;
  dueDate: Date;
};
export type RecruitPost = {
  title: string;
  content: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  studyRoom: {
    id: number;
    title: string;
    description: string;
    userCount: {
      current: number;
      maximum: number;
    };
    managerUserId: string[];
    programmingLanguages: ProgammingLanguage[];
  };
};
export type RecruitPostComment = {
  id: number;
  postId: number;
  comment: string;
  writer: {
    id: string;
    name: string;
    alreadyStudyMember: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export default function createRecruitClient(fetch: ApiFetcher) {
  const formatDate = (dt: Date) =>
    `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt
      .getDate()
      .toString()
      .padStart(2, "0")}`;

  const transformToRecruitPostObject = (resp: any): RecruitPost => ({
    title: resp.title,
    content: resp.text,
    dueDate: new Date(resp.dueDate),
    createdAt: new Date(resp.createdAt),
    updatedAt: new Date(resp.updatedAt),
    studyRoom: {
      id: resp.studyRoomInfoResponseDto.id,
      title: resp.studyRoomInfoResponseDto.title,
      description: resp.studyRoomInfoResponseDto.description,
      managerUserId: resp.studyRoomInfoResponseDto.managerUserIdList,
      programmingLanguages:
        resp.studyRoomInfoResponseDto.programmingLanguageListResponseDto
          .programmingLanguageResponseDtoList,
      userCount: {
        current: resp.studyRoomInfoResponseDto.curUserCnt,
        maximum: resp.studyRoomInfoResponseDto.maxUserCnt
      }
    }
  });

  const transformToRecruitCommentObject = (resp: any): RecruitPostComment => ({
    id: resp.id,
    postId: resp.recruitPostId,
    comment: resp.comment,
    createdAt: new Date(resp.createdAt),
    updatedAt: new Date(resp.updatedAt),
    writer: {
      id: resp.writerUserId,
      name: resp.writerUserName,
      alreadyStudyMember: resp.alreadyStudyMember
    }
  });

  return {
    async getPosts(): Promise<RecruitPostInfo[]> {
      const response = await fetch("/recruitPosts");

      return response.data.recruitPostDtoList.map((i: any) => {
        const { id, title, writerUserId, writerUserName } = i;
        return {
          id,
          title,
          writer: {
            id: writerUserId,
            name: writerUserName
          }
        };
      });
    },
    async createPost({
      studyRoomId,
      title,
      content,
      dueDate
    }: RecruitPostCreationForm): Promise<RecruitPost> {
      const response = await fetch("/recruitPosts/", {
        method: "POST",
        body: JSON.stringify({
          studyRoomId,
          title,
          dueDate: formatDate(dueDate),
          text: content
        })
      });

      return transformToRecruitPostObject(response.data);
    },
    async getPost(id: number) {
      const response = await fetch(`/recruitPosts/${id}`);

      return transformToRecruitPostObject(response.data);
    },
    async createComment(postId: number, comment: string) {
      const response = await fetch(`/recruitPosts/${postId}/recruitComments`, {
        method: "POST",
        body: JSON.stringify({
          comment
        })
      });

      return transformToRecruitCommentObject(response.data);
    },
    async getComments(postId: number): Promise<{
      comments: RecruitPostComment[];
      isCurrentUserStudyRoomManager: boolean;
    }> {
      const response = await fetch(`/recruitPosts/${postId}/recruitComments`);

      const comments = response.data.recruitCommentResponseDtoList.map(
        transformToRecruitCommentObject
      );
      const isCurrentUserStudyRoomManager =
        response.data.currentUserStudyRoomManager;

      return {
        comments,
        isCurrentUserStudyRoomManager
      };
    }
  };
}
