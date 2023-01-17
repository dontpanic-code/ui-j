import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-info-container',
    templateUrl: './info-container.component.html',
    styleUrls: ['./info-container.component.scss']
})
export class InfoContainerComponent implements OnInit {
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

    constructor() {
    }

    ngOnInit(): void {
    }

}
