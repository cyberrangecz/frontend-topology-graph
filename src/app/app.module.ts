import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { SentinelAuthModule } from '@sentinel/auth';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard } from '@sentinel/auth/guards';
import { AppRoutingModule } from './app-routing.module';
import { SentinelConfirmationDialogComponent } from '@sentinel/components/dialogs';
import { SentinelBreadcrumbsModule } from '@sentinel/layout/breadcrumbs';
import { SentinelLayout1Module } from '@sentinel/layout/layout1';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        SentinelLayout1Module,
        SentinelConfirmationDialogComponent,
        SentinelAuthModule.forRoot(environment.authConfig),
        SentinelBreadcrumbsModule,
        RouterModule,
        RouterOutlet
    ],
    providers: [SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
