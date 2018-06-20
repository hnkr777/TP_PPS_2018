import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoChoferesDisponiblesPage } from './listado-choferes-disponibles';

@NgModule({
  declarations: [
    ListadoChoferesDisponiblesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoChoferesDisponiblesPage),
  ],
})
export class ListadoChoferesDisponiblesPageModule {}
