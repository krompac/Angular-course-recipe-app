import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
export class LoggingService {
  lastLog: string;

  printLog(message: string) {
    console.log(message);

    if (this.lastLog) {
      console.log('last log: ' + this.lastLog);
    }

    this.lastLog = message;
  }
}
