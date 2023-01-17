import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { FuseConfigService } from '@fuse/services/config.service';


@Component({
    selector: 'app-hire-list-container',
    templateUrl: './hire-list-container.component.html',
    styleUrls: ['./hire-list-container.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class HireListContainerComponent implements OnInit, OnDestroy {

    constructor(private fuseConfigService: FuseConfigService,) { 
        // this.fuseConfigService.config = {
        //     layout: {
        //         navbar   : {
        //             hidden: false
        //         },
        //         toolbar  : {
        //             hidden: false
        //         },
        //         footer   : {
        //             hidden: false
        //         },
        //         sidepanel: {
        //             hidden: false
        //         }
        //     }
        // };
    }

    ngOnInit() {
        document.getElementsByTagName('body')[0].classList.add('showFilterIcon'); 
    }

    ngOnDestroy(): void {
        document.getElementsByTagName('body')[0].classList.remove('showFilterIcon');
    }

}
