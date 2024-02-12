import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
declare var webkitSpeechRecognition: any;
@Injectable({
  providedIn: 'root'
})

export class RecogzService {

  recognition = new webkitSpeechRecognition();
  isRecording = false;
  text:any = '';

  constructor() {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    // this.recognition.lang = 'en-US';
  }
  
  
  start() {
    this.isRecording = true;
    this.recognition.start();
    this.recognition.onresult = (event: { resultIndex: any; results: string | any[]; }) => {
       const interimTranscripts = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.text += transcript + ' ';
        } else {
           interimTranscripts.push(transcript);
        }
        // console.log(this.text);
        
      }
    };
  }

  stop() {
    this.isRecording = false;
    this.recognition.stop();
  }

  // getText():Observable<any> {
  //   return this.text;
  // }
  
}
