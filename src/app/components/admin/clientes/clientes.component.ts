import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { TokenService } from 'src/app/services/token.service';
import { ClienteInterface } from 'src/app/models/interfaces/cliente.interface';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent


  //Tabla clientes
  displayedColumns = ['Username', 'Razón social', 'Nombre Legal', 'Domicilio', 'DNI', 'Email', 'Habilitad', 'Localidad'];
  displayedColumnsSearch = ['username', 'razon_social', 'nombre_legal', 'domicilio', 'documento','email', 'enabled', 'localidad'];
  dataSource:ClienteInterface[];

  //Texto Delete Model
  DeleteTitle:string = "Eliminar";
  DeleteText:string = "¿Desea eliminar el cliente?";

  //Filtro
  filtroText:string;
  searching:boolean;
  
  //Editar cliente
  clienteEdit: ClienteInterface;
  mensajeResultado;

  loading: boolean;
  editar: boolean;
  crear: boolean;
  
  constructor( private _apiService: ApiService,
    private _tokenService: TokenService,
    private _functionService: FunctionsService) { }

  ngOnInit(): void {


    this.loading = true;
    this._apiService.getClientes()
      .then((response) => {
        var json = {};
        var jsonList=[];
        var clientes: any = response;
        
        for (let clave of clientes){
          json['id'] = clave.id;
          json['email'] = clave.email;
          json['enabled'] = clave.enabled==true? 'Habilitado': 'Deshabilitado';
          json['username'] = clave.username;
          json['password'] = clave.password;
          // json['roles'] = clave.roles[0]!=null? clave.roles[0].nombre.slice(5): 'no disponible';
          json['razon_social'] = clave.razon_social;
          json['nombre_legal'] = clave.nombre_legal;
          json['domicilio'] = clave.domicilio;
          json['documento'] = clave.documento;
          json['localidad'] = clave.localidad;
          jsonList.push(json);
          json = {};
        }

        this.mensajeResultado = `Se encontraron ${jsonList.length} resultados.`;

        this.dataSource = jsonList;
        this.loading = false;
      })
      .catch(
        (error)=>{
          this._functionService.imprimirMensaje(error, "-- Error en clientes");
          if(error.status == 403){
            this._functionService.configSwal(this.mensajeSwal, "Sesión expirada", "info", "Login", "", false, "#53BAAB", "")
            this.mensajeSwal.fire().finally(()=> {
              this._tokenService.logOut();
            });
          }else{
            this.loading = false;
            this._functionService.configSwal(this.mensajeSwal, "Error de conexión", "warning", "Reintentar", "Cancelar", true, "#53BAAB", "#c1c1c1");
            this.mensajeSwal.fire().then((resolve)=>{
              if(resolve.isConfirmed){
                this.ngOnInit();
              }else{

              }
            })      
          } 
      }) 
  }

  
  modalButtonToken(idx: number){
    this._functionService.configSwal(this.mensajeSwal, `Desea generar el token nuevamente?`, "info", "Aceptar", "Cancelar", true, "", "");
    this.mensajeSwal.fire().then((resolve)=> {
      if(resolve.isConfirmed){
        this.generarToken(idx);
      }
    })
    .finally(()=> {
      this.ngOnInit();
    });
    this.obtenerClienteDeListado(idx);
  }


  generarToken(idx: number){
    this.obtenerClienteDeListado(idx);
    this._apiService.generarToken(this.clienteEdit)
    .then((resolve)=>{
      this._functionService.imprimirMensaje(resolve, "-- Response al generar el token: ");
      this._functionService.configSwal(this.mensajeSwal, `Nuevo token generado y enviado al cliente.`, "success", "Aceptar", "Cancelar", false, "", "");
      this.mensajeSwal.fire()
    })
    .catch((error)=>{
      this._functionService.imprimirMensaje(error, "-- Error al generar el token: ");
      this._functionService.configSwal(this.mensajeSwal, `El token no pudo ser generado`, "error", "Aceptar", "Cancelar", false, "", "");
      this.mensajeSwal.fire()
    });

    
  }

  modalEditCliente(idx: number){
    this.editar = true;
    this.obtenerClienteDeListado(idx);
  }

  nuevoCliente(){
    this.crear = true;
  }

  
  modalDeleteCliente(idx: number){
    document.getElementById("btn-delete-cliente").click();
    this.obtenerClienteDeListado(idx);
  }


  obtenerClienteDeListado(idx: number){
    const listClientes = of(...this.dataSource);
    const filtroCliente = filter((cliente: ClienteInterface) => cliente.id == idx);
    const filtrado = filtroCliente(listClientes);
    filtrado.subscribe((item) =>{
      this.clienteEdit = item;
      this._functionService.imprimirMensaje(this.clienteEdit, "-- Cliente del listado sin modificar: ");
      this.clienteEdit.enabled = item.enabled.toString() == "Habilitado"? true: false;
      this._functionService.imprimirMensaje(this.clienteEdit, "-- Cliente del listado MODIFICADO: ");
    });
  }

  
  filtrar(termino: string){
      if (termino.length >= 3) {
        this.searching = true;
      } else {
        this.searching = false;
      }
    this.filtroText = termino;
  }


  crearCliente(cliente: ClienteInterface){

    this._apiService.createCliente(cliente)
      .then((response) =>{
        this._functionService.imprimirMensaje(response, "-- response al crear cliente: ");
        this._functionService.configSwal(this.mensajeSwal, `El cliente ${cliente.username} fue creado correctamente.`, "success", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire().finally(()=> {
          this.ngOnInit();
        });
      })
      .catch((error)=>{
        this._functionService.imprimirMensaje(error, "-- Error al crear el cliente: ");
        this._functionService.configSwal(this.mensajeSwal, `Error al intentar crear el cliente ${cliente.username}`, "error", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire();
      });
    
  }

  modificarCliente(cliente){

    this._apiService.editCliente(this.clienteEdit.id, cliente)
    .then(() =>{
      this._functionService.configSwal(this.mensajeSwal, `El cliente ${cliente.username || cliente.nombre} fue modificado correctamente.`, "success", "Aceptar", "", false, "", "");
      this.mensajeSwal.fire().finally(()=> {
        this.ngOnInit();
      });
    })
    .catch(()=>{
      this._functionService.configSwal(this.mensajeSwal, `El cliente ${cliente.username} no pudo ser modificado`, "error", "Aceptar", "", false, "", "");
      this.mensajeSwal.fire();
    });

  }

  deshabilitarCliente(){
    this._apiService.disableCliente(this.clienteEdit.id)
    .then(() =>{
      this._functionService.configSwal(this.mensajeSwal, `El cliente ${this.clienteEdit.username} fue dado de baja correctamente.`, "success", "Aceptar", "", false, "", "");
      this.mensajeSwal.fire().finally(()=> {
        this.ngOnInit();
      });
    })
    .catch(()=>{
      this._functionService.configSwal(this.mensajeSwal, `El cliente ${this.clienteEdit.username} no se pudo deshabilitar.`, "error", "Aceptar", "", false, "", "");
    });

  }

  mostrarLista(){
    this.editar = false;
    this.crear = false;
  }
}

