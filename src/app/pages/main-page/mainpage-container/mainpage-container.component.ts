import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';
import { ModalComponent } from '../../main-page/modal/modal.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

let count = 0; 

@Component({
  selector: 'app-mainpage-container',
  templateUrl: './mainpage-container.component.html',
  styleUrls: ['./mainpage-container.component.scss']
})
export class MainpageContainerComponent implements OnInit {

  constructor(public autService: AuthenticationService, private _router: Router, private dialog: MatDialog, private translate: TranslateService) { }

  ngOnInit(): void {
    this.openDialog();  
  }

  goToLoIn(name: string) {
    console.log("true");
    this.autService.isMainTypeUserSubject.next(true)
    this.autService.updateNameTypeUserMain(name);
    this._router.navigate(['/my-account']);
  }

  openDialog() {
    if(count == 0){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.id = "modal-component";
        dialogConfig.width = "600px";            
        const modalDialog = this.dialog.open(ModalComponent, dialogConfig);
        count++; 
    }
  }

}
