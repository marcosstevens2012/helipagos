import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import {environment } from '../../environments/environment';
import { FunctionsService } from './functions.service';
import { TransaccionesService } from './transacciones.service';
import { SolicitudPago } from '../models/solicitud_pago.models';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string;
  private urlLogin: string;
  private urlSolicitud: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private transaccionService: TransaccionesService,
    private _functionsService: FunctionsService) { 
      this.urlLogin = environment.endpointLogin + '/api/auth/login'
      this.urlSolicitud = environment.endpoint + '/api/solicitud_pago/get_solicitud'
      this.url  =  environment.endpoint
  }


  getLogin(username: string, password: string){
    var data = new FormData();
    data.append('username', username);
    data.append('password', password);
    return this.http.post(this.urlLogin, data).toPromise();
  }

  errorPeticion(){
    this.router.navigate(['login']);
  }


  /////////////////////////////////////////////////////////////////////////////
  getAllRespuestaSolicitudPago(){
    return this.http.get(this.urlSolicitud).toPromise();
  }



  getRespuestaSolicitudPagoWithFilter(page: number, pageSize: string){
    var busqueda = this.transaccionService.getBusquedaTransaccion();     
    let paramss = new HttpParams();

    for(var i in busqueda){
      if(busqueda[i] != "")
        paramss = paramss.set(i, busqueda[i]);
    }

    paramss = paramss.set('pageNumber', page.toString());
    paramss = paramss.set('pageSize', pageSize);

    return this.http.get(this.urlSolicitud,{ params: paramss}).toPromise();
  }

  getOneSolicitudPago(id:number){
    var url = this.urlSolicitud+"_id/"+id;
    return this.http.get(url).toPromise();
  }


/////////////////////////////////////////////////////////////////////////////
  enviarArchivo(archivoTransimision: File): Promise<any> {
    const formData = new FormData();
    formData.append('archivoTransmision', archivoTransimision);
    this._functionsService.imprimirMensaje(formData.get('archivoTransmision'), "-- El archivo transmisión a enviar");
    return this.http.post(this.url+'/api/archivo_transmision/proceso_archivo_transmision', formData).toPromise();
  }


  guardarArchivo(json): Observable<any>{
    return this.http.post(this.url+'/api/archivo_transmision/guardar_archivo_transmision',json);
  }
/////////////////////////////////////////////////////////////////////////////

  descargarArchivo(data) {
    const formData = new FormData();


    formData.append('fecha_inicio', data.desdeCreacion)
    formData.append('fecha_fin', data.hastaCreacion)

    return this.http.post(this.url+'api/archivo_transmision/crear_archivo_base', formData).toPromise();
    // this._functionsService.imprimirMensaje(formData.get('archivoTransmision'), "-- El archivo transmisión a enviar");
    // return this.http.post(this.url+'api/archivo_transmision/crear_archivo_base', formData).toPromise();

  }

/////////////////////////////////////////////////////////////////////////////
    // consultas usuarios

    getUsers(){
      var json = {"username": ""}
      return this.http.post(this.url+'/api/usuarios/get_list_user_by_id', json);
    }

    createUser(user){
      console.log('usuario', user)
      return this.http.post(this.url+'/api/usuarios/guardar_usuario', user).toPromise();
    }

    editUser(userId, user){
      var json = {
      }
      for(var key in user){
        if(user[key]!=null && user[key]!=""){
          json[key] = user[key]
        }
      }     
      var url = `${this.url}/api/usuarios/actualizar_usuario?id=${userId}`;
      return this.http.post(url,json).toPromise();
    }

    disableUser(userId){
      var json = {
        "id": userId
      }
      var url = `${this.url}/api/usuarios/disable_user?id=${userId}`;
      return this.http.post(url,json).toPromise();
    }

/////////////////////////////////////////////////////////////////////////////
    //consultas clientes

    getClientes(){
      return this.http.get(this.url+'/api/cliente/clientes').toPromise();
    }

    createCliente(cliente){
      return this.http.post(this.url+'/api/cliente/guardar_cliente', cliente).toPromise();
    }

    editCliente(clienteId, cliente){
      var json = {
      }
      for(var key in cliente){
        if(cliente[key]!=null && cliente[key]!=""){
          json[key] = cliente[key]
        }
      }     
      var url = `${this.url}/api/cliente/guardar_cliente?id=${clienteId}`;
      return this.http.post(url,json).toPromise();
    }

    disableCliente(clienteId){
      var json = {
        "id": clienteId
      }
      var url = `${this.url}/api/cliente/disable_cliente?id=${clienteId}`;
      return this.http.post(url,json).toPromise();
    }

    generarToken(cliente){
      return this.http.post(this.url+'/api/cliente/generar_bearer',cliente).toPromise();
    }


/////////////////////////////////////////////////////////////////////////////
    //consultas medio pago

    getMedioPago(){
      return this.http.get(this.url+'/api/medio_pago/medios_pagos').toPromise();
    }

    createMedioPago(medioPago){
      return this.http.post(this.url+'/api/medio_pago/crear_medio_pago', medioPago).toPromise();
    }

    editMedioPago(medioPagoId, medioPago){
      var json = {
        "id": medioPagoId
      }
      for(var key in medioPago){
        if(medioPago[key]!=null && medioPago[key]!=""){
          json[key] = medioPago[key]
        }
      }     
      var url = `${this.url}/api/medio_pago/actualizar_medio_pago`;
      return this.http.patch(url,json).toPromise();
    }

    // disableMedioPago(medioPagoId){
    //   var json = {
    //     "id": medioPagoId
    //   }
    //   var url = `/api/medio_pago/disable_medio_pago?id=${medioPagoId}`;
    //   return this.http.post(url,json).toPromise();
    // }



    /////////////////////////////////////////////////////////////////////////////
    enviarMotivo(json){
      var url = `${this.url}/api/transaccion_simple/solicitud_devolucion_total`;
      return this.http.post(url, json).toPromise();
    }
}
