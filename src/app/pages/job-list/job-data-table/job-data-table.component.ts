import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCard } from '@angular/material/card';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { Observable, Subject } from 'rxjs';
import { Job } from '@app/models/job';
import {JobListService} from '@app/pages/job-list/job-list.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';  
import { LocalService } from '@app/services/local.service';
import { SignalRGroupAdapter } from '@app/pages/hire-list/hire-list-data-table/signalr-group-adapter';
import { AuthenticationService } from '@app/services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { ChatParticipantStatus, ChatParticipantType, IChatController, IChatParticipant } from 'ng-chat';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarService } from '@app/services';
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

@Component({
  selector: 'app-job-data-table',
  templateUrl: './job-data-table.component.html',
  styleUrls: ['./job-data-table.component.scss']
})
export class JobDataTableComponent implements OnInit {

  @ViewChild('ngChatInstance')
  protected ngChatInstance: IChatController;
  @ViewChild('ngChatInstance')
    protected ngChatParticipant: IChatParticipant[];
  @ViewChild('ngChatInstance')
    protected windows: Window[];
  @ViewChild('ngChatInstance')
    protected window: Window;

  public showPagination = false;
  obs: Observable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  // public jobsList = [];
  public jobsArray = [];

  signalRAdapter: SignalRGroupAdapter;

  dataSource: MatTableDataSource<MatCard> = new MatTableDataSource<MatCard>(this.jobsArray);

  private filterValues = {
    position: '',
    englishLevel: '',
    workplaceType: '',
    employmentType: '',
    globalSearch: '',
    country: '',
    city: '',
    experience: ''
  };
  currentFilter;
  currentUser;
  isAuthenticated;
  isRecruiter;
  private _unsubscribeAll: Subject<any>;
  isCollapsed = isMobile()

  

  constructor(
    public hireService: HireServiceService, 
    public jobService: JobListService, 
    public router: Router,  
    private localService: LocalService,
    public _authenticationService: AuthenticationService,
    private http: HttpClient,
    public matSnackBarService: MatSnackBarService,
    private translate: TranslateService
    ) {     
    this.hireService.currentJobFilter.subscribe(filter => {
      this.currentFilter = filter;
      this.assignFilterValues();
      this.initDataSource();
    });

    this.jobService.getCandidates()
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {

    this._authenticationService.isAuthenticated.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
      this.isAuthenticated = val;

      this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result : "";
      console.log("currentUser", this.currentUser);
      console.log("isAuthenticated", this.isAuthenticated);
  });

    this._authenticationService.isRecruiter.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
      this.isRecruiter = val;
      console.log("this.isRecruiter", this.isRecruiter);            
    });

    this.jobService.getCandidates().finally(() => {

      this.jobsArray = this.jobService.allJobs
      console.log("!!!", this.jobsArray);

      this.dataSource = new MatTableDataSource<MatCard>(this.jobsArray);
      this.obs = this.dataSource.connect();
      this.showPagination = true;
      // this.paginator.length = 5;
      this.paginator.pageSize = 25;
      this.dataSource.paginator = this.paginator;
    })

    


    this.initDataSource();   
    console.log('seekerForChat1111', JSON.parse(this.localService.getJsonValue('seekerForChat')).name);
    
    this.signalRAdapter = new SignalRGroupAdapter(JSON.parse(this.localService.getJsonValue('seekerForChat')).name, this.http, this.hireService, this.currentUser.Id.toString(), this.currentUser.Email, this.isRecruiter);
  }

  initDataSource() {
    this.dataSource.filterPredicate = this.createFilter();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  search(searchTerms, data): boolean {

    let isHaveValue = false
      if(searchTerms){
        searchTerms.forEach(element => {
          if(data.includes(element)){            
            isHaveValue = true
          }
        });
      }
      else{
        return !searchTerms
      }
      return isHaveValue
  }

  createFilter(): (data: any, filter: string) => boolean {    
    return (data, filter): boolean => {
      console.log(data);
        const searchTerms = JSON.parse(filter);      
        // map(data.category, (v)=>{return v.name}).join(', ');   
        // debugger;
        console.log(data);
        return (!searchTerms.position || this.search(searchTerms.position, data.tags))
        && (!searchTerms.englishLevel || this.search(searchTerms.englishLevel, data.englishLevel))
        && (!searchTerms.workplaceType || this.search(searchTerms.workplaceType, data.workplaceType))
        && (!searchTerms.employmentType || this.search(searchTerms.employmentType, data.employmentType))

        && (!searchTerms.country || data.country.includes(searchTerms.country))
        && (!searchTerms.city || data.city.includes(searchTerms.city))
        && (!searchTerms.experience || data.experience <= searchTerms.experience[1])
        && (!searchTerms.experience || data.experience >= searchTerms.experience[0])

        && (!searchTerms.globalSearch 
          || data.aboutProject.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          || data.benefits.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          || data.companyName.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          || data.jobRequirements.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          || data.jobTitle.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          || data.salaryRange.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          || data.stack.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          || data.stagesInterview.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          || data.tags.toLowerCase().indexOf(searchTerms.globalSearch.toLowerCase()) !== -1
          
          
        )        
    };
  }

  assignFilterValues() {
      const v = this.filterValues;
      const c = this.currentFilter;
      v.position = (c.position && c.position.length) ? c.position : '';
      v.englishLevel = (c.englishLevel && c.englishLevel.length) ? c.englishLevel : '';
      v.workplaceType = (c.workplaceType && c.workplaceType.length) ? c.workplaceType : '';
      v.employmentType = (c.employmentType && c.employmentType.length) ? c.employmentType : '';
      v.globalSearch = (c.globalSearch && c.globalSearch.length) ? c.globalSearch : '';
      v.country = (c.country && c.country.length) ? c.country : '';
      v.city = (c.city && c.city.length) ? c.city : '';
      v.experience = (c.experience) ? c.experience : '';
      
  }
  openJobCard(id: any) {
    console.log(id);   
    this.jobService.toggleIdJob(id); 
    let hash = this.jobService.enc(id.toString());
    
    // this.router.navigate(['/jobs/g/' + hash]);
    this.router.navigate(['/jobs/g', hash]);

    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/jobs/g/', hash])
    // );
    // window.open(url, '_blank');
  }

  addFriend(job: Job){   
    let pos, com, full
    if(job.position=="Other"){
      pos = job.positionOther
    }
    if(job.position!=null && job.position!="Other"){
      pos = job.position
    }
    if(job.company=="Other"){
      com = job.companyOther
    }
    if(job.company!=null && job.company!="Other"){
      com = job.company
    }


    full = job.fullName+" ("+pos+" at "+com+")"

    console.log(full);
      
    // let currentUser = this.localService.getJsonValue('currentUser').Result;
    let info={
      id: this.currentUser.Id,
      displayName: JSON.parse(this.localService.getJsonValue('seekerForChat')).name,
      totalUnreadMessages: 0,
      currentUserId: job.idR,
      currentName: full,
      currentUnread: 1, 
      currentEmail: job.email
    }
    console.log("info", info);
    
  // // // console.log(info);
  
    this.hireService.getChats(info).subscribe(() => {
      this.signalRAdapter.getChatsFromDB()
      this.signalRAdapter.listFriends()
      this.signalRAdapter.openChat({ userId: job.idR,  id: job.idR })
      let _user = {
      participantType: ChatParticipantType.User,
      id: ""+job.idR+"",
      displayName: full,
      avatar: "",
      status: ChatParticipantStatus.Offline,
      userId: ""+job.idR+""
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
