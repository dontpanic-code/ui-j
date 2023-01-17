import { Component, OnInit, ViewChild } from '@angular/core';
import { Job } from '@app/models/job';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobListService } from '../job-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { TranslateService } from '@ngx-translate/core';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { SignalRGroupAdapter } from '@app/pages/hire-list/hire-list-data-table/signalr-group-adapter';
import { LocalService } from '@app/services/local.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@app/services/authentication.service';
import { ChatParticipantStatus, ChatParticipantType, IChatController, IChatParticipant } from 'ng-chat';
import { MatSnackBarService } from '@app/services';

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
  selector: 'app-open-job',
  templateUrl: './open-job.component.html',
  styleUrls: ['./open-job.component.scss']
})
export class OpenJobComponent implements OnInit {

  @ViewChild('ngChatInstance')
  protected ngChatInstance: IChatController;
  @ViewChild('ngChatInstance')
    protected ngChatParticipant: IChatParticipant[];
  @ViewChild('ngChatInstance')
    protected windows: Window[];
  @ViewChild('ngChatInstance')
    protected window: Window;

  public jobsArray = [];
  public idJob
  private unsubscribeAll: Subject<any>;
  signalRAdapter: SignalRGroupAdapter;
  currentUser;
  isAuthenticated;
  private _unsubscribeAll: Subject<any>;
  isRecruiter;
  isCollapsed = isMobile();

  constructor(
    public jobService: JobListService, 
    public router: Router, 
    private route: ActivatedRoute, 
    private titleService: Title,  
    private metaTagService: Meta, 
    private translate: TranslateService,
    public hireService: HireServiceService, 
    private localService: LocalService,
    private http: HttpClient,
    public _authenticationService: AuthenticationService,
    public matSnackBarService: MatSnackBarService,
    ) {
      this._unsubscribeAll = new Subject();
     }

  ngOnInit(): void {
    this._authenticationService.isAuthenticated.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
      this.isAuthenticated = val;
      this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result : "";
    });

    this._authenticationService.isRecruiter.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
      this.isRecruiter = val;         
      console.log("isRecruiter", this.isRecruiter);
      
    });

    this.unsubscribeAll = new Subject();
    this.jobService.idJob.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
      this.idJob = val;
    });

    this.idJob = this.jobService.dec(this.route.snapshot.paramMap.get('id'))
    console.log("this.route.snapshot.paramMap.get('id')", this.idJob);
    

    // this.router..subscribe(params => {
    //   this.name = params['name'];
    // });
    this.jobService.getCandidates().finally(() => {
      this.jobsArray = this.jobService.allJobs
      console.log("!!!", this.jobsArray);

      console.log("this.jobService.allJobs", this.jobService.allJobs)
      this.jobsArray = this.jobService.allJobs.filter(item => item.id == this.idJob)
      console.log("this.jobsArray", this.jobsArray);  


      this.titleService.setTitle(this.jobsArray[0].jobTitle +"| Juniverse");  
    
      this.metaTagService.addTags([  
        { property: 'og:description', content:  this.jobsArray[0].aboutProject},
        { name: 'description', content:  this.jobsArray[0].aboutProject},
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },  
        { property: 'og:title', content: this.jobsArray[0].jobTitle +"| Juniverse"},        
        { property: 'og:image', content: "https://juniverse.com.ua/assets/images/og_image_logo.png" },
        { name: 'writer', content: 'Juniverse' },  
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://juniverse.com.ua' },
        { property: 'og:site_name', content: 'Juniverse' },
        { property: 'article:modified_time', content: this.jobsArray[0].dateCreate },
        { property: 'og:image:width', content: '2560' },
        { property: 'og:image:height', content: '1707' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { property: 'msapplication-TileImage', content: "https://juniverse.com.ua/assets/images/og_image_logo.png" },
        { name: 'og:locale', content: 'uk_UA' },
        { charset: 'UTF-8' } 
      ]);  
    
    })

    this.signalRAdapter = new SignalRGroupAdapter(JSON.parse(this.localService.getJsonValue('seekerForChat')).name, this.http, this.hireService, this.currentUser.Id.toString(), this.currentUser.Email, this.isRecruiter);

    
      
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
