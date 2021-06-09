import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { RespuestaSolicitudPago } from 'src/app/models/respuesta_solicitud_pago.models';
import { SolicitudPago } from 'src/app/models/solicitud_pago.models';
import { TransaccionTarjeta } from 'src/app/models/transaccion_tarjeta.models';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { TokenService } from 'src/app/services/token.service';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-detalles-vista',
  templateUrl: './detalles-vista.component.html',
  styleUrls: ['./detalles-vista.component.css']
})
export class DetallesVistaComponent implements OnInit {

  @ViewChild('motivoDevolucion') textAreaMotivo: ElementRef
  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  @Input() displayedColumns: any = {};
  @Input() dataSource: any = [];

  
  public formaPago:boolean;
  public detalles:boolean;
  public devolucionPago:boolean;
  public devuelto: boolean;
  idDecidir:number;
  id:number ;
  detalle: SolicitudPago;
  efectivo: boolean;


  constructor(
    private _transaccionesService:TransaccionesService,
    private _apiService: ApiService,
    private _tokenService: TokenService,
    private _functionsService: FunctionsService
  ) { }

  ngOnInit(): void {
    this.activeItem("formaPago");
    this.displayedColumns =
      ['Fecha de creación', 'Fecha de vencimiento', 'Detalle de la operación', 'ID Decidir', 'Código de autorización',
      'AVC', 'Importe','Cuotas', 'Ticket','Token', 'Fecha de autorización',
      'Estado'
    ];

    this.id = +this._transaccionesService.getIdDetalle();
    //this.detalle = this._transaccionesService.getSolicitudPago(this.id)[0];
   
    if(this.detalle == null){
      this._apiService.getOneSolicitudPago(this.id)
      .then(response => {
        var datos: any = response;

        var listaDatos: RespuestaSolicitudPago = datos;
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


  cargarTabla(){

    console.log('DETALLE ',this.detalle)
    this.dataSource = [];
    if(this.detalle != null){
      var transaccionTarjeta: TransaccionTarjeta = this.detalle.transaccion_tarjeta != null? this.detalle.transaccion_tarjeta[this.detalle.transaccion_tarjeta.length-1]: null; //la ultima transaccion es la aprobada
      const NODISPONIBLE = "(no disponible)";
      this._functionsService.imprimirMensaje(this.detalle, "Detalle a consultar");
      this.idDecidir = transaccionTarjeta != null? transaccionTarjeta.id_transaccion_decidir : null;
      this.dataSource.push(
        [this.detalle.medio_pago !=null? this.detalle.medio_pago.create_at : NODISPONIBLE], 
        [this.detalle.fecha_vto !=null? this.detalle.fecha_vto.slice(0,10) : NODISPONIBLE], 
        [transaccionTarjeta != null? transaccionTarjeta.detalle_operacion : NODISPONIBLE], 
        [transaccionTarjeta != null? transaccionTarjeta.id_transaccion_decidir : NODISPONIBLE], 
        [transaccionTarjeta != null? transaccionTarjeta.card_authorization_code : NODISPONIBLE],
        [transaccionTarjeta != null? transaccionTarjeta.address_validation_code : NODISPONIBLE],
        [transaccionTarjeta != null? "$ "+(transaccionTarjeta.importe/100).toFixed(2) : NODISPONIBLE],
        [transaccionTarjeta != null? transaccionTarjeta.installments : NODISPONIBLE],
        [transaccionTarjeta != null? transaccionTarjeta.ticket : NODISPONIBLE],
        [transaccionTarjeta != null? transaccionTarjeta.token : NODISPONIBLE], 
        [transaccionTarjeta != null? transaccionTarjeta.token_created_at : NODISPONIBLE], 
        [transaccionTarjeta != null? (transaccionTarjeta.tansaccion_tarjeta_estado != null? transaccionTarjeta.tansaccion_tarjeta_estado.description : NODISPONIBLE)  : NODISPONIBLE]
      );
    }

    this.comprobar()

  }

  comprobar(){
    if (this.detalle.solicitud_estado.descripcion == 'DEVUELTA' || this.detalle.medio_pago.forma_pago.tipo == 'EFECTIVO') {
      return true  
    }else{
      return false
    } 
  }

  activeItem(value: string ){
    
    if(value == "formaPago"){
        this.formaPago = false;
        this.detalles = true;
        this.devolucionPago = true;
        //Active class
        $(".btn-detalles").addClass("btn-selected");    
        $(".btn-formaPago").removeClass("btn-selected"); 
        $(".btn-devolucion-pago").addClass("btn-selected");  
    }
    if(value == "detalles"){
      this.detalles = false;
      this.formaPago = true;
      this.devolucionPago = true;
       //Active class
       $(".btn-formaPago").addClass("btn-selected");    
       $(".btn-detalles").removeClass("btn-selected");
       $(".btn-devolucion-pago").addClass("btn-selected");
       
    }

    if(value == "devolucionPago"){
      this.devolucionPago = false;
      this.detalles = true;
      this.formaPago = true;
      //Active class
      $(".btn-devolucion-pago").removeClass("btn-selected");
      $(".btn-formaPago").addClass("btn-selected");    
      $(".btn-detalles").addClass("btn-selected");
      
    }

  }

  enviarMotivo(){
    var userName = this._tokenService.getUserName();
    var json = {
      "detalle_devolucion": this.textAreaMotivo.nativeElement.value,
      "username": userName,
      "id_transaccion_decidir": this.idDecidir
  }
    this._apiService.enviarMotivo(json)
    .then((response)=>{
      this._functionsService.imprimirMensaje(response, "Response motivo");
      this._functionsService.configSwal(this.mensajeSwal, `Pago devuelto correctamente`, "success", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire();
    })
    .catch((error) =>{
      this._functionsService.imprimirMensaje(error, "Error motivo");
      this._functionsService.configSwal(this.mensajeSwal, `Error al intentar devolver el pago`, "error", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire();
    })
  }

}
