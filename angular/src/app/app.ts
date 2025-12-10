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

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const fileDisplay = document.getElementById('inputfile-text');
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      if (fileDisplay) {
        fileDisplay.textContent = "File selected: " + this.file.name;
        // Extract file extension
        const fileExtension = this.file.name.split('.').pop()?.toLowerCase();
        switch (fileExtension) {
          case 'csv':
            fileDisplay.textContent += " (CSV file)";
            break;
          case 'xlsx':
            fileDisplay.textContent += " (Excel file)";
            break;
          case 'parquet':
            fileDisplay.textContent += " (Parquet file)";
            break;
          default:
            break;
        }
      }
    }
    else {
      if (fileDisplay) {
        fileDisplay.textContent = "No file selected";
      }
    }
  }
}