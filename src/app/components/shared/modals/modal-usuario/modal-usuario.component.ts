import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/models/interfaces/user.interface';
import { Roles } from 'src/app/models/roles.models';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {

  @Input() btnAcept: string = "Aceptar"
  @Input() usuario;
  @Input() showSpinner: boolean = false;
  @Output() usuarioEditado: EventEmitter<UserInterface>;
  @Output() usuarioCreado: EventEmitter<UserInterface>;
  @Output() mostrarLista: EventEmitter<Boolean>;

  loginForm: FormGroup;
  placeholder;
  roles;
  
  
  constructor(  
    private formBuilder:FormBuilder
     ) {
      this.usuarioEditado = new EventEmitter();
      this.mostrarLista = new EventEmitter();
      this.loginForm = this.formBuilder.group({
        nombre: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', Validators.required],
        estado: ['', Validators.required],
        password: ['', Validators.required],
        rol: ['', Validators.required],
      });    
     }

  ngOnInit(): void {

  }

  ngOnChanges() {
      this.loginForm = this.formBuilder.group({
        nombre:['', [Validators.required]],
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
        email: ['', [Validators.required, Validators.email]],
        estado: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(60)]],
        rol: ['', Validators.required],
      });
      this.placeholder = {};
      this.placeholder["nombre"] = this.usuario != null? this.usuario.nombre : "Nombre";
      this.placeholder["username"] = this.usuario != null? this.usuario.username : "Username";
      this.placeholder["email"] = this.usuario != null? this.usuario.email : "Email";
      this.placeholder["estado"] = this.usuario != null? this.usuario.enabled : "Seleccionar";
  }

  onSubmit() {
    
    this.usuario = null;
    var userEnvio;
    userEnvio = this.loginForm.value;
    var rol: Roles;
    var rolList: Roles[] = [];
    var estado;

    if(userEnvio['estado'] != "" && userEnvio['estado'] != null){
      estado = userEnvio['estado'] == "Deshabilitado"? false : true;
    }

    if(userEnvio['rol'] != "" && userEnvio['rol'] != null){
      rol = {
        id: userEnvio['rol'] == "ADMIN"? 2 : 4,
        nombre: `ROLE_${userEnvio['rol']}`
      }
      rolList.push(rol);
    }  

    var userModificado: UserInterface = {
      username : userEnvio['username'],
      nombre : userEnvio['nombre'],
      email : userEnvio['email'],
      password : userEnvio['password'],
      enabled : estado,
      roles : rolList
    }

    this.usuarioEditado.emit(userModificado)
    this.loginForm.reset();

  }

  atras(){
    this.mostrarLista.emit(true);
  }


}
