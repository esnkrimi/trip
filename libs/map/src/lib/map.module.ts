import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapBoardComponent } from './component/map.component';
import { LoadingProgressModule } from '@pe/loading-progress';
import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { JoyrideModule } from 'ngx-joyride';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HelpModule } from '@pe/help';
import { RouterModule } from '@angular/router';
import { AdvancedAutocompleteModule } from '@pe/advanced-autocomplete';
import { LazyModule } from '@appBase/lazy/lazy.module';
import { TranslateModule } from '@ngx-translate/core';
import { DistancePipe } from '@appBase/pipe/distance-to-time.pipe';

@NgModule({
  declarations: [MapBoardComponent, DistancePipe],
  imports: [
    CommonModule,
    MatSnackBarModule,
    LoadingProgressModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    HelpModule,
    HelpModule,
    LazyModule,
    AdvancedAutocompleteModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    JoyrideModule.forRoot(),
    MatDialogModule,
    DragDropModule,
    TranslateModule,
    MatButtonModule,
  ],
  exports: [MapBoardComponent],
})
export class MapBoardModule {}
