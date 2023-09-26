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

type EventType = 'loggedInOrloggedOut';

class ApiClient {
    private apiEndpoint;
    private listeners: {[key in EventType]: Function[]} = {
        'loggedInOrloggedOut': []
    }
    
    /**
     * Creates api client
     * @param endpoint Root endpoint of api
     */
    constructor(endpoint: string = process.env.NEXT_PUBLIC_API_ENDPOINT ?? '/api') {
        this.apiEndpoint = endpoint;
    }

    on(type: EventType, listener: Function) {
        this.listeners[type].push(listener);
    }
    
    off(type: EventType, listener: Function) {
        this.listeners[type] = this.listeners[type].filter(i => i !== listener);
    }

    private fireEvent (type: EventType) {
        this.listeners[type].forEach(i => { setTimeout(i, 0); });
    }

    async logout() {
        await fetch(this.apiEndpoint + '/logout', {
            method: 'POST'
        });
        this.fireEvent('loggedInOrloggedOut');
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

        this.fireEvent('loggedInOrloggedOut');
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

const apiClient = new ApiClient();
export default apiClient;