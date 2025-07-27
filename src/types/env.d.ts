declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    UPLOADTHING_SECRET: string;
    UPLOADTHING_APP_ID: string;
  }
}
