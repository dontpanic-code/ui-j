/* tslint:disable variable-name */
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from '@app/navigation/navigation';
import { AuthenticationService } from '@app/services/authentication.service';
import { MyAccountService } from '@app/pages/my-account/my-account.service';
import { LocalService } from '@app/services/local.service';

export interface User {
    FullName: string;
    Email: string;
    TypeUser: string;
    FirstName: string;
  }


@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    isAuthenticated;
    isAuthor;
    isRecruiter;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    currentUser: User;
    public showFilterSidebar = false;
    private _unsubscribeAll: Subject<any>;
    userPicture: string;
    lang;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        public _authenticationService: AuthenticationService,
        public myAccountService: MyAccountService,
        private _router: Router,
        private localService: LocalService,
        private translate: TranslateService
    ) {
        this.navigation = navigation;
        

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this.userPicture = 'assets/images/avatars/user.svg';

        // if (this._authenticationService.isAuthenticated) {
        //     this.currentUser = this._authenticationService.currentUserValue;
        // }

        // Subscribe to the config changes
        this._fuseConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(settings => {
            this.horizontalNavbar = settings.layout.navbar.position === 'top';
            this.rightNavbar = settings.layout.navbar.position === 'right';
            this.hiddenNavbar = settings.layout.navbar.hidden === true;
        });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });
        this._authenticationService.isAuthenticated.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
            this.isAuthenticated = val;

            this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result : "";
            console.log("currentUser", this.currentUser);
            console.log("isAuthenticated", this.isAuthenticated);
        });

        this._authenticationService.isAuthor.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
            this.isAuthor = val;
            console.log("isAuthor", this.isAuthor);
            
        })
        
        this._authenticationService.isRecruiter.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
            this.isRecruiter = val;
            console.log("this.isRecruiter", this.isRecruiter);            
        });
        // this._authenticationService.currentUser.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
        //     this.currentUser = val;
        //     console.log("this.isRecruiter", this.currentUser);            
        // });


       
        // this.isAuthor = true
        // this.isAuthenticated = true;
        // this.isRecruiter = true

        this.lang = this.translate.defaultLang === 'ua' ? 'eng' : 'ua';
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    logout() {
        this._authenticationService.logout();
        this._router.navigate(['/login']);
    }

    openFilter() {
        if (!this.showFilterSidebar) {
            this.showFilterSidebar = !this.showFilterSidebar;
            document.getElementsByTagName('body')[0].classList.add('filter-is-opened');
        } else {
            this.showFilterSidebar = !this.showFilterSidebar;
            document.getElementsByTagName('body')[0].classList.remove('filter-is-opened');
        }
    }

    login() {
        this._authenticationService.isMainTypeUserSubject.next(false)
        this._authenticationService.updateNameTypeUserMain('');
        this._router.navigate(['/my-account']);
    }

    switchLang(){
        this.translate.use(this.lang);
        if(this.lang === 'eng'){
            this.lang = 'ua';
        }
        else{
            this.lang = 'eng';
        }
    }
}
