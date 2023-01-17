import {Injectable} from '@angular/core';
import {environment} from '@environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Job } from '@app/models/job';

@Injectable({
    providedIn: 'root'
})

export class ModeratorService {
    public allJobs;

    constructor(private http: HttpClient) {
    }

    getAllJobs(): Promise<Job> {
        return new Promise((resolve, reject) => {
            this.http.get<Job[]>(`${environment.apiUrl}/Job/alljobs`).subscribe((response: any) => {
                this.allJobs = response;
                console.log(response);
                console.log(this.allJobs);
                
                resolve(response);
            }, reject);
        });
    }   

    deleteJob(id){
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/Job/deletejob`, id).subscribe(() => {
                resolve();
            }, reject);
        });
    }    

    changeApproved(job){
        console.log(job);        
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/Job/updatejobmod`, job).subscribe(() => {
                resolve();
            }, reject);
        });
    }

    sendToTelegramBot(job){
        console.log(job);    
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
        })
        let options = { headers: headers };
        
        
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.telegramBot}/send`, job, options).subscribe(() => {
                resolve();
            }, reject);
        });
    }

}
