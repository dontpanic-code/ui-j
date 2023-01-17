import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { JobListService } from '@app/pages/job-list/job-list.service';
import { TranslateService } from '@ngx-translate/core';
import { BlogService } from '../blog.service';

import { MatDialog } from '@angular/material/dialog';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { Blog } from '@app/models/blog';
import { AuthenticationService } from '@app/services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocalService } from '@app/services/local.service';

@Component({
    selector: 'app-blog-table',
    templateUrl: './blog-table.component.html',
    styleUrls: ['./blog-table.component.scss'],
})
export class BlogTableComponent implements OnInit {
    toppings = new FormControl('');

    private filterValues = {
        postType: '',
        tag: '',
    };
    currentFilter;

    toppingList = [];
    showPagination;
    dataSource;
    obs;
    isEmpty = true;
    userPicture;
    sort;
    userId;
    bookmark;
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

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private translate: TranslateService,
        public jobService: JobListService,
        public router: Router,
        public blogService: BlogService,
        public hireService: HireServiceService,
        public dialog: MatDialog,
        private route: ActivatedRoute,
        public authenticationService: AuthenticationService,
        private localService: LocalService,
    ) {
        
    }

    ngOnInit(): void {

        // this.userId = 489;
        // this.isAuthenticated = false;
        this.unsubscribeAll = new Subject();
        this.authenticationService.isAuthenticated.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
            this.isAuthenticated = val;
            console.log("blog-table 1", this.isAuthenticated, this.currentUser);
        });
        // this.isAuthenticated = false;
       
        this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result : {Id: 0};
        this.userId = this.currentUser.Id
        console.log("blog-table 2", this.isAuthenticated, this.currentUser);
        
        //    this.currentUser = this.authenticationService.currentUserValue
        //    this.currentUser = this.currentUser.Result
        //    


        this.blogService.getAllPosts().finally(() => {
            if (this.route.snapshot.routeConfig.path == 'top') {
                this.toppingList = this.blogService.allPosts.sort((a, b) => b.likes - a.likes);
            } else if (this.route.snapshot.routeConfig.path == 'bookmarks') {
                this.toppingList = this.blogService.allPosts.filter((el: Blog) => {
                    return (
                        this.blogService.isBookmark(el.id, this.userId) && el.idUser != this.userId
                    );
                });
            } else {
                this.toppingList = this.blogService.allPosts;
            }
            this.dataSource = new MatTableDataSource(this.toppingList);
            this.dataSource.paginator = this.paginator;
            // this.dataSource = new MatTableDataSource<any>(this.toppingList);
            this.obs = this.dataSource.connect();
            if (this.toppingList.length > 0) {
                this.isEmpty = false;
            } else {
                this.isEmpty = true;
            }
        });

        this.blogService.getAllLists();

        //    this.blogService.changeBookmarks(13, 489);

        /* A callback function that is called after the function is finished. */
        // .finally(()=>{
        //     console.log(this.blogService.lists);

        // })

        // if (this.route.snapshot.routeConfig.path == 'top') {
        //     this.toppingList = this.toppingList.sort((a, b) => b.likes - a.likes);
        // }

        this.hireService.currentForumFilter.subscribe((filter) => {            
            this.currentFilter = filter;
            this.assignFilterValues();
            this.initDataSource();
        });




        this.userPicture = 'assets/images/avatars/new-user-pic.svg';

        this.showPagination = true;
        this.initDataSource();
        // this.paginator.length = 5;
        // this.paginator.pageSize = 10;
    }

    initDataSource() {
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.filter = JSON.stringify(this.filterValues);
    }

    openDialog() {
        const dialogRef = this.dialog.open(DialogDataExampleDialog, { panelClass: 'create-post' });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(`Dialog result: ${result}`);

            this.blogService.getAllPosts().finally(() => {
                this.toppingList = this.blogService.allPosts;
                this.dataSource = new MatTableDataSource<any>(this.toppingList);
                this.obs = this.dataSource.connect();
                this.dataSource.paginator = this.paginator;
                this.assignFilterValues();
                this.initDataSource();
                if (this.toppingList.length > 0) {
                    this.isEmpty = false;
                } else {
                    this.isEmpty = true;
                }
            });
        });
    }

    createFilter(): (data: any, filter: string) => boolean {
        return (data, filter): boolean => {
            
            const searchTerms = JSON.parse(filter);
            console.log('searchTerms', searchTerms);

            // map(data.category, (v)=>{return v.name}).join(', ');
            // debugger;
            // console.log(data);
            return (
                (!searchTerms.postType || data.type.includes(searchTerms.postType)) &&
                (!searchTerms.tag || data.tags.includes(searchTerms.tag))
            );
        };
    }

    assignFilterValues() {
        const v = this.filterValues;
        const c = this.currentFilter;
        v.postType = c.postType && c.postType.length ? c.postType : '';
        v.tag = c.tag && c.tag.length ? c.tag : '';
    }
    open(id) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });

        this.router.navigate(['/forum/s/' + id]);
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

@Component({
    selector: 'dialog-data-example-dialog',
    templateUrl: 'dialog-data-example-dialog.html',
})
export class DialogDataExampleDialog {}
