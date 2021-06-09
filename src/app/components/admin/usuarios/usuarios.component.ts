import { Component, OnInit, ViewChild } from '@angular/core';
import { UserInterface } from 'src/app/models/interfaces/user.interface';
import { ApiService } from 'src/app/services/api.service';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { TokenService } from 'src/app/services/token.service';
import { FunctionsService } from 'src/app/services/functions.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  //Tabla Usuarios
  displayedColumns = ['Nombre', 'Username', 'Email', 'Roles', 'Estado'];
  displayedColumnsSearch = ['nombre', 'username', 'email', 'roles', 'enabled'];
  dataSource:UserInterface[];

  //Texto Delete Model
  DeleteTitle:string = "Eliminar";
  DeleteText:string = "¿Desea eliminar el usuario?";

  //Filtro
  filtroText:string;
  searching:boolean;
  
  //Editar usuario
  userEdit;
  mensajeResultado;

  loading: boolean;
  editar: boolean;
  crear: boolean;
  
  constructor( 
    private _apiService: ApiService,
    private _tokenService: TokenService,
    private _functionService: FunctionsService) { }

  ngOnInit(): void {
    this.loading = true;
    this._apiService.getUsers().subscribe((response : UserInterface[]) => {
      
      var json = {};
      var jsonList=[];

      response.forEach((user: UserInterface)=>{
        json['id'] = user.id;
        json['email'] = user.email;
        json['enabled'] = user.enabled==true? 'Habilitado': 'Deshabilitado';
        json['nombre'] = user.nombre;
        json['password'] = user.password;
        json['roles'] = user.roles[0]!=null? user.roles[0].nombre.slice(5): 'no disponible';
        json['username'] = user.username;
        jsonList.push(json);
        json = {};
      });


      this.mensajeResultado = "Se encontraron "+response.length+" resultados.";

      this.dataSource = jsonList;
      this._functionService.imprimirMensaje(this.dataSource, "-- Mi datasource ");
      this.loading = false;
    },

    
    (error)=>{
      this._functionService.imprimirMensaje(error, "-- Error en usuarios ");
      if(error.status == 403){
        this._functionService.configSwal(this.mensajeSwal, "Sesión expirada", "info", "Login", "", false, "#53BAAB", "")
        this.mensajeSwal.fire().finally(()=> {
          this._tokenService.logOut();
        });
      }else{
        this._functionService.configSwal(this.mensajeSwal, "Error de conexión", "warning", "Reintentar", "Cancelar", true, "#53BAAB", "");
        this.mensajeSwal.fire().then((resolve)=>{
          if(resolve.isConfirmed){
            this.ngOnInit();
          }
        })
        .finally(()=> {
          this.loading = false;
        });        
      } 
    });
 
  }

  
  modalEditUsuario(idx:number){
    this.editar = true;
    this.obtenerUsuarioDeListado(idx);
  }

  nuevoUsuario(){
    this.crear = true;
  }

  
  modalDeleteUsuario(idx:number){
    document.getElementById("btn-delete-user").click();
    this.obtenerUsuarioDeListado(idx);
  }


  obtenerUsuarioDeListado(idx:number){
    const listUsers = of(...this.dataSource);
    const filtroUser = filter((user: UserInterface) => user.id == idx);
    const filtrado = filtroUser(listUsers);
    filtrado.subscribe((item) =>{
      this.userEdit = item;
    });
  }

  
  filtrar(termino:string){
      if (termino.length >= 3) {
        this.searching = true;
      } else {
        this.searching = false;
      }
 
    this.filtroText = termino;
  }


  crearUsuario(user: UserInterface){

    this._apiService.createUser(user)
      .then(() =>{
        this._functionService.configSwal(this.mensajeSwal, `El usuario ${user.username} fue creado correctamente.`, "success", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire().finally(()=> {
          this.ngOnInit();
          this.mostrarLista();
        });
      })
      .catch(()=>{
        this._functionService.configSwal(this.mensajeSwal, `Error al intentar crear el usuario ${user.username}`, "error", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire();
      });
    
  }

  modificarUsuario(user){

    this._apiService.editUser(this.userEdit.id, user)
    .then(() =>{
      this._functionService.configSwal(this.mensajeSwal, `El usuario ${user.username || user.nombre} fue modificado correctamente.`, "success", "Aceptar", "", false, "", "");
      this.mensajeSwal.fire().finally(()=> {
        this.ngOnInit();
        this.mostrarLista();
      });
    })
    .catch(()=>{
      this._functionService.configSwal(this.mensajeSwal, `El usuario ${user.username} no pudo ser modificado`, "error", "Aceptar", "", false, "", "");
      this.mensajeSwal.fire();
      this.mostrarLista();
    });

  }

  deshabilitarUsuario(){
    this._apiService.disableUser(this.userEdit.id)
    .then(() =>{
      this._functionService.configSwal(this.mensajeSwal, `El usuario ${this.userEdit.username} fue dado de baja correctamente.`, "success", "Aceptar", "", false, "", "");
      this.mensajeSwal.fire().finally(()=> {
        this.ngOnInit();
      });
    })
    .catch(()=>{
      this._functionService.configSwal(this.mensajeSwal, `El usuario ${this.userEdit.username} no se pudo deshabilitar.`, "error", "Aceptar", "", false, "", "");
    });

  }

  mostrarLista(){
    this.editar = false;
    this.crear = false;
  }
}
