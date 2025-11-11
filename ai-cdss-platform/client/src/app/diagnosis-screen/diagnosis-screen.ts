import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-diagnosis-screen',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './diagnosis-screen.component.html',
  styleUrl: './diagnosis-screen.component.css'
})
export class DiagnosisScreenComponent {
  patientId = '';
  liveTranscript = '';
  doctorId = '123'; // Hardcoded for now

  constructor(private http: HttpClient) {}

  onSubmit() {
    const symptomData = {
      patientId: this.patientId,
      liveTranscript: this.liveTranscript,
      doctorId: this.doctorId
    };

    this.http.post('/api/call/symptoms', symptomData)
      .subscribe(response => {
        console.log('Symptom logged successfully:', response);
      }, error => {
        console.error('Error logging symptom:', error);
      });
  }
}
