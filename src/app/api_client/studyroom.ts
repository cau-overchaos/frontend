import { ApiResponse, ProblemProviderKey, UserProfile } from "./api_client";

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

export default function createStudyroomClient(
  apiEndpoint: string,
  roomId: number
) {
  return {
    async getMembers(): Promise<StudyroomMember[]> {
      const response = await fetch(
        apiEndpoint + `/studyrooms/${roomId}/members`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const data: ApiResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      return data.data.studyRoomMemberDtoList.map((i: any) => ({
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
      const response = await fetch(
        apiEndpoint + `/studyrooms/${roomId}/members/add`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ targetUserId: memberId }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data: ApiResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
    },
    async deleteMember(memberId: string): Promise<void> {
      const response = await fetch(
        apiEndpoint + `/studyrooms/${roomId}/members/delete`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ targetUserId: memberId }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data: ApiResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
    },
    async toggleMemberAuthoritory(memberId: string): Promise<void> {
      const response = await fetch(
        apiEndpoint + `/studyrooms/${roomId}/members/authority`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ targetUserId: memberId }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data: ApiResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
    },
    async amIMember(): Promise<boolean> {
      const response = await fetch(
        apiEndpoint + `/studyrooms/${roomId}/is-member`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      const data: ApiResponse = await response.json();
      return data.status === "success";
    },
    async amIAdmin(): Promise<boolean> {
      const response = await fetch(
        apiEndpoint + `/studyrooms/${roomId}/is-manager`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      const data: ApiResponse = await response.json();
      return data.status === "success";
    },
    async shareSourceCode(
      form: SharedSourceCodeCreationForm
    ): Promise<SharedSourceCode> {
      const response = await fetch(
        apiEndpoint + `/studyrooms/${roomId}/shared-sourcecodes`,
        {
          method: "POST",
          credentials: "include",
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

      const data: ApiResponse = await response.json();
      if (!response.ok) throw new Error(data.message);

      return {
        createdAt: new Date(data.data.createdAt),
        getSourceCode: () => data.data.sourceCodeText,
        id: data.data.sharedSourceCodeId,
        title: data.data.sharedSourceCodeTitle,
        language: {
          id: data.data.programmingLanguageId,
          name: data.data.programmingLanguageName
        },
        problem: {
          difficultyLevel: data.data.problemDifficultyLevel,
          title: data.data.problemTitle
        },
        writer: {
          id: data.data.writerUserId,
          nickname: data.data.writerName
        }
      };
    },
    async sharedSourceCodes(): Promise<SharedSourceCode[]> {
      const response = await fetch(
        apiEndpoint + `/studyrooms/${roomId}/shared-sourcecodes`,
        {
          method: "GET",
          credentials: "include"
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) throw new Error(data.message);

      return (data.data.sharedSourceCodeInfoDtoList as any[]).map((i: any) => ({
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
        createdAt: new Date(i.createdAt),
        async getSourceCode() {
          const response = await fetch(
            apiEndpoint +
              `/studyrooms/${roomId}/shared-sourcecodes/${i.sharedSourceCodeId}s`,
            {
              method: "GET",
              credentials: "include"
            }
          );

          const data: ApiResponse = await response.json();
          if (!response.ok) throw new Error(data.message);

          return data.data.sourceCodeText;
        }
      }));
    }
  };
}
