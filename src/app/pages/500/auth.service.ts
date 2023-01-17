import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthSerrvice implements Resolve<any> {
    private apiUrl = environment.apiUrl + '/auth';
    constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return this.afterLogin();
    }

    afterLogin() : Promise<any> {
        // return this.authenticationService.getAuthProfile().toPromise();
        return this.authenticationService.getAuthProfile().toPromise();
    }
}