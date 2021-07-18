import { Inject } from '@nestjs/common';
import { ImageService } from '../crop-image/crop-image.service';
import { UploadService } from '../uploader/uploader.service';
import {
	IAvatar, IAvatarService, AvatarProps
} from './generate-avatar.interface';
import {
	FilenameService
} from '../filename-generator/filename-generator.service';
import {
	ContentType,
	TypeContent
} from '../uploader/get-signed-url-param.interface';
import { resizeProps } from '../crop-image/crop-image.interface';
import { ExtensionType } from '../filename-generator/filename-generator.interface';

export class GenerateAvatarService implements IAvatarService {

	private readonly size_512: resizeProps = { width: 512, height: 512 };
	private readonly size_256: resizeProps = { width: 256, height: 256 };

	constructor (
		@Inject(ImageService)
		private readonly imgService: ImageService,

		@Inject(UploadService)
		private readonly uploadService: UploadService,

		@Inject(FilenameService)
		private readonly filenameGenerator: FilenameService,

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

	private getPathWithFilename (
		extension: ExtensionType, userId: string
	): string {
		const filename = this.filenameGenerator.generateRandomName(extension);
		const path = `${userId}/${filename}`;
		return path;
	}

	private getAvatarNameFromUrl (str: string): string {
		return str.slice(0, str.indexOf('?'));
	}

	async create (props: AvatarProps): Promise<IAvatar> {
		const { userId, extension } = props;

		const filename_512 = this.getPathWithFilename(extension, userId);
		const filename_256 = this.getPathWithFilename(extension, userId);

		const type: TypeContent = ContentType[extension] as unknown as TypeContent;

		const url512fromS3 = await this.getUrl(filename_512, type);
		const url256fromS3 = await this.getUrl(filename_256, type);

		const image512 = await this.cropImage512(props);
		const image256 = await this.cropImage256(props);

		await this.upload(image512, filename_512, type);
		await this.upload(image256, filename_256, type);

		const url512 = this.getAvatarNameFromUrl(url512fromS3);
		const url256 = this.getAvatarNameFromUrl(url256fromS3);

		return {
			original: url512,
			_64x64: url256,
			_100x100: url256,
			_256x256: url256,
			_512x512: url512,
		};
	}

	private async cropImage512 (props: AvatarProps): Promise<Buffer> {
		return await this.imgService.cropAndResizeFromBuffer(
			{
				...props,
				resize: { ...this.size_512 }
			}
		);
	}

	private async cropImage256 (props: AvatarProps): Promise<Buffer> {
		return await this.imgService.cropAndResizeFromBuffer(
			{
				...props,
				resize: { ...this.size_256 }
			}
		);
	}

	private async upload (image: Buffer, pathFilename: string, type: TypeContent): Promise<void> {

		return this.uploadService.putSignUrl({
			ContentType: type,
			Bucket: this.bucketName,
			Key: pathFilename,
			Body: image
		});
	}
}
