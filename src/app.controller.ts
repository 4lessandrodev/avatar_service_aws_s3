import {
	Controller,
	Get,
	Post,
	Redirect,
	Render,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Duplex } from 'stream';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor (private readonly appService: AppService) { }

	@Get()
	@Render('index')
	root () {

	}

	@Post()
	@Redirect('/')
	@UseInterceptors(FileInterceptor('file'))
	post (
		@UploadedFile() file: Express.Multer.File
	) {

		const tmp = new Duplex();
		tmp.push(file.buffer);
		tmp.push(null);


		this.appService.createAvatar({
			file: tmp as any,
			height: 200,
			width: 200,
			top: 200,
			left: 200
		});
	}
}
