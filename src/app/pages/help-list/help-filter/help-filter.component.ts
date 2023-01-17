import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { States } from '@app/models/enum/states';
import { HelpTypes } from '@app/models/enum/helptypes';
import { HireServiceService } from '@app/pages/hire-list/hire-service.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-help-filter',
  templateUrl: './help-filter.component.html',
  styleUrls: ['./help-filter.component.scss']
})
export class HelpFilterComponent implements OnInit {

  form: FormGroup;
  public statesList = States;
  public typesList = HelpTypes;
  public disableReset = true;

  constructor(
    private route: ActivatedRoute,
    public hireService: HireServiceService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {        
    const control = this.hireService.enumKeys(this.statesList).map(() => new FormControl(false));
    const controlTypes = this.hireService.enumKeys(this.typesList).map(() => new FormControl(false));
    this.form = this.formBuilder.group({
        states: this.formBuilder.array(control),
        types: this.formBuilder.array(controlTypes),
    });
    this.onChanges();
  } 

  onChanges(): void {
    this.form.valueChanges.pipe(
        distinctUntilChanged()    
    ).subscribe(val => {
        // console.log("valvalval", val);
        const selectedStates = [];
        const selectedTypes = [];
        val.states.map((item, index) => {
            if (item === true) {
                selectedStates.push(this.statesList[index]);
            }
        });
        val.types.map((item, index) => {
          if (item === true) {
            selectedTypes.push(this.typesList[index]);
          }
        });
        this.hireService.updateHelpFilter({ ...val, state: selectedStates, type: selectedTypes });
        // this.hireService.updateHelpFilter({ ...val, type: selectedStates });
        this.disableReset = false;
    });
  }

  getStatesControls() {
    return (this.form.get('states') as FormArray).controls;
  }
  getTypesControls() {
    return (this.form.get('types') as FormArray).controls;
  }

  reset() {
    this.form.reset({ experienceInYears: null });
    this.disableReset = true;
    // document.getElementsByTagName('body')[0].classList.remove('filter-is-opened');
}

}
