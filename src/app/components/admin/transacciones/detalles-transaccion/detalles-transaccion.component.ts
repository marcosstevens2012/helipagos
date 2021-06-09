import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { SolicitudPago } from 'src/app/models/solicitud_pago.models';
import { ApiService } from 'src/app/services/api.service';
import { RespuestaSolicitudPago } from 'src/app/models/respuesta_solicitud_pago.models';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-detalles-transaccion',
  templateUrl: './detalles-transaccion.component.html',
  styleUrls: ['./detalles-transaccion.component.css']
})
export class DetallesTransaccionComponent implements OnInit {

  displayedColumns =
  ['Nombre del cliente', 'Descripción', 'Fecha de creación', 
  'Importe', 'Fecha de actualización', 'URL ID', 'Cliente',
  'Tipo de pago','Referencia externa', 'Fecha del importe',
  'Importe bonificado', 'Código de barras'];

  public dataSource = [];

  id: number;
  detalle: SolicitudPago;

  constructor( private location: Location,
    private _transaccionesService: TransaccionesService,
    private _apiService: ApiService,
    private _functionsService: FunctionsService ) { }

  ngOnInit(): void {



    this.id = +this._transaccionesService.getIdDetalle();
    this._functionsService.imprimirMensaje(this.id, "Mi id detalle transaccion");
    //this.detalle = this._transaccionesService.getSolicitudPago(this.id)[0];



    if(this.detalle == null){
      this._apiService.getOneSolicitudPago(this.id)
      .then(response => {
        var datos: any = response;
 
        // this._transaccionesService.setRespuestaSolicitudPago(listaDatos.content);
        this.detalle = datos;
        this.cargarTabla();

      })
      .catch(error => {
        this._functionsService.imprimirMensaje(error, "Error en respuesta solicitud pago con filtro");
      });
    }else{ 
      this._functionsService.imprimirMensaje(this.detalle, "Mi detalle en detalle transaccion");
      this.cargarTabla();
    }
  }

  Volver(){
    this.location.back();
  }

  cargarTabla(){
    
    this.dataSource = [];
    var nodisponible = "(no disponible)";

    if(this.detalle != null){
      this.dataSource.push(
        [this.detalle.cliente != null? this.detalle.cliente.nombre_legal: nodisponible],
        [this.detalle.descripcion != null? this.detalle.descripcion: nodisponible],
        [this.detalle.create_at != null? this.detalle.create_at.slice(0,10): nodisponible],
        [this.detalle.importe != null? "$ "+(this.detalle.importe/100).toFixed(2): nodisponible],
        [this.detalle.updated_at != null? this.detalle.updated_at.slice(0,10): nodisponible],
        [this.detalle.url_id != null? this.detalle.url_id: nodisponible], 
        [this.detalle.cliente != null? this.detalle.cliente.razon_social: nodisponible], 
        [this.detalle.medio_pago != null? this.detalle.medio_pago.forma_pago.tipo: nodisponible], 
        [this.detalle.referencia_externa != null? this.detalle.referencia_externa: nodisponible], 
        [this.detalle.fecha_importe != null? this.detalle.fecha_importe.slice(0,10): nodisponible], 
        [this.detalle.importe_bonificado != null? "$ "+(this.detalle.importe_bonificado/100).toFixed(2): nodisponible], 
        [this.detalle.codigo_barra != null? this.detalle.codigo_barra['codigo_barra']: nodisponible]);
    }
    
  }

}
interface detalleTransaccion{
  nombre: string;
  descripcion: string;
  fechaCreacion: Date; 
  fechaVencimiento: Date;
  importe: number;
  fechaActualizacion: Date;
  idURL: string;
  clienteID: number;
  tipoPago: string;
  referenciaExterna: string;
  fechaImporte: Date;
  importeBonificado: string;
  codigoBarras:string;
}
