import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { JobListService } from '@app/pages/job-list/job-list.service';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import { BlogService } from '../blog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { AuthenticationService } from '@app/services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { LocalService } from '@app/services/local.service';

@Component({
    selector: 'app-blog-single',
    templateUrl: './blog-single.component.html',
    styleUrls: ['./blog-single.component.scss'],
})
export class BlogSingleComponent implements OnInit {
    idPost;
    toppingList;
    singlePost;
    dom;
    userPicture;
    bookmark
    userId
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


    public content: string;
    public mode: string = 'editor';

    @Input()
    _idPost: string;

    constructor(
        public jobService: JobListService,
        private route: ActivatedRoute,
        public blogService: BlogService,
        public sanitized: DomSanitizer,
        public authenticationService: AuthenticationService,
        private localService: LocalService,
    ) {    }

    ngOnInit() {

        // this.userId = 489
        this.unsubscribeAll = new Subject();
        this.authenticationService.isAuthenticated.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
            this.isAuthenticated = val;
           });
           this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result : {Id: 0};
            this.userId = this.currentUser.Id
            console.log("blog", this.isAuthenticated, this.currentUser);

        this.userPicture = 'assets/images/avatars/new-user-pic.svg';

        this.route.paramMap.subscribe((params : ParamMap)=> {  
          console.log(params.get('id'));

          this.idPost = params.get('id');  

          this.blogService.openPost(this.idPost).finally(() => {
            this.singlePost = this.blogService.getOpenPost;
          });
          
             
        }); 

        // this.idPost = this.route.snapshot.paramMap.get('id');
        if (!this.idPost) {
            this.idPost = this._idPost;
        }
        console.log("this.route.snapshot.paramMap.get('id')", this.idPost);

        this.blogService.openPost(this.idPost).finally(() => {
            this.singlePost = this.blogService.getOpenPost;
        });

        // this.singlePost = this.toppingList.filter(item => item.id == this.idPost)
        console.log('this.singlePost', this.singlePost);
    }

    changeBookmarks(idArticle) {
        this.bookmark = this.blogService.changeBookmarks(idArticle, this.userId);
        var element = document.getElementById('b' + idArticle);
        if (this.bookmark) {
            element.classList.add('highlight');
        } else {
            element.classList.remove('highlight');
        }
    }
    changeLikes(idArticle) {
        this.bookmark = this.blogService.changeLikes(idArticle, this.userId);
        var element = document.getElementById('l' + idArticle);
        var count = document.getElementById('cl' + idArticle);
        console.log(this.blogService.countLikes(idArticle).toString());
        
        count.innerHTML = this.blogService.countLikes(idArticle).toString()
        if (this.bookmark) {
            element.classList.add('highlight-like');
            count.innerHTML = (this.blogService.countLikes(idArticle)+1).toString()
            
        } else {
            element.classList.remove('highlight-like');
            count.innerHTML = (this.blogService.countLikes(idArticle)-1).toString()
        }
    }
}
