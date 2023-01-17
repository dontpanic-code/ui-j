import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBarService } from '@app/services';
import { AuthenticationService } from '@app/services/authentication.service';
import { LocalService } from '@app/services/local.service';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import { timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BlogService } from '../blog.service';

@Component({
    selector: 'app-my-blog',
    templateUrl: './my-blog.component.html',
    styleUrls: ['./my-blog.component.scss'],
})
export class MyBlogComponent implements OnInit {
    form: FormGroup;
    dom;
    bookmark
    currentUser
    // currentUser = {
    //     Id: 489,
    //     Email: 'mychannel.helloworld@gmail.com',
    //     FullName: 'IMAOTAG HUB',
    //     FirstName: 'IMAOTAG',
    //     LastName: 'IMAOTAG',
    //     TypeUser: 'recruiter',
    // };
    isEmpty = true;
    userPicture;
    userId
    isAuthenticated

    isRecruiter;
    private unsubscribeAll: Subject<any>;

    toppingList = [];
    showPagination;
    dataSource;
    obs;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    public content: string;
    public mode: string = 'editor';

    constructor(
        private formBuilder: FormBuilder,
        public authenticationService: AuthenticationService,
        public blogService: BlogService,
        private matSnackBarService: MatSnackBarService,
        private _router: Router,
        public dialog: MatDialog,
        private localService: LocalService,
    ) {
        
    }

    ngOnInit(): void {


        this.unsubscribeAll = new Subject();
        this.authenticationService.isAuthenticated.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
            this.isAuthenticated = val;
           });
        this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result : {Id: 0};
        this.userId = this.currentUser.Id
        console.log("blog-my", this.isAuthenticated, this.currentUser);



        console.log(
            'this.authenticationService.currentUserValue',
            this.authenticationService.currentUserValue
        );
        console.log('this.currentUser', this.currentUser);

        this.unsubscribeAll = new Subject();
        this.authenticationService.isRecruiter
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((val) => {
                this.isRecruiter = val;
            });

        // if(!this.isRecruiter){
        //   this._router.navigate(['/my-account']);
        // }

        this.blogService.GetUserPosts(this.currentUser.Id).finally(() => {
            this.toppingList = this.blogService.getMyPosts;
            this.dataSource = new MatTableDataSource<any>(this.toppingList);
            this.obs = this.dataSource.connect();
            this.dataSource.paginator = this.paginator;
            if (this.toppingList.length > 0) {
                this.isEmpty = false;
            }
        });


        this.userPicture = 'assets/images/avatars/new-user-pic.svg';
        // this.buildForm();
        this.showPagination = true;
        // this.paginator.pageSize = 10;
        this.dataSource.paginator = this.paginator;

        // this.currentUser = this.authenticationService.currentUserValue
        // this.currentUser = this.currentUser.Result
        console.log(
            'this.authenticationService.currentUserValue',
            this.authenticationService.currentUserValue
        );
        console.log('this.currentUser', this.currentUser);
    }

    //   async buildForm() {
    //     this.form = this.formBuilder.group({
    //         title: [],
    //         tags: [],
    //         text: [],
    //         idUser: [],
    //         author: [],
    //     });

    //     // this.currentUser = this.authenticationService.currentUserValue
    //     // this.currentUser = this.currentUser.Result
    //     console.log("this.authenticationService.currentUserValue", this.authenticationService.currentUserValue );
    //     console.log("this.currentUser", this.currentUser );
    // }

    delete(id) {
        if (confirm('Are you sure to delete ')) {
            console.log('deleteJob', id);
            this.blogService.deletePost(id).finally(() => {
                this.blogService.GetUserPosts(this.currentUser.Id).finally(() => {
                    this.toppingList = this.blogService.getMyPosts;
                    this.dataSource = new MatTableDataSource<any>(this.toppingList);
                    this.obs = this.dataSource.connect();
                    this.dataSource.paginator = this.paginator;
                    if (this.toppingList.length > 0) {
                        this.isEmpty = false;
                    } else {
                        this.isEmpty = true;
                    }
                });
            });
        }
    }

    open(id) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });

        this._router.navigate(['forum/s/' + id]);
    }
    openDialog() {
        const dialogRef = this.dialog.open(DialogDataExampleDialog1, { panelClass: 'create-post' });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);

            this.blogService.getAllPosts().finally(() => {
                this.toppingList = this.blogService.allPosts;
                this.dataSource = new MatTableDataSource<any>(this.toppingList);
                this.obs = this.dataSource.connect();
                this.dataSource.paginator = this.paginator;

                if (this.toppingList.length > 0) {
                    this.isEmpty = false;
                } else {
                    this.isEmpty = true;
                }
            });
        });
    }

    changeLikes(idArticle) {
        this.currentUser.Id = 489
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

@Component({
    selector: 'dialog-data-example-dialog',
    templateUrl: '../blog-table/dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog1 {}
