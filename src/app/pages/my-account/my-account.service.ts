import { Injectable } from '@angular/core';
import { Person } from '@app/models/person';
import { environment } from '@environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { Recruiter } from '@app/models/recruiter';

@Injectable({
    providedIn: 'root'
})
export class MyAccountService {
    private resetFormSource = new Subject();
    resetForm = this.resetFormSource.asObservable();


    private removeButtonSource = new Subject();
    removeButtonState = this.removeButtonSource.asObservable();

    private hideFieldSource = new Subject();
    hideFieldState = this.hideFieldSource.asObservable();

    private editFormSource = new Subject();
    editForm = this.editFormSource.asObservable();


    constructor(private http: HttpClient) {
    }

    async getMyCv(): Promise<Person> {
        return new Promise((resolve, reject) => {
            this.http.get<Person[]>(`${environment.apiUrl}/Candidates/my`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        });
    }

    async getRecruiterCv(): Promise<Recruiter> {
        return new Promise((resolve, reject) => {
            this.http.get<Recruiter[]>(`${environment.apiUrl}/Recruiter/my`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        });
    }


    deleteCv() {
        return new Promise((resolve, reject) => {
            this.http.delete(`${environment.apiUrl}/Candidates`).subscribe(() => {
                resolve();
            }, reject);
        });
    }
    deleteRecruiter() {
        return new Promise((resolve, reject) => {
            this.http.delete(`${environment.apiUrl}/Recruiter`).subscribe(() => {
                resolve();
            }, reject);
        });
    }

    deleteUser() {
        return new Promise((resolve, reject) => {
            this.http.delete(`${environment.apiUrl}/Users`).subscribe(() => {
                resolve();
            }, reject);
        });
    }

    resetFormState() {
        this.resetFormSource.next();
    }

    editFormState() {
        this.editFormSource.next();
    }

    toggleRemoveButton(state: boolean) {
        this.removeButtonSource.next(state);
    }

    toggleHideField(state: boolean){
        this.hideFieldSource.next(state);
    }
}
