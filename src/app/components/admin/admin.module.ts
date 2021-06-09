import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './admin-routing.module';


import { FacturacionComponent } from './facturacion/facturacion.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { ConsultaComponent } from './transacciones/consulta/consulta.component';
import { DetallesFormaPagoComponent } from './transacciones/detalles-forma-pago/detalles-forma-pago.component';
import { DetallesTransaccionComponent } from './transacciones/detalles-transaccion/detalles-transaccion.component';
import { DetallesVistaComponent } from './transacciones/detalles-vista/detalles-vista.component';
import { TablaResultadosComponent } from './transacciones/tabla-resultados/tabla-resultados.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ArchivosTransmisionComponent } from './transacciones/archivos-transmision/archivos-transmision.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ArchivoBaseComponent } from '../admin/transacciones/archivo-base/archivo-base.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    FacturacionComponent,
    LiquidacionComponent,
    ConsultaComponent,
    DetallesFormaPagoComponent,
    DetallesTransaccionComponent,
    DetallesVistaComponent,
    TablaResultadosComponent,
    UsuariosComponent,
    ArchivosTransmisionComponent,
    ArchivoBaseComponent,
    EstadisticasComponent,
    ClientesComponent,
    MatProgressBarModule
  ],
  imports: [
    RouterModule.forChild(APP_ROUTES),
    SharedModule
  ]
})
export class AdminModule { }
