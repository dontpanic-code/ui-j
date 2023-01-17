import { Injectable } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private adalSvc: MsAdalAngular6Service) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.adalSvc.acquireToken('https://login.microsoftonline.com/').subscribe((token: string) => {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    });

    return next.handle(request);
  }
}
