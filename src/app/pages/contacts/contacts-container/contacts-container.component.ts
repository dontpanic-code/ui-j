import {Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-contacts-container',
    templateUrl: './contacts-container.component.html',
    styleUrls: ['./contacts-container.component.scss']
})
export class ContactsContainerComponent implements OnInit {
    contactPersons = [
        {
            name: 'Roman Kushnaryov',
            link: 'https://www.linkedin.com/in/romankushnaryov/',
            img: 'assets/images/avatars/RomanKushnaryov.jpg'
        },
        {
            name: 'Eugene Haiduchenko',
            link: 'https://www.linkedin.com/in/eugene-haiduchenko-34356711b/',
            img: 'assets/images/avatars/EugeneHaiduchenko.jpg'
        },
    ];

    constructor(private translate: TranslateService) {
    }

    ngOnInit(): void {
    }

}
