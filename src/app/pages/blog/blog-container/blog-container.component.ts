import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-container',
  templateUrl: './blog-container.component.html',
  styleUrls: ['./blog-container.component.scss']
})
export class BlogContainerComponent implements OnInit {

  isAuthenticated
  private unsubscribeAll: Subject<any>;
  idPost
  singlePost
  isMy = false
  

  constructor(public authenticationService: AuthenticationService, private _router: Router, private translate: TranslateService, private route: ActivatedRoute, private blogService: BlogService) {
    
    
   }

   async ngOnInit() {


    this.idPost = 0
    this.unsubscribeAll = new Subject();
    // this.isAuthenticated = true;
    this.authenticationService.isAuthenticated.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
      this.isAuthenticated = val;
    }); 
    console.log("blog-container", this.isAuthenticated); 
        
    // if(!this.isAuthenticated){
    //   this._router.navigate(['/my-account']);
    // } 
    this.idPost = this.route.snapshot.paramMap.get('id')
    // this.idPost = 25
    if(this.route.snapshot.routeConfig.path == 'my'){
      this.isMy = true
    }
    else{
      this.isMy = false
    }



    let rez = await this.blogService.openPost(this.idPost).finally(() => {
      this.singlePost = this.blogService.getOpenPost;
    });
  }

}
