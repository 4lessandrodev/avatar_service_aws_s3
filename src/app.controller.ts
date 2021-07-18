import {
	Controller,
	Get,
	Inject,
	Post,
	Redirect,
	Render,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ExtractFileType, MimeTypes } from './upload-module/services/extract-file-type/extract-file-type.service';
import { IAvatar } from './upload-module/services/generate-avatar/generate-avatar.interface';

@Controller()
export class AppController {
	constructor (
		@Inject(AppService)
		private readonly appService: AppService,
	) { }

	private db: IAvatar = {
		_100x100: '',
		_256x256: '',
		_512x512: '',
		_64x64: '',
		original: ''
	};

	@Get()
	@Render('index')
	root () {

	}


	@Get('/uploaded')
	@Render('uploaded')
	images () {
		return { ...this.db };
	}

	@Post()
	@Redirect('/uploaded')
	@UseInterceptors(FileInterceptor('file'))
	async post (
		@UploadedFile() file: Express.Multer.File
	) {

		const extension = new ExtractFileType()
			.extractFromMimetype(file.mimetype as MimeTypes);

		const result = await this.appService.createAvatar({
			file: file.buffer,
			height: 200,
			width: 200,
			top: 200,
			left: 200,
			extension
		});

		this.db = result;
	}
}
