export interface User {
    user: string;
    group: string;
    username: string;
    Authorization: string;
    apikey: string;
    expires: string;
    // Legacy properties for backward compatibility
    Username?: string;
    Password?: string;
    API_Key?: string;
    Name?: string;
}
