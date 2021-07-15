import { UploadParam } from './get-signed-url-param.interface';

export interface IUploaderService {
	uploadOne: (param: number) => Promise<string>;
	uploadMany: (params: UploadParam[]) => Promise<void>;
	getSignUrl: (param: UploadParam) => Promise<string>;
	putSignUrl: (param: UploadParam) => Promise<string>;
}