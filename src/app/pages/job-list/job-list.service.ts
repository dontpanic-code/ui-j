import { Injectable } from '@angular/core';
import { Job } from '@app/models/job';
import { environment } from '@environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Recruiter } from '@app/models/recruiter';
import * as CryptoJS from 'crypto-js';  

@Injectable({
    providedIn: 'root'
})
export class JobListService {

    SECRET = ' slv ukr'
    allJobs;


    private idJobSource = new BehaviorSubject(0);
    public idJob: Observable<number>;

    // private idJobSource = new Subject();
    // idJob = this.idJobSource.asObservable();

    constructor(private http: HttpClient) {
        this.idJob = this.idJobSource.asObservable();
    }


    // Encryption in ASP.net Core and Decryption in Angular
    decryptData(key, ciphertextB64) {                              // Base64 encoded ciphertext, 32 bytes string as key
        var key = CryptoJS.enc.Utf8.parse(key);                             // Convert into WordArray (using Utf8)
        var iv = CryptoJS.lib.WordArray.create([0x00, 0x00, 0x00, 0x00]);   // Use zero vector as IV
        var decrypted = CryptoJS.AES.decrypt(ciphertextB64, key, {iv: iv}); // By default: CBC, PKCS7 
        return decrypted.toString(CryptoJS.enc.Utf8);                       // Convert into string (using Utf8)
    }
    // Encryption in ASP.net Core and Decryption in Angular



    getCandidates(): Promise<Job> {
        return new Promise((resolve, reject) => {
            this.http.get<Job[]>(`${environment.apiUrl}/Job`).subscribe((response: any) => {
                
                // var ciphertextB64 = "rYQO3W4lL1Tz5G9SiveCWlV/N4ntpaIh/bWwj+YxY30JvlgYIaRJuDrnMoj4F3FiCL2xgGRCTAZmdkaEDa+U9aSORFeh4T1KDBvyJZl/y90=";
                
                // var key = "01234567890123456789012345678901";
                // var decrypted = this.decryptData(key, ciphertextB64);

                // console.log("decrypted", decrypted);
                
                console.log("response", response);
                

                this.allJobs = response;
                resolve(response);
            }, reject);
        });
    }

    toggleIdJob(id: number){
        this.idJobSource.next(id);
    }
    

    enc(plainText){
        var textString = plainText+this.SECRET; // Utf8-encoded string
        var words = CryptoJS.enc.Utf8.parse(textString); // WordArray object
        var base64 = CryptoJS.enc.Base64.stringify(words); // string: 'SGVsbG8gd29ybGQ='
        return base64;
    }

    dec(cipherText){
        var base64 = cipherText; // 'SGVsbG8gd29ybGQ='
        var words = CryptoJS.enc.Base64.parse(base64); // WordArray object
        var textString = words.toString(CryptoJS.enc.Utf8); // string: 'Hello world'
        return textString.replace(this.SECRET,'');
    }
}
