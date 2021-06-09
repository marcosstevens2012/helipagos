import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Location } from '@angular/common';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-archivos-transmision',
  templateUrl: './archivos-transmision.component.html',
  styleUrls: ['./archivos-transmision.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ArchivosTransmisionComponent implements OnInit {
@ViewChild('failSwal') failSwal: SwalComponent
@ViewChild('okSwal') okSwal: SwalComponent
@ViewChild('cancelSwal') cancelSwal: SwalComponent
@ViewChild('incorrectoSwal') incorrectoSwal: SwalComponent
@ViewChild('btnConfirmar') btnConfirmar: HTMLElement
@ViewChild('sesionSwal') sesionSwal: SwalComponent

  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  archivoTransimision: File;
  dataSourceDetalles = [];
  displayedColumnsDetalles;
  displayedColumnsSearchDetalles;
  mensajeResultadoDetalles: string;
  jsonTransmision;
  agencia;
  totalImporte: number = 0;
  btnActive: boolean = true;
  progressbarActive : boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private _apiService: ApiService,
    private _tokenService: TokenService,
    private location: Location,
    private _functionsService: FunctionsService
    ) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      if(this.agencia != params.get('agencia')){
        this.limpiarComponente();
      }
      this.agencia = params.get('agencia');
    });
    // this.displayedColumnsDetalles = ["Id", "Id terminal", "Código de transacción", "Importe", "Fecha de creación", "Fecha de cobro", "Hora de cobro", "Código de barras", "Nombre del archivo"]
    
  }


  public seleccionarArchivo(event): void {
    this.archivoTransimision = event.target.files[0];
  }


  async enviar() {
    this.progressbarActive = true;
     
    if (this.archivoTransimision != null && this.archivoTransimision.size != 0) {
      var codigo = this.archivoTransimision.name.slice(0,2);
      if(this.agencia == "rapipago" && codigo == "RP" || this.agencia == "pagofacil" && codigo == "PF" || this.agencia == "provincianet" && codigo == "PN"
        || this.agencia == "bicaagil" && codigo == "HP" || this.agencia == "ripsa" && codigo == "Ri" || this.agencia == "multipago" && codigo == "HE"
        || this.agencia == "prontopago" && codigo == "PP" || this.agencia == "cobroexpress" && codigo == "CE"){
        await this._apiService.enviarArchivo(this.archivoTransimision)
        .then(
          response =>{
            this.cargarTabla(response);
            this._functionsService.imprimirMensaje(response, "Response en EnviarArchivo: ");                  
          })
        .catch(error => {
            this.failSwal.fire();
            this._functionsService.imprimirMensaje(error, "Error de la petición: ");
        })
        .finally(()=>{
          this.progressbarActive = false;
        })
      }else{
        this.limpiarComponente();
        this.incorrectoSwal.fire();
      }   
    } else {
      this.progressbarActive = false;
      this.cancelSwal.fire();
    }
  }


  cargarTabla(misDatos){
    var arrayDetallesTransmision = Array<DetalleTransmision>()
    this.displayedColumnsDetalles = [];
    this.jsonTransmision = [...misDatos];

    this.totalImporte = 0;
    for(var i in this.jsonTransmision){

      this.displayedColumnsSearchDetalles = [];
      var itemDetalle: DetalleTransmision = {
        id: "",
        terminal_id: "",
        codigo_transaccion: "",
        importe: "",
        fecha_creacion: "",
        fecha_importe: "",
        hora_importe: "",
        codigo_barra: "",
        nombre_archivo: "",
        medio_pago: "",
        forma_pago: ""
      }
      
      try {
        if(this.agencia == 'pagofacil'){
          itemDetalle['terminal_id'] = this.jsonTransmision[i]['terminal_id'];
          itemDetalle['fecha_creacion'] = this.formatearFecha(this.jsonTransmision[i]['fecha_creacion']);
          itemDetalle['hora_importe'] = this.jsonTransmision[i]['hora_importe']; 
        }else if (this.agencia == 'provincianet'){
          itemDetalle['terminal_id'] = this.jsonTransmision[i]['terminal_id'];
        }
  
        itemDetalle['id'] = this.jsonTransmision[i]['id'];
        itemDetalle['codigo_barra'] = this.jsonTransmision[i]['codigo_barra'] != null ? this.jsonTransmision[i]['codigo_barra']['codigo_barra'] : null;
        itemDetalle['codigo_transaccion'] = this.jsonTransmision[i]['codigo_barra'] != null ? this.jsonTransmision[i]['codigo_barra']['codigo_transaccion'] : null;
        itemDetalle['fecha_importe'] = this.formatearFecha(this.jsonTransmision[i]['fecha_importe']);
        itemDetalle['importe'] = `$ ${(this.jsonTransmision[i]['importe']/100).toFixed(2)}`;
        this.totalImporte += this.jsonTransmision[i]['importe'];
        itemDetalle['nombre_archivo'] = this.jsonTransmision[i]['nombre_archivo'];
        itemDetalle['medio_pago'] = this.jsonTransmision[i]['medio_pago'] != null ? this.jsonTransmision[i]['medio_pago']['marca']:null;
        itemDetalle['forma_pago'] = this.jsonTransmision[i]['medio_pago']!= null ? this.jsonTransmision[i]['medio_pago']['forma_pago']['tipo'] : null;
        this.btnActive = true;

      }catch (error) {
        this._functionsService.imprimirMensaje(error, "Error algun itemDetalle Try linea 121 aprox.: ");
        this.btnActive = false;
        break;
      }

      arrayDetallesTransmision.push(itemDetalle);
    }

    //Pestañas (displayedColumnsDetalles) estan 'hardcodeadas' mientras no envíen la estructura desde el backend. Deben enviar: Los nombres a mostrar y los datos modelados correctamente y correspondiente a cada agencia.
    switch(this.agencia){
      case 'pagofacil':
        this.displayedColumnsSearchDetalles = ["terminal_id", "importe", "fecha_creacion", "fecha_importe", "hora_importe", "codigo_barra", "nombre_archivo", "medio_pago", "forma_pago"];
        this.displayedColumnsDetalles = ["Id terminal", "Importe", "Fecha de creación", "Fecha de importe", "Hora de importe", "Código de barras", "Nombre del archivo", "Medio de pago", "Forma de pago"];
        break;
      case 'rapipago':
        this.displayedColumnsSearchDetalles = ["importe", "fecha_importe", "codigo_barra", "nombre_archivo", "medio_pago", "forma_pago"];
        this.displayedColumnsDetalles = ["Importe", "Fecha de importe", "Código de barras", "Nombre del archivo", "Medio de pago", "Forma de pago"];
        break;
      case 'provincianet':
        this.displayedColumnsSearchDetalles = ["terminal_id", "importe", "fecha_importe", "codigo_barra", "nombre_archivo", "medio_pago", "forma_pago"];
        this.displayedColumnsDetalles = ["Id terminal", "Importe", "Fecha de importe", "Código de barras", "Nombre del archivo", "Medio de pago", "Forma de pago"];
        break;
      case 'ripsa':
        this.displayedColumnsSearchDetalles = ["terminal_id", "importe", "fecha_creacion", "fecha_importe", "hora_importe", "codigo_barra", "nombre_archivo", "medio_pago", "forma_pago"];
        this.displayedColumnsDetalles = ["Id terminal", "Importe", "Fecha de creación", "Fecha de importe", "Hora de importe", "Código de barras", "Nombre del archivo", "Medio de pago", "Forma de pago"];
        break;
      case 'multipago':
        this.displayedColumnsSearchDetalles = ["importe", "fecha_importe", "codigo_barra", "nombre_archivo", "medio_pago", "forma_pago"];
        this.displayedColumnsDetalles = ["Importe", "Fecha de importe", "Código de barras", "Nombre del archivo", "Medio de pago", "Forma de pago"];
        break;
      case 'bicaagil':
        this.displayedColumnsSearchDetalles = ["terminal_id", "importe", "fecha_importe", "codigo_barra", "nombre_archivo", "medio_pago", "forma_pago"];
        this.displayedColumnsDetalles = ["Id terminal", "Importe", "Fecha de importe", "Código de barras", "Nombre del archivo", "Medio de pago", "Forma de pago"];
        break;  
      default:
        this.displayedColumnsSearchDetalles = ["importe", "fecha_importe", "codigo_barra", "nombre_archivo", "medio_pago", "forma_pago"];
        this.displayedColumnsDetalles = ["Importe", "Fecha de importe", "Código de barras", "Nombre del archivo", "Medio de pago", "Forma de pago"];
    }


    this.mensajeResultadoDetalles = `Se encontraron ${arrayDetallesTransmision.length} registros`;
    this.dataSourceDetalles = arrayDetallesTransmision;
  }


  //confirma el envio del archivo de transmisión.
  confirmar(){
    this._apiService.enviarArchivo(this.archivoTransimision)
    .then(res => {
        console.log("jsonTransmision confirmado enviado: ", res);
        this._apiService.guardarArchivo(res).subscribe(
          response =>{
            this.okSwal.fire()
              .finally(()=>{
                this.limpiarComponente();
              });
          },
          error =>{
            this.failSwal.fire();
            console.log("fail: ",error);
          }
        )
      })
      .catch(error => {
        if(error.status == 403){
          this.sesionSwal.fire().finally(()=> {
            this._tokenService.logOut();
          });
        }else{
          this.failSwal.fire().finally(()=> {
            this.location.back();
          });
        }
      })
    
  }


  limpiarComponente(){
    this.myForm.reset();
    this.displayedColumnsDetalles = null
    this.displayedColumnsSearchDetalles = null;
    this.archivoTransimision = null;
    this.progressbarActive = false;
  }

  formatearFecha(dato: string): string{
    var fechaFormateada;
    dato = dato.slice(0,10)
    var fecha = dato.split('-');

    fechaFormateada = `${fecha[2]}-`
    fechaFormateada += `${fecha[1]}-`
    fechaFormateada += fecha[0]
    
    return fechaFormateada;
  }
}



export interface DetalleTransmision{
  id: string;
  terminal_id: string;
  codigo_transaccion: string;
  importe: string;
  fecha_creacion: string;
  fecha_importe: string;
  hora_importe: string;
  codigo_barra: string; 
  nombre_archivo: string;
  medio_pago: string;
  forma_pago: string;
}