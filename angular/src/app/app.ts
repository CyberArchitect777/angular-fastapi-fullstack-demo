import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  inputfile!: File;
  outputformat = "csv";

  onSubmit(e: Event) {
    e.preventDefault();
    (async () => {
      if (! this.inputfile) {
        return;
      }

      const formData = new FormData();
      formData.append('file', this.inputfile);
      formData.append('outputformat', this.outputformat);

      try {
        const uploadTry = await fetch('http://localhost:8000/process', {
          method: 'POST',
          body: formData
        });

        if (!uploadTry.ok) {
          alert('Upload failed: ' + uploadTry.status + ' ' + uploadTry.statusText);
          return;
        }

        const blob = await uploadTry.blob();
        const filename = `output.${this.outputformat}`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert('Request error: ' + err);
      }
    })();
  }

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const fileDisplay = document.getElementById('inputfile-text');
    let submitButton = document.getElementById('submit-button') as HTMLButtonElement;
    if (input.files && input.files.length > 0) {
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "red";
      this.inputfile = input.files[0];
      if (fileDisplay) {
        fileDisplay.textContent = "File selected: " + this.inputfile.name;
        const fileExtension = this.inputfile.name.split('.').pop()?.toLowerCase();
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
        submitButton.disabled = false;
        submitButton.style.backgroundColor = "grey";
        fileDisplay.textContent = "No file selected";
      }
    }
  }
}