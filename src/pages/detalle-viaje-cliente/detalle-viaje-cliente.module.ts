import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleViajeClientePage } from './detalle-viaje-cliente';

@NgModule({
  declarations: [
    DetalleViajeClientePage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleViajeClientePage),
  ],
})
export class DetalleViajeClientePageModule {}
