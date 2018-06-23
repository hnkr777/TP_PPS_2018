import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { EncuestaChoferPage } from './encuesta-chofer';

@NgModule({
  declarations: [
    //EncuestaChoferPage,
  ],
  imports: [
    IonicPageModule.forChild(EncuestaChoferPage),
    TranslateModule.forChild()
  ],
  exports: [
    //EncuestaChoferPage
  ]
})
export class EncuestaChoferPageModule { }
