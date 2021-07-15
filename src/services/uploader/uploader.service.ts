import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { UploadParam } from './get-signed-url-param.interface';
import { IUploaderService } from './uploader.interface';

@Injectable()
export class UploadService implements IUploaderService {
	constructor (
		@Inject(S3)
		private readonly s3: S3,
	) { }

	async uploadOne (): Promise<string>{return '1'};

	async uploadMany (params: UploadParam[]): Promise<void> {
		const promises: Promise<{}>[] = [];

		for (const param of params) {
			const upload = this.s3.upload(param, {}).promise;
			promises.push(new Promise(upload));
		}

		Promise.all(promises);
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
		return await this.s3.getSignedUrlPromise('putObject', params);
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
		return await this.s3.getSignedUrlPromise('getObject', params);
	}
}
