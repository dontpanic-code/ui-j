import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EnglishLevels } from '@app/models/enum/englishLevels';
import { WorkplaceType } from '@app/models/enum/workplaceType';
import { EmploymentType } from '@app/models/enum/employmentType';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { MatSnackBarService } from '@app/services';
import { Job } from '@app/models/job';
import { MatRadioChange } from '@angular/material/radio';
import { Positions } from '@app/models/enum/positions';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AuthenticationService } from '@app/services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { ViewportScroller } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Experience } from '@app/models/enum/experience';
import { environment } from 'src/environments/environment.dev';

export interface Countries {
    id: number;
    name: string;
    cities: object;
}

export interface Cities {
    id: number;
    name: string;
}

@Component({
    selector: 'app-newjob-container',
    templateUrl: './newjob-container.component.html',
    styleUrls: ['./newjob-container.component.scss'],
})
export class NewjobContainerComponent implements OnInit {
    form: FormGroup;
    public englishLevels = EnglishLevels;
    public workplaceType = WorkplaceType;
    public employmentType = EmploymentType;
    public positions = Positions;
    public experience = Experience;

    countryControl = new FormControl();
    countries: Countries[];
    selectCountry: object[];
    cities: Cities[];
    filteredCountries: Observable<Countries[]>;
    filteredCities: Observable<Cities[]>;

    isAuthenticated;
    isRecruiter;
    formIsReady = false;
    private unsubscribeAll: Subject<any>;

    job: Job;
    visibleBtnJobList = false;
    isPreview = false;
    isRequired = true;
    contactType: string;
    contactLink: string;
    exampleLink: string;

    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: string[] = [];
    allFruits: string[] = [];

    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

    constructor(
        public hireService: HireServiceService,
        private formBuilder: FormBuilder,
        private matSnackBarService: MatSnackBarService,
        public authenticationService: AuthenticationService,
        private _router: Router,
        private progressBarService: FuseProgressBarService,
        private scroller: ViewportScroller,
        private router: Router,
        private translate: TranslateService
    ) {
        this.unsubscribeAll = new Subject();

        Object.values(Positions).filter((value) => {
            if (typeof value === 'string') {
                // console.log(value);
                this.allFruits.push(value.toString());
            }
        });

        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice()))
        );

        this.authenticationService.isAuthenticated
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((val) => {
                this.isAuthenticated = val;
            });
        this.authenticationService.isRecruiter
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((val) => {
                this.isRecruiter = val;
            });

        if(!this.isRecruiter){
          this._router.navigate(['/my-account']);
        }
    }

    async ngOnInit() {

      this.buildForm();

        const a = await this.hireService.getListCountries().finally(() => {
            this.countries = this.hireService.allCountries;
            this.countries = this.countries.filter(function (jsonObject) {
                return jsonObject.id != 182 && jsonObject.id != 21;
            });
        });

        this.progressBarService.show();
        this.formIsReady = true;
        
        this.progressBarService.hide();

        this.filteredCountries = this.form.controls.country.valueChanges.pipe(
            startWith(''),
            map((country) => {
                return country ? this._filteredCountries(country) : this.countries.slice();
            })
        );
    }

    private _filteredCountries(value: string): Countries[] {
        // this.getCities()
        const filterValue = value.toLowerCase();
        return this.countries.filter(
            (state) => state.name.toLowerCase().indexOf(filterValue) === 0
        );
    }
    private _filteredCities(value: string): Cities[] {
        const filterValue = value.toLowerCase();
        return this.cities.filter((state) => state.name.toLowerCase().indexOf(filterValue) === 0);
    }

    async buildForm() {
        this.contactType = 'Email';
        this.contactLink = 'mailto:';
        this.exampleLink = 'mailto:example@mail.com';

        this.form = this.formBuilder.group({
            jobTitle: [],
            companyName: [],
            aboutProject: [],
            jobRequirements: [],
            stack: [],
            stagesInterview: [],
            englishLevel: [],
            salaryRange: [],
            workplaceType: [],
            employmentType: [],
            benefits: [],
            contacts: [],
            tmpWT: [],
            tmpET: [],
            radioGroup: new FormControl('Email'),
            radioBtn: [],
            contactType: [],
            contactsLink: [],
            tmpTags: [],
            tags: [],
            experience: [],
            country: [],
            city: [],
        });
        this.onChanges();
    }
    save() {
        let tmp = this.form.controls['tmpWT'].value.join(', ');
        let tmpET = this.form.controls['tmpET'].value.join(', ');
        let tmpTags = this.fruits.join(', ');

        this.form.controls['workplaceType'].setValue(tmp);
        this.form.controls['employmentType'].setValue(tmpET);
        this.form.controls['tags'].setValue(tmpTags);

        this.form.controls['contactType'].setValue(this.contactType);
        this.form.controls['contactsLink'].setValue(this.contactLink);
        console.log('this.form.value', this.form.value);

        this.hireService.addJob(this.form.value).subscribe(
            () => {
                this.form.disable();
                this.visibleBtnJobList = true;
                this.matSnackBarService.showMessage(
                    `Your vacancy will appear in the Job List after moderation. In case of a problem, the moderators will contact you`
                );
                this._router.navigate(['/myjobs']);
            },
            (err) => {
                this.matSnackBarService.showMessage(err);
                this.visibleBtnJobList = false;
            }
        );
    }

    preview() {
        this.isPreview = !this.isPreview;
    }

    selectContactType(event: MatRadioChange) {
        console.log(event.value);
        switch (event.value) {
            case 'Email': {
                this.contactLink = 'mailto:';
                this.exampleLink = 'mailto:example@mail.com';
                break;
            }
            case 'Skype': {
                this.contactLink = 'skype:';
                this.exampleLink = 'skype:live:.cid.545y450yht45yht3?chat';
                break;
            }
            case 'Telegram': {
                this.contactLink = 'https://t.me/';
                this.exampleLink = 'https://t.me/example';
                break;
            }
            case 'WhatsApp': {
                this.contactLink = 'https://wa.me/';
                this.exampleLink = 'https://wa.me/380999999999';
                break;
            }
            case 'Signal': {
                this.contactLink = 'https://signal.me/#p/';
                this.exampleLink = 'https://signal.me/#p/+380999999999';
                break;
            }
        }
    }

    onChanges(): void {
        this.form.get('tmpWT').valueChanges.subscribe((val) => {
            console.log(val);
            let tmp = this.form.controls['tmpWT'].value.join(', ');
            this.form.controls['workplaceType'].setValue(tmp);
        });
        this.form.get('tmpET').valueChanges.subscribe((val) => {
            console.log(val);
            let tmp = this.form.controls['tmpET'].value.join(', ');
            this.form.controls['employmentType'].setValue(tmp);
        });

        // jobTitle: [],
        // companyName: [],
        // aboutProject: [],

        this.form.get('jobTitle').valueChanges.subscribe((val) => {
            console.log(val);
        });
        this.form.get('companyName').valueChanges.subscribe((val) => {
            console.log(val);
        });
        this.form.get('aboutProject').valueChanges.subscribe((val) => {
            console.log(val);
        });

        console.log('this.form.value', this.form.value);
        
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            if (this.fruits.indexOf(value) === -1) {
                this.fruits.push(value);
                this.isRequired = false;
            }
        }

        this.fruitCtrl.setValue(null);
    }

    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
            if (this.fruits.length == 0) {
                this.isRequired = true;
            }
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        if (this.fruits.indexOf(event.option.viewValue) === -1) {
            this.fruits.push(event.option.viewValue);
            this.isRequired = false;
        }
        // this.fruits.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allFruits.filter((fruit) => fruit.toLowerCase().includes(filterValue));
    }

    newVacation() {
        this.progressBarService.show();
        this.visibleBtnJobList = false;
        this.isPreview = false;
        this.isRequired = true;
        this.form.enable();
        this.fruits = [];
        this.buildForm();
        this.form.enable();
        this.progressBarService.hide();
    }

    getCities(countryName) {
        var iso2 = '';
        this.countries.filter((value) => {
            if (value['name'] == countryName) {
                iso2 = value['iso2'];
            }
        });
        var headers = new Headers();
        headers.append('X-CSCAPI-KEY', environment.countrystatecity);
        fetch('https://api.countrystatecity.in/v1/countries/' + iso2 + '/cities', {
            method: 'GET',
            headers: headers,
            redirect: 'follow',
        })
            .then((response) => response.text())
            .then((result) => {
                this.cities = JSON.parse(result);
                this.filteredCities = this.form.controls.city.valueChanges.pipe(
                    startWith(''),
                    map((city) => {
                        return city ? this._filteredCities(city) : this.cities.slice();
                    })
                );
            });
    }
}
