import { S3 } from 'aws-sdk';
import { createReadStream } from 'fs';
import path from 'path/posix';
import { UploadParam } from '../get-signed-url-param.interface';
import { UploadService } from '../uploader.service';

describe('uploader.service', () => {

	let fakeS3: S3;
	let readPath: string;
	let file: NodeJS.ReadableStream;

	beforeAll(async () => {
		readPath = __dirname + path.join('/image.jpeg');
		file = createReadStream(readPath);
	});

	beforeEach(() => {
		fakeS3 = {
			getSignedUrlPromise: jest.fn(),
			upload: jest.fn()
		} as unknown as S3;
	});

	it("should be defined", () => {
		const service = new UploadService(fakeS3);
		expect(service).toBeDefined();
	});

	it('should call get pre-signed url ', async () => {

		const fakeUrl = 'https://aws.s3/bucket-fake/fake-image.jpeg';

		jest.spyOn(fakeS3, 'getSignedUrlPromise')
			.mockResolvedValueOnce(fakeUrl);

		const service = new UploadService(fakeS3);

		const result = await service.getSignUrl({
			Bucket: 'valid_bucket_name',
			ContentType: 'JPEG',
			Key: 'filename.jpeg'
		});

		expect(result).toBe(fakeUrl);
	});

	it('should call put pre-signed url ', async () => {

		const fakeUrl = 'https://aws.s3/bucket-fake/fake-image.jpeg';
		const params = {
			Bucket: 'valid_bucket_name',
			ContentType: 'JPEG',
			Key: 'filename.jpeg',
		};

		const s3Spy = jest.spyOn(fakeS3, 'getSignedUrlPromise')
			.mockResolvedValueOnce(fakeUrl);

		const service = new UploadService(fakeS3);

		await service.putSignUrl(params as UploadParam);

		expect(s3Spy).toHaveBeenLastCalledWith("putObject",
			{
				"Bucket": "valid_bucket_name",
				"ContentType": "image/jpeg",
				"Key": "filename.jpeg"
			});
	});


	it('should call upload one file', async () => {

		const params: UploadParam = {
			Bucket: 'valid_bucket_name',
			ContentType: 'JPEG',
			Key: 'filename.jpeg',
			Body: file
		};

		const s3Spy = jest.spyOn(fakeS3, 'upload')
			.mockImplementationOnce(jest.fn());

		const service = new UploadService(fakeS3);

		await service.uploadOne(params);

		expect(s3Spy).toHaveBeenLastCalledWith(params);
	});

	it('should call upload many files', async () => {

		const params: UploadParam = {
			Bucket: 'valid_bucket_name',
			ContentType: 'JPEG',
			Key: 'new.jpeg',
			Body: file
		};

		const s3Spy = jest.spyOn(fakeS3, 'upload')
			.mockImplementationOnce(jest.fn());

		const service = new UploadService(fakeS3);

		await service.uploadMany([params, params]);

		expect(s3Spy).toHaveBeenLastCalledWith(params);
	});
});