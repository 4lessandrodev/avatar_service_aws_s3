import { UploadParam } from './get-signed-url-param.interface';

export interface IUploaderService {
	uploadOne: (param: UploadParam) => Promise<void>;
	uploadMany: (params: UploadParam[]) => Promise<void>;
	getSignUrl: (param: UploadParam) => Promise<string>;
	putSignUrl: (param: UploadParam) => Promise<string>;
}