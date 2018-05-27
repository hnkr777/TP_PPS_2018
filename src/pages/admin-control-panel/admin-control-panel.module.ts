import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminControlPanelPage } from './admin-control-panel';

@NgModule({
  declarations: [
    AdminControlPanelPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminControlPanelPage),
  ],
})
export class AdminControlPanelPageModule {}
