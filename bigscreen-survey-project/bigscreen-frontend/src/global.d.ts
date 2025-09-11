// global.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_API_URL: string;
        REACT_APP_ENV: 'development' | 'production';
        NODE_ENV: 'development' | 'production';
    }
}

declare var process: {
    env: NodeJS.ProcessEnv;
};