import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NuevoViajePage } from './nuevo-viaje';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NuevoViajePage,
  ],
  imports: [
    IonicPageModule.forChild(NuevoViajePage),
    TranslateModule.forChild(),
  ],
  exports: [
    NuevoViajePage
  ]
})
export class NuevoViajePageModule {}
