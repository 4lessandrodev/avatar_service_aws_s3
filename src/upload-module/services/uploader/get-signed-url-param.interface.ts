/**
 * Do not change mimi type
 * Only images are suported
 * @see(ExtensionType) on filename generator
 * @link ExtensionType
 */
export enum ContentType {
	PNG = 'image/png',
	JPEG = 'image/jpeg',
	BMP = 'image/bmp',
	GIF = 'image/gif',
}

export type TypeContent = keyof typeof ContentType;
/**
 * 
 * @property Bucket bucket name as string
 * @property Key filename as string
 * @property Expires expiration time in mileseconds
 * @property ContentType @see(ContentType)
 */
export interface UrlSignParam {
	Bucket: string;
	Key: string;
	Expires: number;
	ContentType: keyof typeof ContentType;
}


/**
 * 
 * @property Bucket bucket name as string
 * @property Key filename as string
 * @property ContentType @see(ContentType)
 * @property Body body data
 */
export interface UploadParam {
	Bucket: string;
	Key: string;
	ContentType: TypeContent,
	Body?: NodeJS.ReadableStream;
}