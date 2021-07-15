
export enum ContentType {
	JSON = 'application/json',
	GIF = 'image/gif',
	JPEG = 'image/jpeg',
	MPEG = 'video/mpeg',
	PNG = 'image/png',
	PDF = 'application/pdf',
	PPT = 'application/vnd.ms-powerpoint',
	SVG = 'image/svg+xml'
}

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
	ContentType: keyof typeof ContentType,
	Body?: File;
}