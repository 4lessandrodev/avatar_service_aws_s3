import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IAvatarService } from './upload-module/services/generate-avatar/generate-avatar.interface';
import { GenerateAvatarService } from './upload-module/services/generate-avatar/generate-avatar.service';

interface Props {
	file: NodeJS.ReadStream,
	height: number,
	left: number,
	top: number,
	width: number;
}

@Injectable()
export class AppService {
	constructor (
		@Inject(GenerateAvatarService) private readonly avatarService: IAvatarService
	) { }

	async createAvatar (props: Props): Promise<void> {
		const { height, left, top, width, file } = props;
		const result = await this.avatarService.create({
			crop: { height, left, top, width },
			extension: 'PNG',
			file: file as unknown as NodeJS.ReadStream,
			userId: randomUUID()
		});

		console.log(result);
	}
}
