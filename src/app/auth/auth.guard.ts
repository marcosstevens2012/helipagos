import { CanActivate, Router, ActivatedRouteSnapshot, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../../app/services/auth.service';
import { Role } from '../models/role.models';
import { FunctionsService } from '../services/functions.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(
        private router: Router,
        private authService: AuthService,
        private _functionsService: FunctionsService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
        if (!this.authService.isAuthorized()) {
            this._functionsService.imprimirMensaje("auth guard", "No está autorizado: ");
            this.router.navigate(['login']);
            return false;
        }

        const roles = route.data.roles as Role[];
        if (roles && !roles.some(r => this.authService.hasRole(r))) {
            this._functionsService.imprimirMensaje("auth guard", "Redirecciona ");
            this.router.navigate(['login']);
            return false;
        }

        return true;
    }

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
     
        if (!this.authService.isAuthorized()) {
            this.router.navigate(['login']);
            return false;
        }

        const roles = route.data && route.data.roles as Role[];
        if (roles && !roles.some(r => this.authService.hasRole(r))) {
            this.router.navigate(['login']);
            return false;
        }

        return true;
    }
}
  

