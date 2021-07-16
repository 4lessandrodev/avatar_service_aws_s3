import { Inject, Injectable } from '@nestjs/common';
import { cropProps, IImageService, resizeProps } from './crop-image.interface';
import { Sharp } from 'sharp';

@Injectable()
export class ImageService implements IImageService {

	constructor (
		@Inject()
		private readonly sharp: Sharp
	) { }

	private toFloor (value: number): number {
		return Math.floor(value);
	}

	async crop (props: cropProps): Promise<NodeJS.ReadableStream> {

		const { width, top, left, height } = props.positions;

		return props.file.pipe(this.sharp).extract({
			height: this.toFloor(height),
			left: this.toFloor(left),
			top: this.toFloor(top),
			width: this.toFloor(width)
		}).png();
	};

	async resize (props: resizeProps): Promise<NodeJS.ReadableStream> {
		const { height, width } = props;
		return props.file.pipe(this.sharp).resize(width, height).png();
	};
}