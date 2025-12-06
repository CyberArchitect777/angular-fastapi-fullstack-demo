import { Component, signal } from '@angular/core';
import { UploadService } from './app.upload.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  file!: File;
  format = "csv";

  constructor(private upload: UploadService) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.upload.convert(this.file, this.format).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${this.format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}