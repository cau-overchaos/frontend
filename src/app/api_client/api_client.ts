import { transform } from "typescript";
import Assignment from "../study/[studyId]/assignments/assignment/assignment";

type SignUpForm = {
  userId: string;
  password: string;
  name: string;
  judgeAccount: string;
};

export type UserProfile = {
  userId: string;
  password: string;
  name: string;
  judgeAccount: string;
  profileImage: string | null;
};

export type StudyroomMember = Omit<UserProfile, "password" | "profileImage"> & {
  isValidJudgeAccount: boolean;
  admin: boolean;
  solvedTier: number;
  isMe: boolean;
};

type LoginForm = {
  userId: string;
  password: string;
};

type ApiResponse = {
  status: string;
  data: any;
  message: string;
};

export type StudyRoom = {
  id: number;
  title: string;
  description: string;
  studyRoomVisibility: "PUBLIC" | "PRIVATE";
  maxUserCnt: number;
};

export type ProblemProviderKey = "BAEKJOON" | "LEETCODE";
export type ProblemProviderValue = "백준" | "LEETCODE";
export type ProblemProvider = {
  key: ProblemProviderKey;
  value: ProblemProviderValue;
} & (
  | {
      key: "BAEKJOON";
      value: "백준";
    }
  | {
      key: "LEETCODE";
      value: "LEETCODE";
    }
);

export const problemProviderKeyToValue = (
  key: ProblemProviderKey
): ProblemProviderValue => {
  switch (key) {
    case "BAEKJOON":
      return "백준";
    case "LEETCODE":
      return "LEETCODE";
  }
};

export type Problem = {
  provider: ProblemProviderKey;
  pid: number;
  title: string;
  difficultyLevel: number;
  difficultyName: string;
};

export type Assignment = {
  id: number;
  studyRoomId: number;
  startDate: Date;
  endDate: Date;
  problem: Pick<
    Problem,
    "pid" | "title" | "difficultyLevel" | "difficultyName"
  >;
};

export type AssignmentInfo = {
  problem: Problem;
  startDate: Date;
  dueDate: Date;
  solvedUsers: {
    id: string;
    name: string;
    judgeAccount: string;
    solvedAt: Date;
  }[];
};

type AssignmentCreationForm = {
  startDate: Date;
  dueDate: Date;
  problemList: {
    provider: ProblemProviderKey;
    pid: number;
  }[];
};

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

export type ProgammingLanguage = {
  id: number;
  name: string;
};

type EventType = "loggedInOrloggedOut";

const transformDatetime = (dt: Date): string =>
  `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt
    .getDate()
    .toString()
    .padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

class ApiClient {
  private apiEndpoint;
  private cached: boolean = false;
  private cachedMyProfile: UserProfile | null = null;
  private listeners: { [key in EventType]: Function[] } = {
    loggedInOrloggedOut: []
  };

  /**
   * Creates api client
   * @param endpoint Root endpoint of api
   */
  constructor(
    endpoint: string = process.env.NEXT_PUBLIC_API_ENDPOINT ?? "/api"
  ) {
    this.apiEndpoint = endpoint;
  }

  on(type: EventType, listener: Function) {
    this.listeners[type].push(listener);
  }

  off(type: EventType, listener: Function) {
    this.listeners[type] = this.listeners[type].filter((i) => i !== listener);
  }

  private fireEvent(type: EventType) {
    this.listeners[type].forEach((i) => {
      setTimeout(i, 0);
    });
  }

  async me(skipCache: boolean = false): Promise<UserProfile | null> {
    if (!skipCache && this.cached) {
      return this.cachedMyProfile;
    }

    const response = await fetch(this.apiEndpoint + "/users/me", {
      credentials: "include"
    });
    const responseData: ApiResponse = await response.json();

    if (response.ok) {
      this.cached = true;
      this.cachedMyProfile = responseData.data;
      return responseData.data;
    } else if (response.status === 401) {
      this.cached = true;
      this.cachedMyProfile = null;
      return null;
    } else {
      throw new Error(`HTTP ${response.status}: ${responseData.message}`);
    }
  }

  async logout() {
    const response = await fetch(this.apiEndpoint + "/logout", {
      method: "POST",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${(await response.json()).message}`
      );
    }

    this.cached = false;
    this.fireEvent("loggedInOrloggedOut");
  }

  async login(form: LoginForm) {
    const response = await fetch(this.apiEndpoint + "/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const responseData: ApiResponse = await response.json();
      throw new Error(responseData.message);
    }

    this.fireEvent("loggedInOrloggedOut");
  }

  async signUp(form: SignUpForm) {
    const response = await fetch(this.apiEndpoint + "/signup", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const responseData: ApiResponse = await response.json();
      throw new Error(responseData.message);
    }
  }

  async studyrooms(type: "all" | "participated" = "all"): Promise<StudyRoom[]> {
    const endpoint =
      type === "all"
        ? this.apiEndpoint + "/studyrooms"
        : this.apiEndpoint + "/studyrooms/participated";
    const response = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const responseData: ApiResponse = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message);
    }

    return responseData.data.studyRoomList;
  }

  async createStudyroom(room: Omit<StudyRoom, "id">): Promise<StudyRoom> {
    const response = await fetch(this.apiEndpoint + "/studyrooms", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(room),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data: ApiResponse = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data.data;
  }

  async getAssignments(studyRoomId: number): Promise<AssignmentInfo[]> {
    const response = await fetch(
      this.apiEndpoint + `/studyrooms/${studyRoomId}/assignments`,
      {
        method: "GET",
        credentials: "include"
      }
    );

    const data: ApiResponse = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data.data.assignmentInfoList.map(
      (i: any) =>
        ({
          problem: {
            difficultyLevel: i.problemDifficultyLevel,
            difficultyName: i.problemDifficultyName,
            title: i.problemTitle,
            pid: i.problemPid,
            provider: "BAEKJOON"
          },
          startDate: new Date(i.startDate),
          dueDate: new Date(i.dueDate),
          solvedUsers: i.solvedUserInfoList.map((j: any) => ({
            id: j.userId,
            name: j.name,
            judgeAccount: j.judgeAccount,
            solvedAt: j.solvedDate
          }))
        } as AssignmentInfo)
    );
  }

  async createAssignment(
    studyRoomId: number,
    assignemnt: AssignmentCreationForm
  ): Promise<Assignment> {
    const response = await fetch(
      this.apiEndpoint + `/studyrooms/${studyRoomId}/assignments`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          ...assignemnt,
          dueDate: transformDatetime(assignemnt.dueDate),
          startDate: transformDatetime(assignemnt.startDate),
          studyRoomId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const data: ApiResponse = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data.data;
  }

  async getProblem(
    problemId: number,
    provider: ProblemProviderKey
  ): Promise<Problem> {
    const response = await fetch(
      this.apiEndpoint + `/problems?pid=${problemId}&provider=${provider}`,
      {
        method: "GET",
        credentials: "include"
      }
    );

    const data: ApiResponse = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data.data;
  }

  studyroom(roomId: number) {
    const apiEndpoint = this.apiEndpoint;
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

        return (data.data.sharedSourceCodeInfoDtoList as any[]).map(
          (i: any) => ({
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
          })
        );
      }
    };
  }

  async programmingLanguages(): Promise<ProgammingLanguage[]> {
    const response = await fetch(this.apiEndpoint + `/programming-languages`, {
      method: "GET",
      credentials: "include"
    });

    const data: ApiResponse = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data.problemResponseDtoList as ProgammingLanguage[];
  }
}

const apiClient = new ApiClient();
export default apiClient;
