import {
  ApiFetcher,
  ProblemProviderKey,
  ProgammingLanguage,
  UserProfile
} from "./api_client";
import createFeedbackClient, { FeedbackClient } from "./feedbacks";

export type SharedSourceCode = {
  id: number;
  title: string;
  problem: {
    title: string;
    difficultyLevel: number;
  };
  writer: {
    id: string;
    nickname: string;
  };
  language: {
    id: string;
    name: string;
  };
  createdAt: Date;
  getSourceCode: () => Promise<string>;
  getFeedback: () => FeedbackClient;
};

export type SharedSourceCodeCreationForm = {
  title: string;
  sourceCode: string;
  languageId: number;
  problem: {
    provider: ProblemProviderKey;
    pid: number;
  };
};

export type StudyroomMember = Omit<UserProfile, "password" | "profileImage"> & {
  isValidJudgeAccount: boolean;
  admin: boolean;
  solvedTier: number;
  isMe: boolean;
};

export type DetailedStudyroomInfo = {
  id: number;
  title: string;
  description: string;
  userCount: {
    current: number;
    maximum: number;
  };
  managerUserIds: string[];
  programmingLanguages: ProgammingLanguage[];
};

export default function createStudyroomClient(
  fetchApi: ApiFetcher,
  roomId: number
) {
  const transformToSharedSourceCodeObj = (
    i: any
  ): Omit<SharedSourceCode, "getSourceCode" | "getFeedback"> => {
    return {
      id: i.sharedSourceCodeId,
      title: i.sharedSourceCodeTitle,
      problem: {
        difficultyLevel: i.problemDifficultyLevel,
        title: i.problemTitle
      },
      writer: {
        id: i.writerUserId,
        nickname: i.writerName
      },
      language: {
        id: i.programmingLanguageId,
        name: i.programmingLanguageName
      },
      createdAt: new Date(i.createdAt)
    };
  };

  return {
    async getMembers(): Promise<StudyroomMember[]> {
      const response = await fetchApi(`/studyrooms/${roomId}/members`, {
        method: "GET"
      });

      return response.data.studyRoomMemberDtoList.map((i: any) => ({
        userId: i.userId,
        name: i.name,
        isValidJudgeAccount: i.isValidJudgeAccount,
        judgeAccount: i.judgeAccount,
        solvedTier: i.tierLevel,
        isMe: i.isMe,
        admin: i.studyRoomRole === "MANAGER"
      }));
    },
    async addMember(memberId: string): Promise<void> {
      await fetchApi(`/studyrooms/${roomId}/members/add`, {
        method: "POST",
        body: JSON.stringify({ targetUserId: memberId }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    },
    async deleteMember(memberId: string): Promise<void> {
      await fetchApi(`/studyrooms/${roomId}/members/delete`, {
        method: "POST",
        body: JSON.stringify({ targetUserId: memberId }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    },
    async toggleMemberAuthoritory(memberId: string): Promise<void> {
      await fetchApi(`/studyrooms/${roomId}/members/authority`, {
        method: "POST",
        body: JSON.stringify({ targetUserId: memberId }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    },
    async amIMember(): Promise<boolean> {
      try {
        await fetchApi(`/studyrooms/${roomId}/is-member`, {
          method: "POST"
        });
        return true;
      } catch {
        return false;
      }
    },
    async amIAdmin(): Promise<boolean> {
      try {
        await fetchApi(`/studyrooms/${roomId}/is-manager`, {
          method: "POST"
        });
        return true;
      } catch {
        return false;
      }
    },
    async getDetails(): Promise<DetailedStudyroomInfo> {
      const data = await fetchApi(`/studyrooms/${roomId}`);
      const { description, id, title } = data.data;

      return {
        description,
        id,
        title,
        userCount: {
          current: data.data.curUserCnt,
          maximum: data.data.maxUserCnt
        },
        managerUserIds: data.data.managerUserIdList,
        programmingLanguages:
          data.data.programmingLanguageListResponseDto.problemResponseDtoList
      };
    },
    async programmingLanguages(): Promise<ProgammingLanguage[]> {
      const result = await fetchApi(
        `/studyrooms/${roomId}/programming-languages`
      );
      return result.data.problemResponseDtoList;
    },
    async shareSourceCode(
      form: SharedSourceCodeCreationForm
    ): Promise<SharedSourceCode> {
      const response = await fetchApi(
        `/studyrooms/${roomId}/shared-sourcecodes`,
        {
          method: "POST",
          body: JSON.stringify({
            title: form.title,
            sourceCode: form.sourceCode,
            programmingLanguageId: form.languageId,
            problemInfoRequestDto: form.problem
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      return {
        ...transformToSharedSourceCodeObj(response.data),
        getSourceCode: async () => response.data.sourceCodeText,
        getFeedback: () =>
          createFeedbackClient(
            fetchApi,
            roomId,
            response.data.sharedSourceCodeId
          )
      };
    },
    async getSharedSourceCodeById(id: number): Promise<SharedSourceCode> {
      const response = await fetchApi(
        `/studyrooms/${roomId}/shared-sourcecodes/${id}`,
        {
          method: "GET"
        }
      );

      return {
        ...transformToSharedSourceCodeObj(response.data),
        getFeedback: () => createFeedbackClient(fetchApi, roomId, id),
        getSourceCode: async () => response.data.sourceCodeText
      };
    },

    async sharedSourceCodes(): Promise<SharedSourceCode[]> {
      const response = await fetchApi(
        `/studyrooms/${roomId}/shared-sourcecodes`,
        {
          method: "GET"
        }
      );

      return (response.data.sharedSourceCodeInfoDtoList as any[]).map(
        (i: any) => ({
          ...transformToSharedSourceCodeObj(i),
          async getSourceCode() {
            const response = await fetchApi(
              `/studyrooms/${roomId}/shared-sourcecodes/${i.sharedSourceCodeId}`,
              {
                method: "GET"
              }
            );

            return response.data.sourceCodeText;
          },

          getFeedback: () =>
            createFeedbackClient(fetchApi, roomId, i.sharedSourceCodeId)
        })
      );
    }
  };
}
