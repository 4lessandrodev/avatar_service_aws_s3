import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ContentType, GetPresignedParam, PutObjectParam, TypeContent, UploadParam } from './get-signed-url-param.interface';
import { IUploaderService } from './uploader.interface';

@Injectable()
export class UploadService implements IUploaderService {
	constructor (
		@Inject(S3)
		private readonly s3: S3,
	) { }

	async uploadOne (param: UploadParam): Promise<void> {
		this.s3.upload(param);
	}

	async uploadMany (params: UploadParam[]): Promise<void> {
		const promises: Promise<unknown>[] = [];
		const upload = (param: UploadParam) => {
			return new Promise((resolve, _rej) => {
				resolve(this.s3.upload(param));
			});
		};
		params.map((param) => promises.push(upload(param)));
		await Promise.all(promises);
	}

	async putObject (params: PutObjectParam): Promise<void> {
		await this.s3.putObject({
			Key: params.Key,
			ContentType: params.ContentType,
			Body: params.Body,
			Bucket: params.Bucket
		}).promise();
	}

	/**
	 * @param config as object
	 * @property `Bucket` bucket name as string
	 * @property `Key` filename as string
	 * @property `Expires` expiration time in milliseconds
	 * @returns url as string
	 */
	async putSignUrl (params: UploadParam): Promise<void> {
		const content: TypeContent = ContentType[params.ContentType] as unknown as TypeContent;

		return await this.putObject({
			Body: params.Body,
			Bucket: params.Bucket,
			ContentType: content,
			Key: params.Key
		});
	}

	/**
	 * @param config as object
	 * @property `Bucket` bucket name as string
	 * @property `Key` filename as string
	 * @property `Expires` expiration time in milliseconds
	 * @returns url as string
	 */
	async getSignUrl (params: GetPresignedParam): Promise<string> {
		const content = ContentType[params.ContentType];
		const url = await this.s3.getSignedUrlPromise('putObject', {
			...params,
			ContentType: content
		});
		return url;
	}
}
