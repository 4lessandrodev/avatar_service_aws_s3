import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Extension, ExtensionType, IFlenameService } from './filename-generator.interface';

@Injectable()
export class FilenameServie implements IFlenameService {

	generateRandomName (extension: ExtensionType): string {
		return randomUUID() + '.' + Extension[extension];
	}
}