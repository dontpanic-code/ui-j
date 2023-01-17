import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  isAuthenticated;
  isRecruiter;
  private _unsubscribeAll: Subject<any>;

  constructor(public authenticationService: AuthenticationService, private _router: Router, private translate: TranslateService) { 
    this._unsubscribeAll = new Subject();

    this.authenticationService.isAuthenticated.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
      this.isAuthenticated = val;
    }); 
    
    if(!this.isAuthenticated){
      this._router.navigate(['/my-account']);
    } 
  }

  ngOnInit(): void {

    this.authenticationService.isRecruiter.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
      this.isRecruiter = val;
      console.log("this.isRecruiter", this.isRecruiter);
      
    });

  }

}
