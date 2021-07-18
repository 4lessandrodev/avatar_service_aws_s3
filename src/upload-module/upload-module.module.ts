import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ImageService } from './services/crop-image/crop-image.service';
import { FilenameService } from './services/filename-generator/filename-generator.service';
import { GenerateAvatarService } from './services/generate-avatar/generate-avatar.service';
import { UploadService } from './services/uploader/uploader.service';
import { UploadController } from './upload-module.controller';
import {
	AWS_BUCKET_REGION,
	AWS_S3_SECRET_ACCESS_KEY,
	AWS_S3_SECRET_KEY_ID,
	BUCKET_NAME
} from '../config/env';
import { FilesConverterService } from './services/files-converter/files-converter.service';

@Module({
	imports: [],
	providers: [
		FilesConverterService,
		FilenameService,
		ImageService,
		{
			provide: 'BUCKET_NAME',
			useValue: BUCKET_NAME
		},
		{
			provide: S3,
			useFactory: () => new S3(
				{
					region: AWS_BUCKET_REGION,
					signatureVersion: 'v2',
					credentials: {
						accessKeyId: AWS_S3_SECRET_KEY_ID,
						secretAccessKey: AWS_S3_SECRET_ACCESS_KEY
					}
				}
			)
		},
		UploadService,
		GenerateAvatarService
	],
	controllers: [UploadController],
	exports: [GenerateAvatarService, FilesConverterService],
})
export class UploadModule { }