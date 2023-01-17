import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-container',
  templateUrl: './job-container.component.html',
  styleUrls: ['./job-container.component.scss']
})
export class JobContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.getElementsByTagName('body')[0].classList.add('showFilterIcon');      
  }

  ngOnDestroy(): void {
      document.getElementsByTagName('body')[0].classList.remove('showFilterIcon');
  }

}
