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

type ApiResponse = {
  status: string;
  data: any;
  message: string;
};

type EventType = "loggedInOrloggedOut";

class ApiClient {
  private apiEndpoint;
  private cached: boolean = false;
  private cachedMyProfile: UserProfile | null = null;
  private listeners: { [key in EventType]: Function[] } = {
    loggedInOrloggedOut: [],
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
      credentials: "include",
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
      credentials: "include",
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
        "Content-Type": "application/json",
      },
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
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const responseData: ApiResponse = await response.json();
      throw new Error(responseData.message);
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;
