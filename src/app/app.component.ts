import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from './models/role.models';
import { AuthService } from './services/auth.service';
import IdleTimer from "./IdleTimer.js";
import { TokenService } from 'src/app/services/token.service';
import { ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FunctionsService } from './services/functions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HelipagosDashboard';
  timer 
  @ViewChild('sesionSwal') mensajeSwal: SwalComponent

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private TokenService: TokenService,
    private _functionsService: FunctionsService
    ){


  }

  get isAuthorized() {
    return this.authService.isAuthorized();
  }

  get isAdmin() {
    return this.authService.hasRole(Role.ROLE_ADMIN);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  ngOnInit() {
   
    this.timer = new IdleTimer({
      timeout: 300, //expira despues de 5 minutos
      onTimeout: () => {
        this._functionsService.imprimirMensaje("nada", "Sesión cerrada por inactividad");
        this.TokenService.logOut()
        this._functionsService.configSwal(this.mensajeSwal, `Sesion Caducada`, "error", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire();
      }
    });
  }
  ngOnDestroy() {
    this.timer.clear();
  }

  
}
