import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisibilityMenuComponent } from './visibility-menu.component';
import { SettingsService } from '../services/settings.service';
import { MatExpansionModule, MatSlideToggleModule } from '@angular/material';

@NgModule({
  declarations: [
    VisibilityMenuComponent
  ],
  imports: [
    CommonModule,    
    MatExpansionModule,
    MatSlideToggleModule
  ],
  exports: [
    VisibilityMenuComponent
  ],
  providers: [
    SettingsService
  ]
})
export class VisibilityMenuModule { }
