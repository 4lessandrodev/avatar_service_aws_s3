export interface IFilesConverter {
	bufferToStream: (file: Buffer) => Promise<NodeJS.ReadableStream>;
	streamToBuffer: (stream: NodeJS.ReadableStream) => Promise<Buffer>;
	fileToStream: (stream: Express.Multer.File) => Promise<NodeJS.ReadableStream>;
}