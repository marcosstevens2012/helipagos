import { Injectable } from '@angular/core';
import { Role } from '../models/role.models';
import { User } from '../models/user.models';
import { TokenService } from './token.service';

import { ApiService } from './api.service';
import { LoginUser } from '../models/login-user.models';
import { FunctionsService } from './functions.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usert: User;

  constructor(private _apiService: ApiService,
    private _tokenService: TokenService,
    private _functionsService: FunctionsService) { }


  isAuthorized() {
    this.usert = new User();
    this.usert.authorities = this._tokenService.getAuthorities();
    this.usert.username = this._tokenService.getUserName();

    if(this.usert.username != null){
      return this.usert;
    }else{
      return false;
    }
    
  }

  hasRole(role: Role) {
      return this.isAuthorized() && this.usert.authorities[0].authority === Role.ROLE_ADMIN;
  }


  login(user: string, password: string): Promise<boolean> {
    var log = false;
    return this._apiService.getLogin(user, password)
      .then(response => {
        this._functionsService.imprimirMensaje(response, "-- Login exitoso: ");
        this._tokenService.setData(response);              
        this.usert = response['user'];
        log = true;
        return log;
        }  
      )
      .catch(error =>{
        this._functionsService.imprimirMensaje(error, "-- Login error: ");
        return log;
      })     
  }



  logout() {
    this.usert = null; 
  }
}
