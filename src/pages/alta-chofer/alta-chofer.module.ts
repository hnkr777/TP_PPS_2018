import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaChoferPage } from './alta-chofer';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AltaChoferPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaChoferPage),
    TranslateModule.forChild(),
    TranslateModule,
  ],
  exports: [
    AltaChoferPage
  ]
})
export class AltaChoferPageModule {}
