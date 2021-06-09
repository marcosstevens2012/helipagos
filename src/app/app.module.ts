//Modulos
// import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './components/shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';


//redux
import { miReducer } from './redux/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';

//Rutas
import { RoutingModule } from './routing.module';

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

//Servicios
import { ValidatorInterceptorService } from './services/validator-interceptor.service';
import { AuthService } from './services/auth.service';

//Directivas
import { UserDirective } from './directives/user.directive';
import { UserRoleDirective } from './directives/user-role.directive';

//Pipes
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactoComponent } from './components/contacto/contacto.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    NavbarComponent,
    MiCuentaComponent,
    PagosComponent,
    DashboardComponent,
    UserDirective,
    UserRoleDirective,
    NotFoundComponent,
    ContactoComponent    
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    SharedModule,
    HttpClientModule,
    StoreModule.forRoot({
      mensaje: miReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 4
    }),
    BrowserAnimationsModule
  ],
  exports: [
    UserDirective,
    UserRoleDirective
  ],
  providers: [
    AuthService, 
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: ValidatorInterceptorService, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
