import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ExtensionType } from './upload-module/services/filename-generator/filename-generator.interface';
import { IAvatar, IAvatarService } from './upload-module/services/generate-avatar/generate-avatar.interface';
import { GenerateAvatarService } from './upload-module/services/generate-avatar/generate-avatar.service';

interface Props {
	file: Buffer,
	height: number,
	left: number,
	top: number,
	width: number;
	extension: ExtensionType;
}

@Injectable()
export class AppService {
	constructor (
		@Inject(GenerateAvatarService) private readonly avatarService: IAvatarService
	) { }

	async createAvatar (props: Props): Promise<IAvatar> {
		const { height, left, top, width, file, extension } = props;
		const result = await this.avatarService.create({
			cropPositions: { height, left, top, width },
			extension,
			file: file,
			userId: randomUUID()
		});

		return result;
	}
}
