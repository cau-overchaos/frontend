type SignUpForm = {
    userId: string;
    password: string;
    name: string;
    judgeAccount: string;
}

type LoginForm = {
    userId: string;
    password: string;
}

type ApiResponse = {
    status: string;
    data: any;
    message: string;
}

export default class ApiClient {
    private apiEndpoint;
    
    /**
     * Creates api client
     * @param endpoint Root endpoint of api
     */
    constructor(endpoint: string = process.env.NEXT_PUBLIC_API_ENDPOINT ?? '/api') {
        this.apiEndpoint = endpoint;
    }

    async logout() {
        await fetch(this.apiEndpoint + '/logout', {
            method: 'POST'
        });
    }

    async login(form: LoginForm) {
        const response = await fetch(this.apiEndpoint + '/login', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const responseData: ApiResponse = await response.json();
            throw new Error(responseData.message);
        };
    }

    async signUp(form: SignUpForm) {
        const response = await fetch(this.apiEndpoint + '/signup', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const responseData: ApiResponse = await response.json();
            throw new Error(responseData.message);
        };
    }
}