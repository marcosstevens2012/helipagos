import { Injectable } from '@angular/core';
import { SolicitudPago } from '../models/solicitud_pago.models';
import { FunctionsService } from './functions.service';
// import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TransaccionesService {



  private respuestaSolicitudPago: SolicitudPago[] = [];

  private busquedaTransaccion: any[];

  private idDetalle: number;

  private jsonTransmision: any[]

  constructor(
    private _functionsService: FunctionsService
  ) { }



  //getters
  // getDatosLiquidacion(){
  //   return this.datosLiquidacion;
  // }

  getRespuestaSolicitudPago(){
    return this.respuestaSolicitudPago;
  }

  getIdDetalle(){
    return this.idDetalle != null? this.idDetalle:localStorage.getItem("idx");
  }

  getBusquedaTransaccion(){
    return this.busquedaTransaccion;
  }

  getSolicitudPago(id: number): SolicitudPago[]{
    this._functionsService.imprimirMensaje(this.respuestaSolicitudPago, "-- RESPUESTA SOLICITUD PAGO: ");
    return this.respuestaSolicitudPago.filter(it =>{
      return it.id == id;
    });
  }

  getJsonTransmision(){
    return this.jsonTransmision;
  }

  //setters 

  setRespuestaSolicitudPago(response){
    response.forEach(element => {
      var solicitud: SolicitudPago = element;
      this.respuestaSolicitudPago.push(solicitud);
    });
  }

  setBusquedaTransaccion(busqueda){
    this.busquedaTransaccion = busqueda;
  }

  setIdDetalle(idx: number){
    localStorage.setItem("idx",idx.toString());
  }

  setJsonTransmision(json : any){
    this.jsonTransmision = json;
  }

}


export interface Liquidacion{
  id:number;
  name: string;
  cuil: string;
  cbu: number;
  concepto: string;
  descripcion: string;
  pago: number;
  descuento: number;
  emision: string;
}

