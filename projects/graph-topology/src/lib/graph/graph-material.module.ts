import {NgModule} from '@angular/core';
import {
  MatButtonModule, MatButtonToggleModule, MatIconModule, MatMenuModule, MatTabsModule, MatSidenavModule,
  MatDividerModule, MatCheckboxModule, MatCardModule, MatSlideToggleModule, MatExpansionModule, MatSliderModule, MatRadioModule,
  MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
  MatProgressSpinnerModule,
} from '@angular/material';

/**
 * Module for Angular Material in the graph components
 */
@NgModule({
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatDividerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSliderModule,
    MatRadioModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule


  ],
  exports: [
    MatMenuModule,
    MatSliderModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatDividerModule,
    MatCheckboxModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatRadioModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})

export class GraphMaterialModule {}
