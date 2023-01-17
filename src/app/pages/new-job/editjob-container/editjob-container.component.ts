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
import { JobListService } from '@app/pages/job-list/job-list.service';
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
    selector: 'app-editjob-container',
    templateUrl: './editjob-container.component.html',
    styleUrls: ['./editjob-container.component.scss'],
})
export class EditjobContainerComponent implements OnInit {
    countryControl = new FormControl();
    countries: Countries[];
    selectCountry: object[];
    cities: Cities[];
    filteredCountries: Observable<Countries[]>;
    filteredCities: Observable<Cities[]>;

    form: FormGroup = new FormGroup({
        jobTitle: new FormControl('', [Validators.required]),
        companyName: new FormControl('', [Validators.required]),
        aboutProject: new FormControl('', [Validators.required]),
        jobRequirements: new FormControl('', [Validators.required]),
        stack: new FormControl('', [Validators.required]),
        stagesInterview: new FormControl('', [Validators.required]),
        englishLevel: new FormControl('', [Validators.required]),
        salaryRange: new FormControl('', [Validators.required]),
        workplaceType: new FormControl('', [Validators.required]),
        employmentType: new FormControl('', [Validators.required]),
        benefits: new FormControl('', [Validators.required]),
        contacts: new FormControl('', [Validators.required]),
        tmpWT: new FormControl('', [Validators.required]),
        tmpET: new FormControl('', [Validators.required]),
        radioGroup: new FormControl('', [Validators.required]),
        radioBtn: new FormControl('', [Validators.required]),
        contactType: new FormControl('', [Validators.required]),
        contactsLink: new FormControl('', [Validators.required]),
        tmpTags: new FormControl('', [Validators.required]),
        tags: new FormControl('', [Validators.required]),
        id: new FormControl('', [Validators.required]),
        dateCreated: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
        experience: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
    });
    public englishLevels = EnglishLevels;
    public workplaceType = WorkplaceType;
    public employmentType = EmploymentType;
    public positions = Positions;
    public experiences = Experience;

    isAuthenticated;
    isRecruiter;
    formIsReady = false;
    idJob;
    jobsArray;
    isEdit = false;
    private unsubscribeAll: Subject<any>;

    job: Job;
    visibleBtnJobList = false;
    isPreview = false;
    isRequired = true;
    contactType = 'Email';
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
        public jobService: JobListService,
        private translate: TranslateService
    ) {
        this.unsubscribeAll = new Subject();

        Object.values(Positions).filter((value) => {
            if (typeof value === 'string') {
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
        this.jobService.idJob.pipe(takeUntil(this.unsubscribeAll)).subscribe((val) => {
            this.idJob = val;
            console.log(this.idJob);
        });

        if (!this.isRecruiter) {
            this._router.navigate(['/my-account']);
        }
    }

    async ngOnInit() {

      const a = await  this.hireService.getListCountries().finally(() => {
          this.countries = this.hireService.allCountries;
          this.countries = this.countries.filter(function (jsonObject) {
              return jsonObject.id != 182 && jsonObject.id != 21;
          });
      });
      
      this.jobService.idJob.pipe(takeUntil(this.unsubscribeAll)).subscribe((val) => {
            this.idJob = val;
            console.log(this.idJob);
        });

        const r = await this.hireService.getListMyJobs()
        this.jobsArray = await this.hireService.getAllJobs(this.idJob);
        // this.jobsArray = await this.hireService.allMyJobs.filter((item) => item.id == this.idJob);

        console.log('jobsArray 2222222222222222222222222222222222', this.jobsArray);
          if (this.idJob > 0) {
              this.isEdit = true;
              console.log(this.isEdit);
          }
          this.progressBarService.show();
          this.formIsReady = true;
         this.buildForm();

          this.progressBarService.hide();
          

      //   this.hireService.getListMyJobs().finally(() => {
      //     this.jobsArray = this.hireService.allMyJobs;
      //     this.jobsArray = this.hireService.allMyJobs.filter((item) => item.id == this.idJob);
      //     console.log('jobsArray 2222222222222222222222222222222222', this.jobsArray);
      //     if (this.idJob > 0) {
      //         this.isEdit = true;
      //         console.log(this.isEdit);
      //     }
      //     this.progressBarService.show();
      //     this.formIsReady = true;
      //     this.buildForm();
      //     this.progressBarService.hide();
      //     this.onChanges();
      // });

        

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

    buildForm() {
        this.contactType = 'Email';
        this.contactLink = 'mailto:';
        this.exampleLink = 'mailto:example@mail.com';

        if (this.isEdit) {
            this.contactType = this.jobsArray[0].contactType;
            this.contactLink = this.jobsArray[0].contactLink;
            this.exampleLink = this.jobsArray[0].contactLink + this.jobsArray[0].contacts;

            this.fruits = this.jobsArray[0].tags.split(',');

            this.form = this.formBuilder.group({
                jobTitle: [this.jobsArray[0].jobTitle, Validators.required],
                companyName: [this.jobsArray[0].companyName, Validators.required],
                aboutProject: [this.jobsArray[0].aboutProject, Validators.required],
                jobRequirements: [this.jobsArray[0].jobRequirements, Validators.required],
                stack: [this.jobsArray[0].stack, Validators.required],
                stagesInterview: [this.jobsArray[0].stagesInterview, Validators.required],
                englishLevel: [this.jobsArray[0].englishLevel, Validators.required],
                salaryRange: [this.jobsArray[0].salaryRange, Validators.required],
                workplaceType: [this.jobsArray[0].workplaceType, Validators.required],
                employmentType: [this.jobsArray[0].employmentType, Validators.required],
                benefits: [this.jobsArray[0].benefits, Validators.required],
                contacts: [this.jobsArray[0].contacts, Validators.required],
                tmpWT: [this.jobsArray[0].workplaceType.split(', '), Validators.required],
                tmpET: [this.jobsArray[0].employmentType.split(', '), Validators.required],
                radioGroup: [this.jobsArray[0].contactType, Validators.required],
                radioBtn: [this.jobsArray[0].contactType, Validators.required],
                contactType: [this.jobsArray[0].contactType, Validators.required],
                contactsLink: [this.jobsArray[0].contactsLink, Validators.required],
                tmpTags: [this.jobsArray[0].tags, Validators.required],
                tags: [this.jobsArray[0].tags.split(', '), Validators.required],
                id: [this.jobsArray[0].id],
                dateCreated: [this.jobsArray[0].dateCreated],
                email: [this.jobsArray[0].email],
                experience:[this.jobsArray[0].experience],
                country:[this.jobsArray[0].country],
                city:[this.jobsArray[0].city],
            });
        } else {
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
                id: [-2],
                dateCreated: ['dateCreated'],
                email: ['email'],
                experience: [],
                country: [],
                city: [],
            });
        }

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
        console.log('this.form.value 111111111', this.form.value);

        this.hireService.updateJob(this.form.value).subscribe(
            () => {
                this.form.disable();
                this.visibleBtnJobList = true;
                this.matSnackBarService.showMessage(
                    `Your vacancy will appear in the Job List after moderation. In case of a problem, the moderators will contact you`
                );
            },
            (err) => {
                this.matSnackBarService.showMessage(err);
                this.visibleBtnJobList = false;
            }
        );

        // this.visibleBtnJobList = true
        // this.form.disable();
        // this.jobService.toggleIdJob(0)
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
        this._router.navigate(['/job/edit']);
        // // this.ngOnInit()
        // this.isEdit = false
        // this.progressBarService.show();
        // this.visibleBtnJobList = false
        // this.isPreview = false
        // this.isRequired = true
        // this.fruits = []
        // this.buildForm()
        // this.progressBarService.hide();
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
