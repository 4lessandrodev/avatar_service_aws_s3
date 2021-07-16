/**
 * Do not change 
 * extensions are linked to ContentType
 * @link ContentType
 * @see ContentType on get-signed-url
 */
export enum Extension {
	PNG = 'png',
	JPEG = 'jpeg',
	BMP = 'bmp',
	GIF = 'gif'
}

export type ExtensionType = keyof typeof Extension;
export interface IFlenameService {
	generateRandomName: (extension: ExtensionType) => string;
}