export interface AppRecord {
    name: string;
    url: string;
    path: string;
    platform: string;
    arch: string;
    createdAt: string;
    version: string;
}
export declare function registerApp(app: AppRecord): void;
export declare function listApps(): AppRecord[];
export declare function findApp(name: string): AppRecord | undefined;
export declare function removeAppFromRegistry(name: string): AppRecord | undefined;
export declare function getAppDataPath(appName: string): string;
export declare function uninstallApp(name: string, purge?: boolean): {
    success: boolean;
    message: string;
};
