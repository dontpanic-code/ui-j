import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { JobListService } from '@app/pages/job-list/job-list.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-myjobs-component',
  templateUrl: './myjobs-component.component.html',
  styleUrls: ['./myjobs-component.component.scss']
})


export class MyjobsComponentComponent implements OnInit {

  jobsArray = []
  isRecruiter
  private unsubscribeAll: Subject<any>;
  isEmpty = true

  constructor(public hireService: HireServiceService, public authenticationService: AuthenticationService, private _router: Router, public jobService: JobListService, private translate: TranslateService) {
    this.unsubscribeAll = new Subject();
    this.authenticationService.isRecruiter.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
      this.isRecruiter = val;
    });  
    if(!this.isRecruiter){
      this._router.navigate(['/my-account']);
    } 
   }

  ngOnInit(): void {
    this.hireService.getListMyJobs().finally(() => {
      this.jobsArray = this.hireService.allMyJobs
      if(this.jobsArray.length > 0){
        this.isEmpty = false
      }
    })
  }
  deleteJob(id) {
    console.log("deleteJob", id);    
    this.hireService.deleteJob(id).finally(() => {
      this.ngOnInit();
    })
  }
  editJob(id) {
    console.log("editJob", id);    
    this.jobService.toggleIdJob(id); 
    this._router.navigate(['/job/edit']);
  }
}
