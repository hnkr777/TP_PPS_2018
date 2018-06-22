import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaSupervisorPage } from './alta-supervisor';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    //AltaSupervisorPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaSupervisorPage),
    TranslateModule.forChild(),
  ],
  exports: [
    //AltaSupervisorPage
  ]
})
export class AltaSupervisorPageModule {}
