import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Person} from '@app/models/person';
import {environment} from '@environment';
import {HttpClient} from '@angular/common/http';
import { Chats } from '@app/models/chats';
import { Messages } from '@app/models/messages';
import { Job } from '@app/models/job';

export interface Countries {
    id: number;
    name: string;
    iso2: string;
}

@Injectable({
    providedIn: 'root'
})

export class HireServiceService {
    allCandidates;
    allChats;
    allMessages;
    allCountries;
    allMyJobs;

    allJobs;

    job: Job
    
    private hireFilterSource = new Subject();
    currentFilter = this.hireFilterSource.asObservable();

    private jobFilterSource = new Subject();
    currentJobFilter = this.jobFilterSource.asObservable();

    private forumFilterSource = new Subject();
    currentForumFilter = this.forumFilterSource.asObservable();


    private helpFilterSource = new Subject();
    currentHelpFilter = this.helpFilterSource.asObservable();

    private isCollapsedSource = new Subject();
    currentIsCollapsed = this.isCollapsedSource.asObservable();

    constructor(private http: HttpClient) {
        // this.getListCountries()
    }

    updateFilter(filterValues: []) {
        this.hireFilterSource.next(filterValues);
    }

    updateJobFilter(filterValues: []) {        
        this.jobFilterSource.next(filterValues);
    }

    updateForumFilter(filterValues) {
        console.log("filterValues", filterValues);
        
        this.forumFilterSource.next(filterValues);
    }

    updateHelpFilter(filterValues: []) {
        this.helpFilterSource.next(filterValues);
    }

    updateIsCollapsed(isCollapsed: boolean) {
        this.isCollapsedSource.next(isCollapsed);
    }

    getIsCollapsed(){
        return this.currentIsCollapsed
    }

    getCandidates(): Promise<Person> {
        return new Promise((resolve, reject) => {
            this.http.get<Person[]>(`${environment.apiUrl}/Candidates`).subscribe((response: any) => {
                this.allCandidates = response;
                resolve(response);
            }, reject);
        });
    }

    getCandidatesFullInfo(): Promise<Person> {
        return new Promise((resolve, reject) => {
            this.http.get<Person[]>(`${environment.apiUrl}/Candidates/private`).subscribe((response: any) => {
                this.allCandidates = response;
                resolve(response);
            }, reject);
        });
    }

    addCandidate(personalInfo): Observable<any> {
        return this.http.post(`${environment.apiUrl}/Candidates/`, personalInfo);
    }
    addRecruiter(personalInfo): Observable<any> {
        return this.http.post(`${environment.apiUrl}/Recruiter/`, personalInfo);
    }


    enumKeys(e) {
        return Object.keys(e).filter(k => !isNaN(Number(k)));
    }

    getChats(info): Observable<any>{
        return this.http.post(`${environment.apiUrl}/Chats/`, info);
    }

    addMessages(info): Observable<any>{
        return this.http.post(`${environment.apiUrl}/Messages/`, info);
    }

    getListChats(): Promise<Chats>{
        return new Promise((resolve, reject) => {
            this.http.get<Chats[]>(`${environment.apiUrl}/Chats`).subscribe((response: any) => {
                this.allChats = response;
                resolve(response);
            }, reject);
        });
    }

    getListMessages(): Promise<Messages>{
        return new Promise((resolve, reject) => {
            this.http.get<Messages[]>(`${environment.apiUrl}/Messages`).subscribe((response: any) => {               
                this.allMessages = response;
                resolve(response);
            }, reject);
        });
    }

    getListMyJobs(): Promise<Job>{
        return new Promise((resolve, reject) => {
            this.http.get<Job[]>(`${environment.apiUrl}/Job/myjobs`).subscribe((response: any) => {               
                this.allMyJobs = response;
                console.log(this.allMyJobs);
                
                resolve(response);
            }, reject);
        });
    }


    async getListCountries(): Promise<Countries>{
        return new Promise(async(resolve, reject) => {
            const headers = { 'X-CSCAPI-KEY': environment.countrystatecity}
            await this.http.get<Countries[]>(`https://api.countrystatecity.in/v1/countries`, {headers}).subscribe((response: any) => {
                this.allCountries = response;
                resolve(response);
            }, reject);
        });
    }

    addJob(jobDescribe): Observable<any> {
        console.log(jobDescribe);
        
        this.job = {
            aboutProject: jobDescribe.aboutProject,
            benefits: jobDescribe.benefits,
            companyName: jobDescribe.companyName,
            contacts: jobDescribe.contacts,
            employmentType: jobDescribe.employmentType,
            englishLevel: jobDescribe.englishLevel,
            jobRequirements: jobDescribe.jobRequirements,
            jobTitle: jobDescribe.jobTitle,
            salaryRange: jobDescribe.salaryRange,
            stack: jobDescribe.stack,
            stagesInterview: jobDescribe.stagesInterview,
            workplaceType: jobDescribe.workplaceType,
            contactType: jobDescribe.contactType,
            contactLink: jobDescribe.contactsLink,
            tags: jobDescribe.tags,
            country: jobDescribe.country,
            city: jobDescribe.city,
            experience: jobDescribe.experience,
        }

        console.log( this.job);
        return this.http.post(`${environment.apiUrl}/Job/`, this.job);
    }

    deleteJob(id){
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/Job/deletejob`, id).subscribe(() => {
                resolve();
            }, reject);
        });
    }

    updateJob(jobDescribe): Observable<any> {
        console.log(jobDescribe);
        
        this.job = {
            aboutProject: jobDescribe.aboutProject,
            benefits: jobDescribe.benefits,
            companyName: jobDescribe.companyName,
            contacts: jobDescribe.contacts,
            employmentType: jobDescribe.employmentType,
            englishLevel: jobDescribe.englishLevel,
            jobRequirements: jobDescribe.jobRequirements,
            jobTitle: jobDescribe.jobTitle,
            salaryRange: jobDescribe.salaryRange,
            stack: jobDescribe.stack,
            stagesInterview: jobDescribe.stagesInterview,
            workplaceType: jobDescribe.workplaceType,
            contactType: jobDescribe.contactType,
            contactLink: jobDescribe.contactsLink,
            tags: jobDescribe.tags,
            id: jobDescribe.id,
            dateCreated: jobDescribe.dateCreated,
            email: jobDescribe.email,
            isApproved: false,
            country: jobDescribe.country,
            city: jobDescribe.city,
            experience: jobDescribe.experience,
        }

        console.log( this.job);
        return this.http.post(`${environment.apiUrl}/Job/udpadtejob`, this.job);
    }

    getAllJobs(idJob): Promise<Job> {
        return new Promise((resolve, reject) => {
            this.http.get<Job[]>(`${environment.apiUrl}/Job/alljobs`).subscribe((response: any) => {                
                console.log("response", response);
                this.allJobs = response;

                this.allJobs =  response.find((item) => item.id == idJob);
                console.log("idJob", idJob);
                console.log("this.allJobs", this.allJobs);

                resolve(response);
            }, reject);
        });
    }
}
