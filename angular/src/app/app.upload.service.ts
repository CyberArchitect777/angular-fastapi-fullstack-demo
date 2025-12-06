import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: "root" })
export class UploadService {
    private api = "http://localhost:8000/process"

    constructor(private http: HttpClient) {}

    convert(file: File, outputFormat: string): Observable<Blob> {
        const fd = new FormData();

        fd.append('file', file);
        fd.append('output-format', outputFormat);

        return this.http.post(this.api, fd, { responseType: 'blob' });
    }
}