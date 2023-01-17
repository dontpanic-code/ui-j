import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EnglishLevels} from '@app/models/enum/englishLevels';
import {Positions} from '@app/models/enum/positions';
import {Locations} from '@app/models/enum/locations';
import {Experience} from '@app/models/enum/experience';
import {HireServiceService} from '@app/pages/hire-list/hire-service.service';
import {MatSnackBarService} from '@app/services';
import {AuthenticationService} from '@app/services/authentication.service';
import {MyAccountService} from '@app/pages/my-account/my-account.service';
// import {RecruiterAccountFormComponent} from '@app/pages/my-account/recruiter/recruiter-account-form.component';
import {Recruiter} from '@app/models/recruiter';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {Subject, timer} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

// devorld comment (Position autocomplete)
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
// end devorld comment (Position autocomplete)
// devorld comment (Country and City autocomplete)
import { environment } from 'src/environments/environment.dev';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


// export class User {
//     constructor(public name: string, public selected?: boolean) {
//       if (selected === undefined) selected = false;
//     }
//   }

// export interface Countries {
//     id: number;
//     name: string;
//     cities: object;
//   }

//   export interface Cities {
//     id: number;
//     name: string;
//   }
// end devorld comment (Country and City autocomplete)
 
@Component({
    selector: 'app-recruiter-account-form',
    templateUrl: './recruiter-account-form.component.html',
    styleUrls: ['./recruiter-account-form.component.scss']
})
export class RecruiterAccountFormComponent implements OnInit {
    form: FormGroup;
    myControl = new FormControl();
    companies: string[] = ['EPAM', 'SoftServe', 'GlobalLogic', 'Luxoft', 'NIX', 'DataArt', 'EVOPLAY', 'Intellias', 'ZONE3000', 'Infopulse', 'Ajax Systems', 'ELEKS', 'Genesis', 'N-iX', 'Sigma Software', 'Playrix', 'Capgemini Engineering Ukraine', 'EVO', 'SQUAD', 'Grid Dynamics Group', 'Netcracker', 'Ubisoft', 'AUTODOC', 'Parimatch Tech', 'WiX', 'Plarium', 'Innovecs', 'GeeksForLess Inc.', 'AMC Bridge', 'Gameloft', 'Playtech', 'Other'];
    positions: string[] = ['Recruiter', 'HR', 'HRD', 'Other']; 

    optionsPositions: string[] = Object.keys(this.positions).map(key => this.positions[key]).filter(x => !(parseInt(x) >= 0));
    filteredOptionsPositions: Observable<string[]>;

    optionsCompanies: string[] = Object.keys(this.companies).map(key => this.companies[key]).filter(x => !(parseInt(x) >= 0));
    filteredOptionsCompanies: Observable<string[]>;

    progress = false;
    formIsReady = false;
    enableFormFields = false;
    selectOtherComp = false;
    public person: Recruiter;
    private unsubscribeAll: Subject<any>;
    
    isAnonymous = false

    constructor(
        public hireService: HireServiceService,
        private matSnackBarService: MatSnackBarService,
        private formBuilder: FormBuilder,
        private autService: AuthenticationService,
        private progressBarService: FuseProgressBarService,
        public myAccountService: MyAccountService,
        private _router: Router,
        private translate: TranslateService
    ) {
        this.unsubscribeAll = new Subject();

    }

    async ngOnInit() {
        this.progressBarService.show();

        this.person = await this.myAccountService.getRecruiterCv();
                

        if (this.person == null && !this.person) {
            this.enableFormFields = true;
            this.setFormDefaultValue();
        } else {
            this.myAccountService.toggleRemoveButton(true);
        }


        this.formIsReady = true;
        this.buildForm();
        this.progressBarService.hide();

        // devorld comment (Position autocomplete)
        this.filteredOptionsPositions = this.form.controls.position.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
        this.filteredOptionsCompanies = this.form.controls.company.valueChanges.pipe(
            startWith(''),
            map(value => this._filterCompanies(value))
        );

        this.myAccountService.resetForm.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
            this.form.reset();
            this.setFormDefaultValue();
            this.progress = false;
            this.form.patchValue({
                considerRelocation: false,
                isRemote: false,
                leadershipExperience: false
            });
            setTimeout(() => {
                Object.keys(this.form.controls).forEach(key => {
                    this.form.get(key).setErrors(null);
                });
            }, 0);
            this.form.enable();
        });

        this.myAccountService.editForm.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
            this.form.enable();
        });
    }

    // devorld comment (Position autocomplete)
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.optionsPositions.filter(option => option.toLowerCase().includes(filterValue));
    }
    private _filterCompanies(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.optionsCompanies.filter(option => option.toLowerCase().includes(filterValue));
    }


    buildForm() {
        this.form = this.formBuilder.group({
            position: [this.person.position, [Validators.required]],
            positionOther: [this.person.positionOther],
            company: [this.person.company, [Validators.required]],
            companyOther: [this.person.companyOther],
            isAnonymous: [this.person.isAnonymous],
        });
        if (!this.enableFormFields) {
            this.form.disable();
        }
    }


    setFormDefaultValue() {
        this.person = new Recruiter();
        this.person.isAnonymous = true;
    }
    save() { 
        this.progressBarService.show();
        this.progress = true;        
        this.hireService.addRecruiter(this.form.value).subscribe(() => {
                this.form.disable();
                // this.myAccountService.editFormState();
                this.myAccountService.toggleRemoveButton(true);
                this.matSnackBarService.showMessage(`Your record has been saved!`);
                this.progressBarService.hide();

                timer(700)
                  .subscribe(i => {
                    this._router.navigate(['/welcome']);
                  })
            },
            err => {
                this.progress = false;
                this.matSnackBarService.showMessage(err);
                this.progressBarService.hide();

            });
    }    
}
