import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { MsAdalAngular6Module } from 'microsoft-adal-angular6';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ErrorInterceptor, JwtInterceptor } from './helpers';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';

import { fuseConfig } from '@app/fuse-config';
import { environment } from '@environment';

import { LayoutModule } from '@app/layout/layout.module';

import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthGuardService } from './services/authguard.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { MatDialogModule } from '@angular/material/dialog';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),


        MatDialogModule,    
        
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,

        // App modules
        LayoutModule,
        MsAdalAngular6Module.forRoot({
            tenant: environment.tenant,
            clientId: environment.clientId,
            redirectUri: window.location.origin,
            endpoints: environment.endpoints,
            navigateToLoginRequestUrl: true,
            cacheLocation: 'localStorage'
        }),    
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient],
            },
            useDefaultLang: false,
          })    
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        AuthGuardService

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
