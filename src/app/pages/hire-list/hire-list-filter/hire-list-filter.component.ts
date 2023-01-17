import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EnglishLevels } from '@app/models/enum/englishLevels';
import { Positions } from '@app/models/enum/positions';
import { Locations } from '@app/models/enum/locations';
import { Experience } from '@app/models/enum/experience';
import { distinctUntilChanged } from 'rxjs/operators';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import {map, startWith} from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { SearchComponent } from '@app/pages/search/search.component';
import { TranslateService } from '@ngx-translate/core';
import { Options } from '@angular-slider/ngx-slider';

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
    selector: 'app-hire-list-filter',
    templateUrl: './hire-list-filter.component.html',
    styleUrls: ['./hire-list-filter.component.scss']
})
export class HireListFilterComponent implements OnInit {
    @ViewChild('searchText') searchText : SearchComponent;
    form: FormGroup;
    public englishLevels = EnglishLevels;
    public positionsList = Positions;
    public locations = Locations;
    public experience = Experience;
    public disableReset = true;
    public showFullInfo;

    public positionsNames = [];

    // devorld comment (Country and City autocomplete)
    countryControl = new FormControl();
    countries: Countries[] ;
    selectCountry: object[] ;
    cities: Cities[];
    // cities: string[] = this.countries.some(e=>e.name ===  this.form.controls.countryForm.value());
    filteredCountries: Observable<Countries[]>;
    filteredCities: Observable<Cities[]>;
    // end devorld comment (Country and City autocomplete)

    value: number = 0;
    highValue: number = 18;
    options: Options = {
      floor: 0,
      ceil: 18,
    //   step: 1,
    //   showTicks: true
    };
    msg1 = ""
    msg2 = ""
    config={
        value: false,
        name: '',
        width: 100,
        fontSize: 14,
        color:{
            unchecked: '#FFC56F',
            checked: '#56BFD9'
        },
        labels: {
            unchecked: this.msg1,
            checked: this.msg2
        },
        fontColor: {
            checked: '#000',
            unchecked: '#000'
        },
        values:{
            unchecked: false,
            checked: true,
        }
    }

    constructor(
        private route: ActivatedRoute,
        public hireService: HireServiceService,
        private formBuilder: FormBuilder,
        private translate: TranslateService
    ) {
        
    }

    async ngOnInit() {       

        this.translate.get('nonTechEdu').subscribe((res: string) => {
            
            this.msg1 = res;   
            this.config.labels={
                checked: this.msg2,
                unchecked: this.msg1
            }         
        })
        this.translate.get('education_tech').subscribe((res: string) => {
            this.msg2 = res;

            this.config.labels={
                checked: this.msg2,
                unchecked: this.msg1
            }
        })

        Object.values(Positions).filter(value => {
            if(typeof value === 'string'){
              this.positionsNames.push(value.toString())
            }        
          })

        const a = await this.hireService.getListCountries().finally(()=>{
            this.countries =  this.hireService.allCountries
            // this.countries = this.countries.slice(182)
            // this.countries = this.countries.slice(21)
            this.countries = this.countries.filter(function(jsonObject) {
                return jsonObject.id != 182 && jsonObject.id != 21;
            });
        });

        this.buildForm();
        this.filteredCountries = this.form.controls.country.valueChanges.pipe(
            startWith(''),
            map(country => { 
                return country ? this._filteredCountries(country) : this.countries.slice() 
            }),            
        );

        console.log("education", this.form.controls['education'].value);
    }

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
            // console.log(this.cities);
            
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

    buildForm() {        
        // this.countries =  this.hireService.allCountries
        const control = this.hireService.enumKeys(this.positionsNames).map(() => new FormControl(false));
        this.form = this.formBuilder.group({
            positions: this.formBuilder.array(control),
            country: [''],
            city: [''],
            experienceInYears: new FormControl([0, 18]),
            currentLocation: [null],
            englishLevel: [null],
            englishSpeaking: [null],
            leadershipExperience: [false],
            considerRelocation: [false],
            id: [null],
            education:this.config.value,
            courses: false,
        });
        this.onChanges();  
    }

    buildFormUpdate() {        
        let tmpForm = this.form; 

        const control = this.hireService.enumKeys(this.positionsNames).map(() => new FormControl(false));
        this.form = this.formBuilder.group({
            positions: this.formBuilder.array(control),
            country: [tmpForm.controls['country'].value],
            city: [tmpForm.controls['city'].value],
            experienceInYears: [tmpForm.controls['experienceInYears'].value],
            currentLocation: [tmpForm.controls['currentLocation'].value],
            englishLevel: [tmpForm.controls['englishLevel'].value],
            englishSpeaking: [tmpForm.controls['englishSpeaking'].value],
            leadershipExperience: [tmpForm.controls['leadershipExperience'].value],
            considerRelocation: [tmpForm.controls['considerRelocation'].value],
            id: [tmpForm.controls['id'].value],
            education: this.config.value,
            courses: [tmpForm.controls['courses'].value]
        });
        this.onChanges();  
    }

    onChanges(): void {    
        this.form.valueChanges.pipe(
            distinctUntilChanged()    
        ).subscribe(val => {
            const selectedPositions = [];
            val.positions.map((item, index) => {
                if (item === true) {
                    selectedPositions.push(this.positionsNames[index]);
                    console.log("selectedPositions", selectedPositions);
                    
                }
            });
            this.hireService.updateFilter({ ...val, position: selectedPositions });
            this.disableReset = false;
            console.log("education", this.form.controls['education'].value);
        });
    }

    getPositionsControls() {        
        return (this.form.get('positions') as FormArray).controls;
    }

    reset() {
        this.onSearch('')
        this.config.value = false
        this.form.reset({ experienceInYears: [0, 18], education: this.config.value, courses: false});
        this.disableReset = true;
        this.searchText.value = '';
        this.config.value = false
    }

    onSearch(searchTerm: string) {

        const posClear = <FormArray>this.form.controls['positions'];
        for(let i = posClear.length-1; i >= 0; i--) {
            posClear.removeAt(i)
        }

        let allPos = []

        this.positionsNames = []
        Object.values(Positions).filter((value, index) => {
            if(typeof value === 'string'){
                if(value.toString().toLowerCase().includes(searchTerm.toLowerCase())){
                    allPos.push(index.toString())
                    this.positionsNames.push(value.toString())
                }   
            }   
          })

        const control = allPos.map(() => new FormControl(false));    

        this.form.controls['positions'] = (this.formBuilder.array(control)) 
        this.getPositionsControls()
        this.buildFormUpdate();
        
    }
    // update(value, highValue): void {
    //     console.log(value, highValue);
    //   }

    //   changeEvent() {
    //     // this.config.value = !this.config.value
    //     console.log(this.config.value);
    //   }
}
