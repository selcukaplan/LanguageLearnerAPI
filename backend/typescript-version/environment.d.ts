
export {};

declare global {
    namespace NodeJS {
        interface  ProcessEnv {
            PORT_HTTP?: number;
            MONGO_URI: string;
            JWT_SECRET: string;
            JWT_LIFETIME: string;
            PORT_WEBSOCKET?: number;

        }
    }
}