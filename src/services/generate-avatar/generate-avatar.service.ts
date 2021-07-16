import { Inject } from '@nestjs/common';
import { ImageService } from '../crop-image/crop-image.service';
import { UploadService } from '../uploader/uploader.service';
import {
	IAvatar, IAvatarService, AvatarProps
} from './generate-avatar.interface';
import {
	FilenameServie
} from '../filename-generator/filename-generator.service';
import {
	ContentType,
	TypeContent, UploadParam
} from '../uploader/get-signed-url-param.interface';

export class generateAvatarService implements IAvatarService {
	constructor (
		@Inject(ImageService)
		private readonly imgService: ImageService,

		@Inject(UploadService)
		private readonly uploadService: UploadService,

		@Inject(FilenameServie)
		private readonly filenameGenerator: FilenameServie,

		@Inject('BUCKET_NAME')
		private readonly bucketName: string
	) { }

	private async getUrl (filename: string, type: TypeContent): Promise<string> {
		return await this.uploadService.getSignUrl(
			{
				Bucket: this.bucketName,
				ContentType: type,
				Key: filename
			}
		);
	}

	async create (props: AvatarProps): Promise<IAvatar> {

		const { file, userId, crop, extension } = props;

		const filename_512 = userId + '/' + this.filenameGenerator
			.generateRandomName(extension);

		const filename_256 = userId + '/' + this.filenameGenerator
			.generateRandomName(extension);

		const type: TypeContent = ContentType[extension] as unknown as TypeContent;

		const _512x512 = await this.getUrl(filename_512, type);
		const _256x256 = await this.getUrl(filename_256, type);

		const image = await this.imgService.crop({ file, positions: crop });

		const file_512x512 = await this.imgService.resize(
			{ file: image, width: 512, height: 512 }
		);

		const file_256x256 = await this.imgService.resize(
			{ file: image, width: 256, height: 256 }
		);

		await this.upload(file_512x512, {
			ContentType: type,
			Bucket: this.bucketName,
			Key: filename_512
		});

		await this.upload(file_256x256, {
			ContentType: type,
			Bucket: this.bucketName,
			Key: filename_256
		});

		return {
			original: _512x512,
			_64x64: _256x256,
			_100x100: _256x256,
			_256x256: _256x256,
			_512x512: _512x512,
		};
	}

	async upload (
		file: NodeJS.ReadableStream,
		params: UploadParam
	): Promise<void> {
		await this.uploadService.putSignUrl({ ...params, Body: file });
	}
}