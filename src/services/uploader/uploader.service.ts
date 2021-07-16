import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ContentType, UploadParam } from './get-signed-url-param.interface';
import { IUploaderService } from './uploader.interface';

@Injectable()
export class UploadService implements IUploaderService {
	constructor (
		@Inject(S3)
		private readonly s3: S3
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

	/**
	 *
	 * @param config as object
	 * @property `Bucket` bucket name as string
	 * @property `Key` filename as string
	 * @property `Expires` expiration time in mileseconds
	 * @returns url as string
	 */
	async putSignUrl (params: UploadParam): Promise<string> {

		const content = ContentType[params.ContentType];

		return await this.s3.getSignedUrlPromise('putObject', {
			...params,
			ContentType: content
		});
	}
	/**
	 *
	 * @param config as object
	 * @property `Bucket` bucket name as string
	 * @property `Key` filename as string
	 * @property `Expires` expiration time in mileseconds
	 * @returns url as string
	 */
	async getSignUrl (params: UploadParam): Promise<string> {

		const content = ContentType[params.ContentType];

		return await this.s3.getSignedUrlPromise('getObject', {
			...params,
			ContentType: content
		});
	}
}
