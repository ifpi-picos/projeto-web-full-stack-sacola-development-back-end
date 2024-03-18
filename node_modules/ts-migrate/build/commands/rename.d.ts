interface RenameParams {
    rootDir: string;
    sources?: string | string[];
}
export default function rename({ rootDir, sources, }: RenameParams): Array<{
    oldFile: string;
    newFile: string;
}> | null;
export {};
