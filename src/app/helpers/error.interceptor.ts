import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        public router: Router,
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(response => {
                if ([401, 403].indexOf(response.status) !== -1) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api

                    if(this.authenticationService.currentUserValue) {
                        this.authenticationService.logout();
                    } else {
                        this.router.navigate(['/login']);
                    }
                }

                let error: string;
                if (typeof response.error === 'object') {
                    error = response.error.error;
                } else {
                    error = response.error;
                }
                error = error || response.statusText;
                return throwError(error);
            })
        );
    }
}
