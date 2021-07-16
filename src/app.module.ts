import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadService } from './services/uploader/uploader.service';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [
		{
			provide: S3,
			useFactory: () => new S3()
		},
		UploadService, AppService],
})
export class AppModule { }
