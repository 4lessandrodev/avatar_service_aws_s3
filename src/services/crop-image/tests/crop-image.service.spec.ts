import { createReadStream, writeFileSync } from 'fs';
import Sharp from 'sharp';
import { ImageService } from '../crop-image.service';
import path from 'path';
import { streamToBuffer } from '@jorgeferrero/stream-to-buffer';

describe('crop-image.service', () => {

	const imgService: ImageService = new ImageService(Sharp());

	it('should crop an image', async () => {

		const readPath = __dirname + path.join('/image.jpeg');
		const writePath = __dirname + path.join('/result.png');

		const file = createReadStream(readPath);

		const result = await imgService.crop({
			file,
			positions: {
				width: 100,
				height: 100,
				top: 100,
				left: 100
			}
		});

		const resized = await imgService.resize({ file: result, width: 200 });

		const data = await streamToBuffer(resized);

		writeFileSync(writePath, data);

		expect(result).toBeTruthy();

	});
});