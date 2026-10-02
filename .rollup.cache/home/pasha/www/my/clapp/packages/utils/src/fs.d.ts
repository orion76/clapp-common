export declare function getUserProfileDirectory(): string;
export declare function getCwd(): string;
export declare function isProjectRoot(dir: string): boolean;
export declare function getProjectRoot(startFromDir: string, searchInDir?: string): string | null;
export declare function findProjectRoot(startFromDir: string, searchInDir: string, checkFn: (dir: string) => boolean): string | null;
export declare function isFileInside(file: string, parentDir: string): boolean;
