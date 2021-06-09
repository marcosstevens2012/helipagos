import { Component, OnInit } from '@angular/core';
import { RespuestaSolicitudPago } from 'src/app/models/respuesta_solicitud_pago.models';
import { SolicitudPago } from 'src/app/models/solicitud_pago.models';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { TransaccionesService } from 'src/app/services/transacciones.service';


@Component({
  selector: 'app-detalles-forma-pago',
  templateUrl: './detalles-forma-pago.component.html',
  styleUrls: ['./detalles-forma-pago.component.css']
})
export class DetallesFormaPagoComponent implements OnInit {

  displayedColumns =
  ['Forma de pago', 'Tipo', 'Monto', 
  'Código de pago', 'Código de barras'];

  public dataSource = [
  ]
  
  id: number;
  detalle: SolicitudPago;


  constructor(
    private _transaccionesService:TransaccionesService,
    private _apiService: ApiService,
    private _functionsService: FunctionsService) { }

  ngOnInit(): void {

    this.id = +this._transaccionesService.getIdDetalle();
    this._functionsService.imprimirMensaje(this.id, "-- Mi id forma de pago ");

    this.detalle = this._transaccionesService.getSolicitudPago(this.id)[0];
      if(this.detalle == null){
      this._apiService.getOneSolicitudPago(this.id)
      .then(response => {
        var datos: any = response;
 
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

  cargarTabla(){

    this.dataSource = [];
    var nodisponible = "(no disponible)";

    if(this.detalle != null){

      this._functionsService.imprimirMensaje(this.detalle, "-- El detalle en fuction cargar tabla");
      this.dataSource.push(
        [this.detalle.medio_pago != null? this.detalle.medio_pago.marca: nodisponible],
        [this.detalle.medio_pago != null? this.detalle.medio_pago.forma_pago.tipo: nodisponible],
        [this.detalle.importe != null? "$ "+(this.detalle.importe/100).toFixed(2): nodisponible],
        [this.detalle.id != null? this.detalle.id: nodisponible],
        [this.detalle.codigo_barra!=null?this.detalle.codigo_barra['codigo_barra']: nodisponible])
    }else{
      this._apiService.getRespuestaSolicitudPagoWithFilter(+localStorage.getItem("page"), "10")
        .then(response => {
          this._functionsService.imprimirMensaje(response, "-- Response forma de pago con localstorage ");
          var datos: any = response;
          this.detalle = datos.content
          this.cargarTabla()
        })
        .catch((error) => {
          this._functionsService.imprimirMensaje(error, "-- Error en transacción ");
      })
    }

  }
}
