import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaClienteParaAdminPage } from './alta-cliente-para-admin';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AltaClienteParaAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaClienteParaAdminPage),
    TranslateModule.forChild(),
  ],
  exports: [
    AltaClienteParaAdminPage
  ]
})
export class AltaClienteParaAdminPageModule {}
