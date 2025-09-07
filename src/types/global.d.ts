declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_USER: string;
    MONGODB_PASS: string;
    MONGODB_HOST: string;
    MONGODB_PORT: string;
    JWT_TOKENS: string
  }
}
