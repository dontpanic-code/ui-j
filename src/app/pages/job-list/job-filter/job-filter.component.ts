import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Positions } from '@app/models/enum/positions';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { AuthenticationService } from '@app/services/authentication.service';
import { Subject } from 'rxjs';
import { SearchComponent } from '@app/pages/search/search.component';
import { EnglishLevels } from '@app/models/enum/englishLevels';
import { EmploymentType } from '@app/models/enum/employmentType';
import { WorkplaceType } from '@app/models/enum/workplaceType';
import { TranslateService } from '@ngx-translate/core';
import { Options } from '@angular-slider/ngx-slider';
import { Experience } from '@app/models/enum/experience';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import {map, startWith} from 'rxjs/operators';


export interface Countries {
  id: number;
  name: string;
  iso2: string;
}

export interface Cities {
  id: number;
  name: string;
}

@Component({
    selector: 'app-job-filter',
    templateUrl: './job-filter.component.html',
    styleUrls: ['./job-filter.component.scss'],
})
export class JobFilterComponent implements OnInit {
    @ViewChild('searchText') searchText: SearchComponent;

    form: FormGroup;
    public positionsList = Positions;
    public disableReset = true;
    isRecruiter;
    private unsubscribeAll: Subject<any>;

    public positionsNames = [];
    public englishLevels = EnglishLevels;
    public workplaceType = WorkplaceType;
    public employmentType = EmploymentType;
    public experience = Experience;

    countryControl = new FormControl();
    countries: Countries[];
    selectCountry: object[];
    cities: Cities[];
    filteredCountries: Observable<Countries[]>;
    filteredCities: Observable<Cities[]>;

    value: number = 0;
    highValue: number = 18;
    options: Options = {
      floor: 0,
      ceil: 18,
    };

    constructor(
        private route: ActivatedRoute,
        public hireService: HireServiceService,
        private formBuilder: FormBuilder,
        public authenticationService: AuthenticationService,
        private translate: TranslateService
    ) {
        this.unsubscribeAll = new Subject();
        this.authenticationService.isRecruiter
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((val) => {
                this.isRecruiter = val;
            });
    }

    async ngOnInit() {
        Object.values(Positions).filter((value) => {
            if (typeof value === 'string') {
                this.positionsNames.push(value.toString());
            }
        });

        const a = await this.hireService.getListCountries().finally(() => {
            this.countries = this.hireService.allCountries;
            this.countries = this.countries.filter(function (jsonObject) {
                return jsonObject.id != 182 && jsonObject.id != 21;
            });
        });

        this.buildForm();
        this.filteredCountries = this.form.controls.country.valueChanges.pipe(
            startWith(''),
            map((country) => {
                return country ? this._filteredCountries(country) : this.countries.slice();
            })
        );
    }

    // devorld comment (Country and City autocomplete)
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
    // end devorld comment (Country and City autocomplete)
    // devorld comment (City autocomplete)
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
                // console.log(this.cities);

                this.filteredCities = this.form.controls.city.valueChanges.pipe(
                    startWith(''),
                    map((city) => {
                        return city ? this._filteredCities(city) : this.cities.slice();
                    })
                );
            });
        // .catch(error => console.log('error', error));
    }
    // end devorld comment (City autocomplete)

    buildForm() {
        const control = this.hireService
            .enumKeys(this.positionsNames)
            .map(() => new FormControl(false));
        this.form = this.formBuilder.group({
            positions: this.formBuilder.array(control),
            englishLevel: [null],
            workplaceType: [null],
            employmentType: [null],
            globalSearch: [null],
            country: [''],
            city: [''],
            experience: new FormControl([0, 18]),
        });
        this.onChanges();
    }

    buildFormUpdate() {
        let tmpForm = this.form;

        const control = this.hireService
            .enumKeys(this.positionsNames)
            .map(() => new FormControl(false));
        this.form = this.formBuilder.group({
            positions: this.formBuilder.array(control),
            englishLevel: [null],
            workplaceType: [null],
            employmentType: [null],
            globalSearch: [null],
            country: [tmpForm.controls['country'].value],
            city: [tmpForm.controls['city'].value],
            experience: new FormControl([0, 18]),
        });
        this.onChanges();
    }

    onChanges(): void {
        this.form.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
            // console.log("valvalval", val);
            const selectedPositions = [];
            val.positions.map((item, index) => {
                if (item === true) {
                    selectedPositions.push(this.positionsNames[index]);
                }
            });
            this.hireService.updateJobFilter({ ...val, position: selectedPositions });
            this.disableReset = false;
        });
    }

    onSearch(searchTerm: string) {
        const posClear = <FormArray>this.form.controls['positions'];
        for (let i = posClear.length - 1; i >= 0; i--) {
            posClear.removeAt(i);
        }
        console.log("this.form.controls['positions']", this.form.controls['positions']);

        let allPos = [];

        this.positionsNames = [];
        Object.values(Positions).filter((value, index) => {
            if (typeof value === 'string') {
                if (value.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                    allPos.push(index.toString());
                    this.positionsNames.push(value.toString());
                }
            }
        });
        console.log('allPos', allPos);

        const control = allPos.map(() => new FormControl(false));

        this.form.controls['positions'] = this.formBuilder.array(control);
        console.log("this.form.controls['positions']", this.form.controls['positions']);

        console.log(this.form.controls['positions']);
        this.getPositionsControls();
        this.buildFormUpdate();
    }

    getPositionsControls() {
        return (this.form.get('positions') as FormArray).controls;
    }

    reset() {
        this.onSearch('');
        this.form.reset({});
        this.disableReset = true;
        this.searchText.value = '';
        // document.getElementsByTagName('body')[0].classList.remove('filter-is-opened');
    }
}
