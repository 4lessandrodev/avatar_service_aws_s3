import { IPositions } from '../crop-image/crop-image.interface';
import { ExtensionType } from '../filename-generator/filename-generator.interface';
import { UploadParam } from '../uploader/get-signed-url-param.interface';
export interface IAvatar {
	original: string;
	_64x64: string;
	_100x100: string;
	_256x256: string;
	_512x512: string;
}

export interface AvatarProps {
	file: NodeJS.ReadableStream;
	userId: string;
	crop: IPositions;
	extension: ExtensionType;
}
export interface IAvatarService {
	create: (props: AvatarProps) => Promise<IAvatar>;
	upload: (
		avatar: NodeJS.ReadableStream,
		params: UploadParam
	) => Promise<void>;
}