import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
    name: 'imgUrl',
    standalone: true
})
export class ImgUrlPipe implements PipeTransform {
    transform(filename: string, folder?: string): string {
        if (!filename) return '';
        const baseUrl = environment.imageBaseUrl;
        return folder ? `${baseUrl}/${folder}/${filename}` : `${baseUrl}/${filename}`;
    }
}
