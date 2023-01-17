import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector     : 'error-500',
    templateUrl  : './error-500.component.html',
    styleUrls    : ['./error-500.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error500Component implements OnInit
{
    private isSighUpSuccess = false;
    /**
     * Constructor
     */
    constructor(private route: ActivatedRoute, public router: Router)
    {
       this.isSighUpSuccess = this.route.snapshot.data.data as unknown as any;
       if(this.isSighUpSuccess) {
        this.router.navigate(['/']);
        } else {
            this.router.navigate(['/login']);
        }
    }

    ngOnInit() {
    }
}
