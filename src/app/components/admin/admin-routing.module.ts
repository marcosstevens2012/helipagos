import { Routes, RouterModule } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { ArchivosTransmisionComponent } from './transacciones/archivos-transmision/archivos-transmision.component';
import { ConsultaComponent } from './transacciones/consulta/consulta.component';
import { DetallesVistaComponent } from './transacciones/detalles-vista/detalles-vista.component';
import { TablaResultadosComponent } from './transacciones/tabla-resultados/tabla-resultados.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ArchivoBaseComponent } from '../admin/transacciones/archivo-base/archivo-base.component';


// canActivate: [AuthGuard]
export const APP_ROUTES: Routes = [
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'clientes', component: ClientesComponent},
  { path: 'abm_usuarios', component: UsuariosComponent},
  { path: 'facturacion', component: FacturacionComponent},
  { path: 'liquidacion', component: LiquidacionComponent},
  { path: 'estadisticas', component: EstadisticasComponent},
  { path: 'transacciones/consulta', component: ConsultaComponent},
  { path: 'transacciones/resultados', component: TablaResultadosComponent},
  { path: 'transacciones/detalles', component: DetallesVistaComponent},
  { path: 'transacciones/archivosTransmision', component: ArchivosTransmisionComponent},
  { path: 'transacciones/archivosTransmision/:agencia', component: ArchivosTransmisionComponent},
  { path: 'transacciones/archivoBase', component: ArchivoBaseComponent}

];
