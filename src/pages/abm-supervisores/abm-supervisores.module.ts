import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AbmSupervisoresPage } from './abm-supervisores';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AbmSupervisoresPage
  ],
  imports: [
    IonicPageModule.forChild(AbmSupervisoresPage),
    TranslateModule.forChild()
  ],
})
export class AbmSupervisoresPageModule {}
