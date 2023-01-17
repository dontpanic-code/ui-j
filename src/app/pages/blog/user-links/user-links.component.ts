import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.scss']
})
export class UserLinksComponent implements OnInit {

  userId
  isMy = false
  isBookmark = false

  private unsubscribeAll: Subject<any>;
isAuthenticated
currentUser
    // currentUser = {
    //     Id: 489,
    //     Email: 'mychannel.helloworld@gmail.com',
    //     FullName: 'IMAOTAG HUB',
    //     FirstName: 'IMAOTAG',
    //     LastName: 'IMAOTAG',
    //     TypeUser: 'recruiter',
    // };

  constructor(private _router: Router, private route: ActivatedRoute, public authenticationService: AuthenticationService,) { }

  ngOnInit(): void {
    // this.userId = 489
    this.unsubscribeAll = new Subject();
    this.authenticationService.isAuthenticated.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
      this.isAuthenticated = val;
     });
     this.currentUser = this.authenticationService.currentUserValue
     this.currentUser = this.currentUser.Result
     this.userId = this.currentUser.Id


    this.isMy = false
    this.isBookmark = false

    if(this.route.snapshot.routeConfig.path == 'my'){
      this.isMy = true        
    }
    if(this.route.snapshot.routeConfig.path == 'bookmarks'){
      this.isBookmark = true        
    }
  }

  openMy(link){
    if (this.isMy) {
      this._router.navigate(['/forum']);
    }
    else{
      this._router.navigate(['/forum/'+link]);
    }
  }

  open(link){

    if (this.isBookmark) {
      this._router.navigate(['/forum']);
    }
    else{
      this._router.navigate(['/forum/'+link]);
    }   

    // this._router.navigate(['/forum/'+link]);
  }

}
