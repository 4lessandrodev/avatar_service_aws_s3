import env from 'env-var';
const read = env.from(process.env, {}, env.logger);


export const BUCKET_NAME = read
	.get('BUCKET_NAME')
	.required()
	.asString();

export const AWS_S3_SECRET_ACCESS_KEY = read
	.get('AWS_S3_SECRET_ACCESS_KEY')
	.required()
	.asString();

export const AWS_BUCKET_REGION = read
	.get('AWS_BUCKET_REGION')
	.required()
	.asString();

export const AWS_S3_SECRET_KEY_ID = read
	.get('AWS_S3_SECRET_KEY_ID')
	.required()
	.asString();

