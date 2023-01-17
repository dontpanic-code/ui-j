import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';

import { navigation } from '@app/navigation/navigation';
import { environment } from '@environment';

import { Role } from './models';
import { User } from './models/family';
import { AuthenticationService } from '@app/services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
// import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { ModalComponent } from './pages/main-page/modal/modal.component';

// let count = 0; 

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Juniverse';
    currentUser: User;
    navigation: any;
    fuseConfig: any;

    // Private
    private unsubscribeAll: Subject<any>;

    constructor(
        @Inject(DOCUMENT) private document: any,
        public authenticationService: AuthenticationService,
        private fuseConfigService: FuseConfigService,
        private fuseNavigationService: FuseNavigationService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private platform: Platform,
        private translateService: TranslateService,
        // private dialog: MatDialog 
    ) {
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this.fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this.fuseNavigationService.setCurrentNavigation('main');

        if (this.platform.ANDROID || this.platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this.unsubscribeAll = new Subject();
        
        this.translateService.addLangs(environment.locales);
        this.translateService.setDefaultLang(environment.defaultLocale);
        this.translateService.use("ua");
    }

    get isAdmin() {
        return this.currentUser && this.currentUser.roles.includes(Role.Admin);
    }

    get isLoggedIn() {
        return this.currentUser;
    }

    logout() {
        this.authenticationService.logout();
    }

    ngOnInit(): void {
        // Subscribe to config changes
        this.fuseConfigService.config.pipe(takeUntil(this.unsubscribeAll)).subscribe(config => {
            this.fuseConfig = config;

            // Boxed
            if (this.fuseConfig.layout.width === 'boxed') {
                this.document.body.classList.add('boxed');
            } else {
                this.document.body.classList.remove('boxed');
            }

            // Color theme - Use normal for loop for IE11 compatibility
            for (const className of this.document.body.classList) {
                if (className.startsWith('theme-')) {
                    this.document.body.classList.remove(className);
                }
            }

            this.document.body.classList.add(this.fuseConfig.colorTheme);
        });

        this.authenticationService.checkAuth();
        // this.openDialog();  
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    // openDialog() {
    //     if(count == 0){
    //         const dialogConfig = new MatDialogConfig();
    //         dialogConfig.disableClose = false;
    //         dialogConfig.id = "modal-component";
    //         dialogConfig.width = "600px";            
    //         const modalDialog = this.dialog.open(ModalComponent, dialogConfig);
    //         count++; 
    //     }
    // }
}
