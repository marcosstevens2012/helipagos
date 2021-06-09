import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { ContactoComponent } from './components/contacto/contacto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { SaldosComponent } from './components/saldos/saldos.component';
import { Role } from './models/role.models';
import { AuthService } from './services/auth.service';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'home', component: DashboardComponent, 
  canLoad: [AuthGuard], 
  canActivate: [AuthGuard],
    children:[
      { path: 'miCuenta', component: MiCuentaComponent},
      { path: 'movimientos', component: MiCuentaComponent},
      { path: 'saldos', component: SaldosComponent},
      { path: 'pagos', component: PagosComponent},
      { path: 'contacto', component: ContactoComponent}
    ]
  },
  { path: 'home', component: DashboardComponent, 
    canLoad: [AuthGuard], 
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/components/admin/admin.module').then(m => m.AdminModule),
    data: {
      roles: [
        Role.ROLE_ADMIN,
      ]
    }
  
},
{
  path:'**',
  component: LoginComponent
}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ AuthGuard, AuthService ]
})

export class RoutingModule { }
