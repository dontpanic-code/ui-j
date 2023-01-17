import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {EnglishLevels} from '@app/models/enum/englishLevels';
import {Positions} from '@app/models/enum/positions';
import {Locations} from '@app/models/enum/locations';
import {Experience} from '@app/models/enum/experience';
import {HireServiceService} from '@app/pages/hire-list/hire-service.service';
import {MatSnackBarService} from '@app/services';
import {AuthenticationService} from '@app/services/authentication.service';
import {MyAccountService} from '@app/pages/my-account/my-account.service';
import { Router } from '@angular/router';
import {Person} from '@app/models/person';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

// devorld comment (Position autocomplete)
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable, timer} from 'rxjs';
// end devorld comment (Position autocomplete)
// devorld comment (Country and City autocomplete)
// import CountriesCity from '../../../../app/models/json/countries_cities.json'
import { environment } from 'src/environments/environment.dev';
import { TranslateService } from '@ngx-translate/core';


export class User {
    constructor(public name: string, public selected?: boolean) {
      if (selected === undefined) selected = false;
    }
  }

export interface Countries {
    id: number;
    name: string;
    cities: object;
  }

  export interface Cities {
    id: number;
    name: string;
  }
// end devorld comment (Country and City autocomplete)
 
@Component({
    selector: 'app-my-account-form',
    templateUrl: './my-account-form.component.html',
    styleUrls: ['./my-account-form.component.scss']
})
export class MyAccountFormComponent implements OnInit {
    form: FormGroup;
    // devorld comment (Position autocomplete)
    myControl = new FormControl();
    options: string[] = Object.keys(Positions).map(key => Positions[key]).filter(x => !(parseInt(x) >= 0));
    filteredOptions: Observable<string[]>;
    // end devorld comment (Position autocomplete)

    // devorld comment (Country and City autocomplete)
    countryControl = new FormControl();
    countries: Countries[];
    selectCountry: object[];
    cities: Cities[];
    // cities: string[] = this.countries.some(e=>e.name ===  this.form.controls.countryForm.value());
    filteredCountries: Observable<Countries[]>;
    filteredCities: Observable<Cities[]>;
    // end devorld comment (Country and City autocomplete)
    // devorld comment List of companies
    userControl = new FormControl();
    users = [
        new User('EPAM'),
        new User('SoftServe'),
        new User('GlobalLogic'),
        new User('Luxoft'),
        new User('NIX'),
        new User('DataArt'),
        new User('EVOPLAY'),
        new User('Intellias'),
        new User('ZONE3000'),
        new User('Infopulse'),
        new User('Ajax Systems'),
        new User('ELEKS'),
        new User('Genesis'),
        new User('N-iX'),
        new User('Sigma Software'),
        new User('Playrix'),
        new User('SQUAD'),
        new User('Grid Dynamics Group'),
        new User('Netcracker'),
        new User('Ubisoft'),
        new User('AUTODOC'),
        new User('Parimatch Tech'),
        new User('WiX'),
        new User('Plarium'),
        new User('Innovecs'),
        new User('GeeksForLess Inc.'),
        new User('AMC Bridge'),
        new User('Gameloft'),
        new User('Playtech'),
        new User('Other')
      ];
    // toppingList: string[] = ['EPAM', 'SoftServe', 'GlobalLogic', 'Luxoft', 'Luxoft', 'NIX', 'DataArt', 'EVOPLAY', 'Intellias', 'ZONE3000', 'Infopulse', 'Ajax Systems', 'ELEKS', 'Genesis', 'N-iX', 'Sigma Software', 'Playrix', 'Capgemini Engineering Ukraine', 'EVO', 'SQUAD', 'Grid Dynamics Group', 'Netcracker', 'Ubisoft', 'AUTODOC', 'Parimatch Tech', 'WiX', 'Plarium', 'Innovecs', 'GeeksForLess Inc.', 'AMC Bridge', 'Gameloft', 'Playtech'];

    selectedUsers: User[] = new Array<User>();
    filteredUsers: Observable<User[]>;
    lastFilter: string = '';
    allSelectedCompanies: string = '';
    isShowSavedCopmanies;
    // end devorld comment List of companies

    public englishLevels = EnglishLevels;
    public positionsList = Positions;
    public locations = Locations;
    public experience = Experience;
    progress = false;
    formIsReady = false;
    enableFormFields = false;
    // isAnonymous = false;
    selectOtherComp = false;
    public person: Person;
    private unsubscribeAll: Subject<any>;
    

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

      // this.isAnonymous = false;

      const a = await this.hireService.getListCountries().finally(()=>{        
        this.countries =  this.hireService.allCountries
          this.countries = this.countries.filter(function(jsonObject) {
            return jsonObject.id != 182 && jsonObject.id != 21;
        });
      });


        this.progressBarService.show();
        // devorld need uncomment
        this.person = await this.myAccountService.getMyCv();
        // end devorld need uncomment        

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
        this.filteredOptions = this.form.controls.position.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
        // end devorld comment (Position autocomplete)

        // devorld comment (Country and City autocomplete)
        this.filteredCountries = this.form.controls.country.valueChanges.pipe(
            startWith(''),
            map(country => { 
                return country ? this._filteredCountries(country) : this.countries.slice() 
            }),            
        );
        // end devorld comment (Country and City autocomplete)

        // devorld comment Companies
        this.filteredUsers = this.userControl.valueChanges.pipe(
            startWith<string | User[]>(''),
            map(value => typeof value === 'string' ? value : this.lastFilter),
            map(filter => this.filter(filter))
          );
        // end devorld comment Companies

        this.myAccountService.resetForm.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
            this.form.reset();
            this.setFormDefaultValue();
            this.progress = false;
            this.form.patchValue({
                considerRelocation: false,
                isRemote: false,
                leadershipExperience: false,
                education: false,
                courses: false
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
        this.myAccountService.hideFieldState.pipe(takeUntil(this.unsubscribeAll)).subscribe(val => {
          this.isShowSavedCopmanies = val;
        });
    }

    // devorld comment (Position autocomplete)
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
    // end devorld comment (Position autocomplete)

    // devorld comment (Country and City autocomplete)
    private _filteredCountries(value: string): Countries[] {  
        // this.getCities()    
        const filterValue = value.toLowerCase();    
        return this.countries.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
    }
    private _filteredCities(value: string): Cities[] {        
        const filterValue = value.toLowerCase();
        return this.cities.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
    }
    // end devorld comment (Country and City autocomplete)

    // devorld comment Companies
    filter(filter: string): User[] {
        this.lastFilter = filter;
        if (filter) {
          return this.users.filter(option => {
            return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
          })
        } else {
          return this.users.slice();
        }
      }

      displayFn(value: User[] | string): string | undefined {
        let displayValue: string;
        if (Array.isArray(value)) {
          value.forEach((user, index) => {
            if (index === 0) {
              displayValue = user.name;
            } else {
              displayValue += ', ' + user.name;
            }
          });
        } else {
          displayValue = value;
        }
        return displayValue;
      }
      optionClicked(event: Event, user: User) {
        event.stopPropagation();
        this.toggleSelection(user);
      }

      toggleSelection(user: User) {
        user.selected = !user.selected;
        if (user.selected) {
          this.selectedUsers.push(user);
          this.allSelectedCompanies+=user.name+"|"
          if(user.name==='Other'){this.selectOtherComp = true}
        } else {
          const i = this.selectedUsers.findIndex(value => value.name === user.name);
          this.selectedUsers.splice(i, 1);
          if(user.name==='Other'){this.selectOtherComp = false}
        }
    
        this.userControl.setValue(this.selectedUsers);
      }
    // end devorld comment Companies


    buildForm() {
        this.form = this.formBuilder.group({
            position: [this.person.position, [Validators.required, this.requireMatchPosition.bind(this)]],
            country: [this.person.country, [Validators.required , this.requireMatchCountries.bind(this)]],
            city: [this.person.city, [Validators.required, this.requireMatchCities.bind(this)]],
            experienceInYears: [this.person.experienceInYears, [Validators.required]],
            currentLocation: [""],
            englishLevel: [this.person.englishLevel, [Validators.required]],
            englishSpeaking: [this.person.englishSpeaking, [Validators.required]],
            leadershipExperience: [this.person.leadershipExperience],
            considerRelocation: [this.person.considerRelocation],
            linkedinUrl: [this.person.linkedinUrl, [Validators.required]],
            cvUrl: [this.person.cvUrl],
            allSelectedCompanies: [this.person.allSelectedCompanies],
            ownNameCompany: [this.person.ownNameCompany],
            isRemote: [this.person.isRemote],
            isAnonymous: [this.person.isAnonymous],
            showPersonalInfo: [this.person.showPersonalInfo],
            education: [this.person.education],
            courses: [this.person.courses],
        });
        if (!this.enableFormFields) {
            this.form.disable();
            this.isShowSavedCopmanies = true;
        }
        this.onChanges();
    }

    private requireMatchCountries(control: FormControl): ValidationErrors | null {
      const selection: any = control.value;
      if (!this.countries.find(x => x.name == selection)) {
        return { requireMatch: true };
      }
      return null;
    } 

    private requireMatchCities(control: FormControl): ValidationErrors | null {
      if(this.cities){
        const selection: any = control.value;
        if (!this.cities.find(x => x.name == selection)) {
          return { requireMatch: true };
        }
        return null;
      }
    } 
    private requireMatchPosition(control: FormControl): ValidationErrors | null {
      const selection: any = control.value;
      console.log(this.options.indexOf(selection));
      
      if (this.options && this.options.indexOf(selection) < 0) {
        return { requireMatch: true };
      }
      return null;
    } 


    setFormDefaultValue() {
        this.person = new Person();
        this.person.showPersonalInfo = true;
        this.person.considerRelocation = this.person.isRemote = this.person.leadershipExperience = this.person.education = this.person.courses = this.isShowSavedCopmanies = this.person.isAnonymous =  false;
        this.person.showPersonalInfo = true;

        this.selectedUsers = new Array<User>();
        this.lastFilter = '';
        this.allSelectedCompanies = '';
        // this.form.controls['showPersonalInfo'].setValue(true);
    }


    onChanges() {
        this.form.get('linkedinUrl').valueChanges.pipe(
            debounceTime(600),
            distinctUntilChanged(),
        ).subscribe(val => {
            if (val && !val.startsWith('https://') && !this.form.controls['isAnonymous'].value) {
                this.form.controls.linkedinUrl.updateValueAndValidity();
                this.form.controls.linkedinUrl.setErrors({httpsMissing: true});
            }
        });
    }

    // this.form.controls['email'].updateValueAndValidity();
    // this.form.controls['email'].setErrors({taken: true});
    save() {
      console.log(this.form.errors, this.form.valid)
        console.log(this.form.value);
        this.allSelectedCompanies+=this.form.controls['ownNameCompany'].value;
        this.form.controls['allSelectedCompanies'].setValue(this.allSelectedCompanies)
         
        this.progressBarService.show();
        this.progress = true; 
        
        console.log(this.form.value);
        
        
        this.hireService.addCandidate(this.form.value).subscribe(() => {
                this.form.disable();
                // this.myAccountService.editFormState();
                this.isShowSavedCopmanies = true;
                this.myAccountService.toggleRemoveButton(true);
                this.matSnackBarService.showMessage(`Your record is on a way to Hire list!`);
                this.progressBarService.hide();

                // timer(700)
                //   .subscribe(i => {
                //     this._router.navigate(['/welcome']);
                //   })
            },
            err => {
                this.progress = false;
                this.matSnackBarService.showMessage(err);
                this.progressBarService.hide();

            });
    }
    // devorld comment (City autocomplete)
    getCities(countryName){
        var iso2 = "";
        this.countries.filter(value => {       
            if(value['name'] == countryName){ 
                iso2 = value['iso2']
            }                    
        })  

        var headers = new Headers();
        headers.append("X-CSCAPI-KEY", environment.countrystatecity);
        fetch("https://api.countrystatecity.in/v1/countries/"+iso2+"/cities", {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        })
        .then(response => response.text())
        .then(result => { 
            this.cities = JSON.parse(result);
            this.filteredCities = this.form.controls.city.valueChanges.pipe(
                startWith(''),
                map(city => {                              
                    return city ? this._filteredCities(city) : this.cities.slice()
                })
            );
        })
        // .catch(error => console.log('error', error));
    }    
    // end devorld comment (City autocomplete)

    // devorld comment 
    toggleIsAnonymous(event){
        if(event.checked){
            this.form.controls.linkedinUrl.setValidators(null);
            this.form.controls.linkedinUrl.updateValueAndValidity();
        }
    }
    // click(selected) {
    //     console.log(selected);
    //     this.selectedCompanies.push
    // }
    // end devorld comment
    
}
