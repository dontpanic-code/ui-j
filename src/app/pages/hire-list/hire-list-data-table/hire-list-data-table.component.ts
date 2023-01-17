import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {EnglishLevels, EnglishLevelsShort} from '@app/models/enum/englishLevels';
import {Positions} from '@app/models/enum/positions';
import {Experience} from '@app/models/enum/experience';
import {MatSort} from '@angular/material/sort';
import {HireServiceService} from '@app/pages/hire-list/hire-service.service';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {MatSnackBarService} from '@app/services';
import { AuthenticationService } from '@app/services/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import { LocalService } from '@app/services/local.service';
import { Person } from '@app/models/person';
import { ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatController, User, IChatParticipant, ParticipantResponse, Theme, Window } from 'ng-chat';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from '@app/services/signal-r.service';
import { SignalRGroupAdapter } from './signalr-group-adapter';
import { TranslateService } from '@ngx-translate/core';

function isMobile(){
    var ua = navigator.userAgent;
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
      return true

    else if(/Chrome/i.test(ua))
        return true

    else
        return true
    // return false
}

export interface CurrentUser {
    FullName: string;
    Email: string;
    TypeUser: string;
    Id: number;
  }

@Component({
    selector: 'app-hire-list-data-table',
    templateUrl: './hire-list-data-table.component.html',
    styleUrls: ['./hire-list-data-table.component.scss', './ng-chat.theme.dark.css']
})



export class HireListDataTableComponent implements OnInit {

    @ViewChild('ngChatInstance')
        protected ngChatInstance: IChatController;
    @ViewChild('ngChatInstance')
        protected ngChatParticipant: IChatParticipant[];
    @ViewChild('ngChatInstance')
        protected windows: Window[];
    @ViewChild('ngChatInstance')
        protected window: Window;

    public adapter: ChatAdapter;
    public englishLevelsShort = EnglishLevelsShort;
    public englishLevels = EnglishLevels;
    public positions = Positions;
    public experience = Experience;
    public showPagination = false;
    dataSource: MatTableDataSource<any>;
    currentFilter;
    showFullInfo;
    displayedColumns: string[];
    isCollapsed = isMobile()
    isRecruiter = false

    private unsubscribeAll: Subject<any>;
    currentUser: CurrentUser;
    isAuthenticated;
    currentId;

    userId: string = "offline-demo";
    username: string;
    signalRAdapter: SignalRGroupAdapter;


    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    private filterValues = {
        position: '',
        experienceInYears: '',
        currentLocation: '',
        englishLevel: '',
        englishSpeaking: '',
        leadershipExperience: '',
        considerRelocation: false,
        id: '',
        allSelectedCompanies: '',
        country: '',
        city: '',
        education: false,
        courses: false
    };
    companyCurrentRecruiter;
    positionCurrentRecruiter;
    msg;

    allJuniors

    constructor(
        private route: ActivatedRoute,
        public matSnackBarService: MatSnackBarService,
        public hireService: HireServiceService,
        private localService: LocalService,
        private http: HttpClient,
        public authenticationService: AuthenticationService,
        public signalRService: SignalRService,
        private progressBarService: FuseProgressBarService,
        public translate: TranslateService,
        private cdr: ChangeDetectorRef
    ) {
            this.unsubscribeAll = new Subject();
            this.showFullInfo = route.snapshot.data.showFullInfo;
            this.hireService.currentFilter.subscribe(filter => {
                this.currentFilter = filter;
                this.assignFilterValues();
                this.initDataSource();
            });
            if(typeof JSON.parse(this.localService.getJsonValue('company'))?.secret !== "undefined"){
                this.isRecruiter = true
            } 
            else{
                this.isRecruiter = false
            }
            this.authenticationService.isAuthenticated.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
                this.isAuthenticated = val;
            });

            this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result : "";
            
            if(typeof JSON.parse(this.localService.getJsonValue('company'))?.secret !== "undefined"){
                this.companyCurrentRecruiter = JSON.parse(this.localService.getJsonValue('company')).secret
            } 
            else{
                this.companyCurrentRecruiter = ''
            }
    
            if(typeof JSON.parse(this.localService.getJsonValue('position'))?.secret !== "undefined"){
                this.positionCurrentRecruiter = JSON.parse(this.localService.getJsonValue('position')).secret
            } 
            else{
                this.positionCurrentRecruiter = ''
            }

            // this.translate.use('en')
            
    }

    ngOnInit() {     
        this.progressBarService.show();
        
        if (this.showFullInfo) {
            this.hireService.getCandidatesFullInfo().finally(() => {
                if(this.isRecruiter){
                    this.displayedColumns = [
                        'id',
                        // 'leadershipExperience',
                        'position',
                        'country',
                        'city',
                        'experienceInYears',
                        'englishLevel',
                        'education',
                        'courses',
                        // 'englishSpeaking',
                        // 'considerRelocation',
                        'isRemote',
                        'linkedinUrl',
                        'send'
                    ];
                }     
                else{
                    this.displayedColumns = [
                        'id',
                        // 'leadershipExperience',
                        'position',
                        'country',
                        'city',
                        'experienceInYears',
                        'englishLevel',
                        'education',
                        'courses',
                        // 'englishSpeaking',
                        // 'considerRelocation',
                        'isRemote',
                    ];
                }  
                this.allJuniors = this.hireService.allCandidates     
                this.initDataSource();
                this.progressBarService.hide();
                // this.paginator.pageSize = 25;
                // this.showPagination = true;
                // this.dataSource.paginator = this.paginator;
            });
        } else {
            this.hireService.getCandidates().finally(() => {
                if(this.isRecruiter && this.isAuthenticated){
                    this.displayedColumns = [
                        // 'leadershipExperience',
                        'position',
                        'country',
                        'city',
                        'experienceInYears',
                        'englishLevel',
                        'education',
                        'courses',
                        // 'englishSpeaking',
                        // 'considerRelocation',
                        'isRemote',
                        'linkedinUrl',
                        'send'
                    ];
                }     
                else{
                    this.displayedColumns = [
                        // 'leadershipExperience',
                        'position',
                        'country',
                        'city',
                        'experienceInYears',
                        'englishLevel',
                        'education',
                        'courses',
                        // 'englishSpeaking',
                        // 'considerRelocation',
                        'isRemote',
                        'send'
                    ];
                }
                this.allJuniors = this.hireService.allCandidates    
                this.initDataSource();
                this.progressBarService.hide();
                // this.showPagination = true;
                // this.dataSource.paginator = this.paginator;
                
            });

            
        }
        // *****************************************************
        let userName
        
        if(this.isRecruiter === true){
            userName = this.currentUser.FullName+" ("+this.positionCurrentRecruiter+" at "+this.companyCurrentRecruiter+")"
        }
        else{
            userName = JSON.parse(this.localService.getJsonValue('seekerForChat')).name
        }
        this.signalRAdapter = new SignalRGroupAdapter(userName, this.http, this.hireService, this.currentUser.Id.toString(), this.currentUser.Email, this.isRecruiter);

        this.translate.get('hireList.table.copy_done').subscribe((res: string) => {
            this.msg = res;
            
        })
        
    }

    initDataSource() {
        console.log(this.allJuniors);
        
        this.dataSource = new MatTableDataSource(this.allJuniors);  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.paginator.pageSize = 25;
        
        // if (this.dataSource.paginator) {
        //     this.dataSource.paginator.firstPage();
        //     this.dataSource.paginator.pageSize = 25
        // }

        this.filterValues.allSelectedCompanies = this.companyCurrentRecruiter
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.filter = JSON.stringify(this.filterValues);

        
    }

    createFilter(): (data: any, filter: string) => boolean {
        return (data, filter): boolean => {
            const searchTerms = JSON.parse(filter);
            // console.log(searchTerms);
            
            return (!searchTerms.currentLocation || searchTerms.currentLocation.indexOf(data.currentLocation) !== -1)

                // && (!searchTerms.country || searchTerms.country.indexOf(data.country) !== -1)
                && (!searchTerms.country || data.country.includes(searchTerms.country))
                // && (!searchTerms.city || searchTerms.city.indexOf(data.city) !== -1)
                && (!searchTerms.city || data.city.includes(searchTerms.city))

                && (!searchTerms.position || searchTerms.position.indexOf(data.position) !== -1)
                && (!searchTerms.englishLevel || searchTerms.englishLevel.indexOf(+data.englishLevel) !== -1)
                && (!searchTerms.englishSpeaking || searchTerms.englishSpeaking.indexOf(+data.englishSpeaking) !== -1)
                && (!searchTerms.id || searchTerms.id === data.id)
                && (!searchTerms.leadershipExperience || searchTerms.leadershipExperience === data.leadershipExperience)
                && (!searchTerms.considerRelocation || searchTerms.considerRelocation === data.considerRelocation)
                && (!searchTerms.experienceInYears || data.experienceInYears <= searchTerms.experienceInYears[1])
                && (!searchTerms.experienceInYears || data.experienceInYears >= searchTerms.experienceInYears[0])
                && (!searchTerms.allSelectedCompanies || data.allSelectedCompanies.indexOf(searchTerms.allSelectedCompanies) == -1)
                && (!searchTerms.courses || searchTerms.courses === data.courses)
                && (!searchTerms.education || searchTerms.education === data.education)
        };
    }

    assignFilterValues() {
        const v = this.filterValues;
        const c = this.currentFilter;
        v.currentLocation = (c.currentLocation && c.currentLocation.length) ? c.currentLocation : '';
        v.country = (c.country && c.country.length) ? c.country : '';
        v.city = (c.city && c.city.length) ? c.city : '';
        v.position = (c.position && c.position.length) ? c.position : '';
        v.englishLevel = (c.englishLevel && c.englishLevel.length) ? c.englishLevel : '';
        v.englishSpeaking = (c.englishSpeaking && c.englishSpeaking.length) ? c.englishSpeaking : '';
        v.leadershipExperience = (c.leadershipExperience) ? c.leadershipExperience : '';
        v.considerRelocation = (c.considerRelocation) ? c.considerRelocation : '';
        v.experienceInYears = (c.experienceInYears) ? c.experienceInYears : '';
        v.id = (c.id) ? c.id : ''; 
        v.education = (c.education) ? c.education : '';
        v.courses = (c.courses) ? c.courses : '';
    }

    addFriend(user: Person){   
        let info={
            id: user.userId,
            displayName: user.position+" ("+user.country+", "+user.city+")",
            totalUnreadMessages: 0,
            currentUserId: this.currentUser.Id,
            currentName: this.currentUser.FullName+" ("+this.positionCurrentRecruiter+" at "+this.companyCurrentRecruiter+")",
            currentUnread: 1, 
            currentEmail: this.currentUser.Email
        }
        // // console.log(info);
        
        this.hireService.getChats(info).subscribe(() => {
            this.signalRAdapter.getChatsFromDB()
            this.signalRAdapter.listFriends()
            this.signalRAdapter.openChat({ userId: user.userId,  id: user.userId })
            let _user = {
            participantType: ChatParticipantType.User,
            id: ""+user.userId+"",
            displayName: user.position+" ("+user.country+", "+user.city+")",
            avatar: "",
            status: ChatParticipantStatus.Offline,
            userId: ""+user.userId+""
            };
            this.isCollapsed = true
            this.ngChatParticipant['windows'] = []
            this.ngChatInstance.triggerOpenChatWindow(_user)
        },
        err => {
            this.matSnackBarService.showMessage(err);
        });

        
    }

    public showChat(participant: IChatParticipant): void
    {
        this.isCollapsed = true
        this.ngChatParticipant['windows'] = []    
        let user = {
            userId: participant.userId,
            id: participant.id
        }
        this.signalRAdapter.openChat(user)
    }

    chatClosed(event){
        this.isCollapsed = false     
    }
    
    public messageSeen(event: any)
    {  
        this.signalRAdapter.setMessagesRead()    
    }    

    getList(){
    }
    public InitializeSocketListerners(): void
    {
    }

    
}