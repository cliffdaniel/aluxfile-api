import { MulterFile } from '../types/multer-file.type';

export abstract class FileRepository {
    abstract uploadFile(file: MulterFile): Promise<string>;
    abstract uploadBuffer(
        buffer: globalThis.Buffer,
        fileName: string,
    ): Promise<string>;
}
