import { transform } from "typescript";
import Assignment from "../study/[studyId]/assignments/assignment/assignment";
import createStudyroomClient from "./studyroom";
import createRecruitClient from "./recruits";

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

type LoginForm = {
  userId: string;
  password: string;
};

export type ApiResponse = {
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

export type ProgammingLanguage = {
  id: number;
  name: string;
};

export type ApiFetcher = (
  pathname: string,
  init?: RequestInit
) => Promise<ApiResponse>;

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
    this.fetchApi = this.fetchApi.bind(this);
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

  private async fetchApi(
    pathname: string,
    init?: RequestInit
  ): Promise<ApiResponse> {
    const response = await fetch(this.apiEndpoint + pathname, {
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      ...init
    });

    const data: ApiResponse = await response.json();
    if (!response.ok) throw new Error(data.message);

    return data;
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
    await this.fetchApi("/logout", {
      method: "POST"
    });

    this.cached = false;
    this.fireEvent("loggedInOrloggedOut");
  }

  async login(form: LoginForm) {
    await this.fetchApi("/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json"
      }
    });

    this.fireEvent("loggedInOrloggedOut");
  }

  async signUp(form: SignUpForm) {
    await this.fetchApi("/signup", {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  async studyrooms(
    type: "all" | "participated" | "managing" = "all"
  ): Promise<StudyRoom[]> {
    const endpoint =
      type === "all"
        ? "/studyrooms"
        : type === "managing"
        ? "/studyrooms/i-am-manager"
        : "/studyrooms/participated";
    const response = await this.fetchApi(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.data.studyRoomList;
  }

  async createStudyroom(room: Omit<StudyRoom, "id">): Promise<StudyRoom> {
    const response = await this.fetchApi("/studyrooms", {
      method: "POST",
      body: JSON.stringify(room),
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.data;
  }

  async getAssignments(studyRoomId: number): Promise<AssignmentInfo[]> {
    const response = await this.fetchApi(
      `/studyrooms/${studyRoomId}/assignments`,
      {
        method: "GET"
      }
    );

    return response.data.assignmentInfoList.map(
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
    const response = await this.fetchApi(
      `/studyrooms/${studyRoomId}/assignments`,
      {
        method: "POST",
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

    return response.data;
  }

  async getProblem(
    problemId: number,
    provider: ProblemProviderKey
  ): Promise<Problem> {
    const response = await this.fetchApi(
      `/problems?pid=${problemId}&provider=${provider}`,
      {
        method: "GET"
      }
    );

    return response.data;
  }

  studyroom(roomId: number) {
    return createStudyroomClient(this.fetchApi, roomId);
  }

  async programmingLanguages(): Promise<ProgammingLanguage[]> {
    const response = await this.fetchApi(`/programming-languages`, {
      method: "GET"
    });

    return response.data.problemResponseDtoList as ProgammingLanguage[];
  }

  recruitPosts() {
    return createRecruitClient(this.fetchApi);
  }
}

const apiClient = new ApiClient();
export default apiClient;
