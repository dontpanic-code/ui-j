import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from '@app/services/authentication.service';
import { MyAccountService } from '@app/pages/my-account/my-account.service';
import { MatSnackBarService } from '@app/services';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { takeUntil } from 'rxjs/operators';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { LocalService } from '@app/services/local.service';
import { TranslateService } from '@ngx-translate/core';

export interface User {
    FullName: string;
    Email: string;
    TypeUser: string;
  }

@Component({
    selector: 'app-my-account-container',
    templateUrl: './my-account-container.component.html',
    styleUrls: ['./my-account-container.component.scss']
})

export class MyAccountContainerComponent implements OnInit, OnDestroy {
    // currentUser: adal.User;
    currentUser: User;
    private unsubscribeAll: Subject<any>;
    public userPicture;
    showRemoveButton;
    isAuthenticated;
    isSetType;
    // devorld comment 
    
    userType;
    tmpUser: User;
    isUserType;
    isDisabled = true;
    change: EventEmitter<MatRadioChange>
    isModerator
    // end devorld comment
    

    constructor(
        private matSnackBarService: MatSnackBarService,
        public myAccountService: MyAccountService,
        private progressBarService: FuseProgressBarService,
        public authenticationService: AuthenticationService,
        private localService: LocalService,
        private translate: TranslateService
    ) {
        this.unsubscribeAll = new Subject();

        this.authenticationService.isAuthenticated.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
            this.isAuthenticated = val;
        });
        // this.isAuthenticated = false;

        this.authenticationService.nameTypeUserMain.subscribe(val => {

            this.userType = val
            console.log("isUserType", this.userType);
          
            this.tmpUser = { TypeUser: val.toString(), FullName: '', Email: ''}    
            console.log("isUserType", this.tmpUser);  

            console.log("isUserType", this.tmpUser);  
            this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result :  this.tmpUser;
            this.isUserType = this.currentUser.TypeUser;
            console.log("isUserType", this.isUserType);
    
    });
        
        
        
    }

    ngOnInit(): void {

        if (this.userPicture) {
        } else {
            // this.userPicture = 'assets/images/avatars/default-user-pic.svg';
            this.userPicture = 'assets/images/avatars/new-user-pic.svg';
        }

        
        this.myAccountService.removeButtonState.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
            this.showRemoveButton = val;
        });
        
        this.authenticationService.isModerator.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
            this.isModerator = val;
        });
        this.authenticationService.isMainTypeUser.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
            this.isSetType = val;
            this.isDisabled = !val;
        });
        

        // comment 
        // this.isUserType = this.localService.getJsonValue('userType').secret;
        // this.currentUser = this.isAuthenticated ? JSON.parse(localStorage.getItem('currentUser')).Result :  this.tmpUser;
        // this.currentUser = this.isAuthenticated ? this.localService.getJsonValue('currentUser').Result :  this.tmpUser;
                
        
    }
    onChange(userTypeCheck: MatRadioChange) {
        this.isDisabled = false;        
    }
    
    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    singIn(provider: string, userType: string) {
        console.log(userType);
        
        var data = { secret: userType };      
        this.localService.setJsonValue('userType', data);  
        this.authenticationService.login(provider, userType);
    }

    deleteAccount() {
        this.progressBarService.show();
        this.myAccountService.deleteCv().then(() => {
            this.matSnackBarService.showMessage(`Your record has deleted from Hire List!`);
            this.myAccountService.resetFormState();
            this.myAccountService.toggleRemoveButton(false);
            this.myAccountService.toggleHideField(false);

            this.progressBarService.hide();
        }).catch(err => {
            this.matSnackBarService.showMessage(err);
            this.progressBarService.hide();

        });
    }

    deleteAccountRecruiter(){
        this.progressBarService.show();
        this.myAccountService.deleteRecruiter().then(() => {
            this.matSnackBarService.showMessage(`Your record has deleted`);
            this.myAccountService.resetFormState();
            this.myAccountService.toggleRemoveButton(false);
            this.myAccountService.toggleHideField(false);

            this.progressBarService.hide();
        }).catch(err => {
            this.matSnackBarService.showMessage(err);
            this.progressBarService.hide();

        });
    }

    editAccount() {
        this.myAccountService.editFormState();
        this.myAccountService.toggleRemoveButton(false);
        this.myAccountService.toggleHideField(false);
    }
    editAccountRecruiter() {
        this.myAccountService.editFormState();
        this.myAccountService.toggleRemoveButton(false);
        this.myAccountService.toggleHideField(false);
    }
    deleteAccountUser(){
        this.progressBarService.show();
        this.myAccountService.deleteUser().then(() => {
            this.matSnackBarService.showMessage(`Your record has deleted!`);
            this.myAccountService.resetFormState();
            this.myAccountService.toggleRemoveButton(false);
            this.myAccountService.toggleHideField(false);
            this.progressBarService.hide();
            if(this.isUserType == 'seeker'){
                this.myAccountService.deleteCv().then(() => {
                    this.authenticationService.logout()
                })
            }
            if(this.isUserType == 'recruiter'){
                this.myAccountService.deleteRecruiter().then(() => {
                    this.authenticationService.logout()
                })
            }
            
        }).catch(err => {
            this.matSnackBarService.showMessage(err);
            this.progressBarService.hide();
        });
    }
}
