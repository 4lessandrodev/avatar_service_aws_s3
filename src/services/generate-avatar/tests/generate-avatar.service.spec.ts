import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import path from 'path/posix';
import sharp from 'sharp';
import { ImageService } from '../../crop-image/crop-image.service';
import { FilenameServie } from '../../filename-generator/filename-generator.service';
import { UploadService } from '../../uploader/uploader.service';
import { IAvatarService } from '../generate-avatar.interface';
import { GenerateAvatarService } from '../generate-avatar.service';

describe("generate-avatar.service", () => {

	let fakeS3: S3;
	let service: IAvatarService;
	let readPath: string;
	let file: NodeJS.ReadableStream;

	beforeAll(async () => {
		readPath = __dirname + path.join('/image.jpeg');
		file = createReadStream(readPath);
	});

	beforeEach(() => {

		fakeS3 = {
			getSignedUrlPromise: jest.fn(() => 'https://aws.bucket/random')
		} as unknown as S3;

		service = new GenerateAvatarService(new ImageService(sharp()), new UploadService(fakeS3), new FilenameServie(), 'testes');
	});

	it("should generate a valid avatar", async () => {

		const result = await service.create({
			crop: {
				height: 200,
				left: 200,
				top: 200,
				width: 200
			},
			extension: 'PNG',
			userId: randomUUID(),
			file
		});

		expect(result).toBeTruthy();
		expect(result).toEqual({
			original: 'https://aws.bucket/random',
			_64x64: 'https://aws.bucket/random',
			_100x100: 'https://aws.bucket/random',
			_256x256: 'https://aws.bucket/random',
			_512x512: 'https://aws.bucket/random'
		});
	});
});