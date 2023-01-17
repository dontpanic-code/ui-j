import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from '@app/models/job';
import { JobListService } from '@app/pages/job-list/job-list.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModeratorService } from '../moderator.service';

@Component({
  selector: 'app-approval-job',
  templateUrl: './approval-job.component.html',
  styleUrls: ['./approval-job.component.scss']
})
export class ApprovalJobComponent implements OnInit {

  jobsArray = []
  isRecruiter
  currentJob: Job
  private unsubscribeAll: Subject<any>;

  constructor(public moderatorService: ModeratorService, public authenticationService: AuthenticationService, private _router: Router, public jobService: JobListService, private translate: TranslateService) { 
    this.unsubscribeAll = new Subject();
    this.authenticationService.isRecruiter.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
      this.isRecruiter = val;
    }); 

    if(!this.isRecruiter){
      this._router.navigate(['/my-account']);
    } 
    
  }

  ngOnInit(): void {
    this.moderatorService.getAllJobs().finally(() => {
      this.jobsArray = this.moderatorService.allJobs
    })
  }

  deleteJob(id) {
    console.log("deleteJob", id);    
    this.moderatorService.deleteJob(id).finally(() => {
      this.ngOnInit();
    })
  }
  editJob(id) {
    console.log("editJob", id);    
    this.jobService.toggleIdJob(id); 
    this._router.navigate(['/job/edit']);
  }

  changeApproved(id) {
    console.log("changeApproved", id);  
    this.currentJob = this.jobsArray.find(job => job.id === id); 
    console.log("1", this.currentJob);
    this.currentJob.isApproved = !this.currentJob.isApproved
    console.log("2", this.currentJob);

    this.moderatorService.changeApproved(this.currentJob).finally(() => {
      this.ngOnInit();
      if(this.currentJob.isApproved){
        this.moderatorService.sendToTelegramBot(this.currentJob).finally(() => {
          console.log("sendToTelegramBot");
        })
      }
    })
  }

}
