import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { SentinelAuthModule } from '@sentinel/auth';
import { RouterModule } from '@angular/router';
import { SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard } from '@sentinel/auth/guards';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        SentinelAuthModule.forRoot(environment.authConfig),
        RouterModule
    ],
    providers: [SentinelAuthGuardWithLogin, SentinelNegativeAuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
