import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@app/models/family';
import { environment } from '@environment';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { LocalService } from './local.service';
import { StorageService } from './storage.service';
import { MyAccountService } from '@app/pages/my-account/my-account.service';
import { Recruiter } from '@app/models/recruiter';
import { Person } from '@app/models/person';
import { ModeratorsEmail } from '@app/models/enum/moderators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private isAuthenticatedSubject = new BehaviorSubject(false);
    public isAuthenticated: Observable<boolean>;

    private isRecruiterSubject = new BehaviorSubject(false);
    public isRecruiter: Observable<boolean>;

    private isModeratorSubject = new BehaviorSubject(false);
    public isModerator: Observable<boolean>;

    private isAuthorSubject = new BehaviorSubject(false);
    public isAuthor: Observable<boolean>;

    private apiUrl: string;
    public userType: BehaviorSubject<string>; 

    private localService: LocalService
    private accountService: MyAccountService
    private person: Recruiter
    private seeker: Person
    moderators = [];

    public isMainTypeUserSubject = new BehaviorSubject(false);
    public isMainTypeUser: Observable<boolean>;


    // fix login
    private newCurrentUserSource = new Subject();
    newCurrentUser = this.newCurrentUserSource.asObservable();

    private nameTypeUserMainSource = new Subject();
    nameTypeUserMain = this.nameTypeUserMainSource.asObservable();
    

    constructor(private http: HttpClient, private router: Router) {
        this.apiUrl = environment.apiUrl;
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
        this.isRecruiter = this.isRecruiterSubject.asObservable();
        this.isModerator = this.isModeratorSubject.asObservable();
        this.isAuthor = this.isAuthorSubject.asObservable();
        this.isMainTypeUser = this.isMainTypeUserSubject.asObservable();

        this.userType = new BehaviorSubject<string>("0");
        this.localService = new LocalService(new StorageService)

        this.accountService = new MyAccountService(http)     
        // this.person = new Recruiter();  
        // this.person.company = this.person.position = "";
        this.moderators = Object.keys(ModeratorsEmail).filter((x) => Number.isNaN(Number(x)));
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    getAuthProfile() {
        return this.http.get<any>(`${this.apiUrl}/auth/getProfile`)
            .pipe(map(async user => {
                this.localService.setJsonValue('currentUser', user);  

                // this.toggleCurrentUser(user);
                this.newCurrentUserSource.next(user)

                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(true);

                // dontpanic.team
                if(user.Result.Email.indexOf("dontpanic.team")!=-1){
                    console.log("user.Result.Email.indexOf('dontpanic.team')", user.Result.Email.indexOf("dontpanic.team"));                    
                    this.isAuthorSubject.next(true);
                }

                if(user.Result.Email.indexOf("helloworld")!=-1){
                    console.log("user.Result.Email.indexOf('helloworld')", user.Result.Email.indexOf("helloworld"));                    
                    this.isAuthorSubject.next(true);
                }

                if(user.Result.TypeUser == "recruiter")
                    this.isRecruiterSubject.next(true);

                if(this.moderators.includes(user.Result.Email)){
                    this.isModeratorSubject.next(true);
                }
                

                // this.person = new Recruiter();  
                // this.person.company = this.person.position = "";
                this.person = await this.accountService.getRecruiterCv(); 
                this.seeker = await this.accountService.getMyCv(); 

                if (this.person == null && !this.person) {
                } 
                else {
                    if (this.person.company === 'Other'){
                        let data = { secret: this.person.companyOther };
                        this.localService.setJsonValue('company', JSON.stringify(data));
                    }
                    else{
                        let data = { secret: this.person.company };
                        this.localService.setJsonValue('company', JSON.stringify(data));
                    }  

                    if (this.person.position === 'Other'){
                        let data = { secret: this.person.positionOther };
                        this.localService.setJsonValue('position', JSON.stringify(data));
                    }
                    else{
                        let data = { secret: this.person.position };
                        this.localService.setJsonValue('position', JSON.stringify(data));
                    } 
                }

                if (this.seeker == null && !this.seeker) {
                } else {
                    let data = { name: ""+this.seeker.position+ " ("+this.seeker.country+", "+this.seeker.city+")"};
                    this.localService.setJsonValue('seekerForChat', JSON.stringify(data));      
                }

                // this.router.navigate(['/my-account']);
                // window.location.reload();
                return user;
            }));
    }

    checkAuth() {
        if (environment.isLocal) {
            this.devAuth().finally(() => {
                this.getAuthProfile().subscribe();
            });
        } else {
            this.getAuthProfile().subscribe();
        }      
    }

    login(provider: string, userType: string) {              
        window.location.href = `${this.apiUrl}/auth/SignIn?typeUser=${userType}&provider=${provider}&&redirectUrl=${window.location.origin + '/afterlogin'}`;  
    }

    logout() {
        this.http.post<any>(`${this.apiUrl}/auth/logout`,{})
        .subscribe(res => {
            this.isAuthenticatedSubject.next(false);
            this.isRecruiterSubject.next(false);
            this.currentUserSubject.next(null);
            this.isModeratorSubject.next(false);
            this.router.navigate(['/']);
            localStorage.clear();
        })
    }


    devAuth(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get<any>(`${environment.apiUrl}/DevAuth/devlog?pwd=stayhome`).subscribe((response: any) => {
                resolve(response);
            }, reject);
        });
    }

    toggleCurrentUser(state: User){
        this.newCurrentUserSource.next(state);
    }

    updateNameTypeUserMain(value: string) {  
        this.nameTypeUserMainSource.next(value);
    }
}