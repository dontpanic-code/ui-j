import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-help-container',
  templateUrl: './help-container.component.html',
  styleUrls: ['./help-container.component.scss']
})
export class HelpContainerComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    // document.getElementsByTagName('body')[0].classList.add('showFilterIcon');      
  }

  ngOnDestroy(): void {
      // document.getElementsByTagName('body')[0].classList.remove('showFilterIcon');
  }

}
