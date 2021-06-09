import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteInterface } from 'src/app/models/interfaces/cliente.interface';


@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css']
})
export class ModalClienteComponent implements OnInit {

  
  @Input() btnAcept: string = "Aceptar"
  @Input() cliente;
  @Output() clienteEditado: EventEmitter<ClienteInterface>;
  @Output() clienteCreado: EventEmitter<ClienteInterface>;
  @Output() mostrarLista: EventEmitter<Boolean>;

  loginForm: FormGroup;
  placeholder;
  roles;
  
  constructor(  
    private formBuilder:FormBuilder
     ) {
      this.clienteEditado = new EventEmitter();
      this.mostrarLista = new EventEmitter();
      this.loginForm = this.formBuilder.group({
        documento: ['', Validators.required],
        username: ['', Validators.required],
        domicilio: ['', Validators.required],
        razon_social: ['', Validators.required],
        localidad: ['', Validators.required],
        web: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        estado: ['', Validators.required],
      });    
     }

  ngOnInit(): void {

  }

  ngOnChanges() {
      this.loginForm = this.formBuilder.group({
        documento: ['', Validators.required],
        username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
        domicilio: ['', Validators.required],
        razon_social: ['', Validators.required],
        nombre_legal: ['', Validators.required],
        localidad: ['', Validators.required],
        web: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(60)]],
        estado: ['', Validators.required],
      });
      this.placeholder = {};
      this.placeholder["documento"] = this.cliente != null? this.cliente.documento : "Ingrese el documento";
      this.placeholder["username"] = this.cliente != null? this.cliente.username : "Ingrese el usuario";
      this.placeholder["domicilio"] = this.cliente != null? this.cliente.domicilio : "Ingrese el domicilio";
      this.placeholder["razon_social"] = this.cliente != null? this.cliente.razon_social : "Ingrese la razón social";
      this.placeholder["nombre_legal"] = this.cliente != null? this.cliente.nombre_legal : "Ingrese el nombre legal";
      this.placeholder["localidad"] = this.cliente != null? this.cliente.localidad : "Ingrese la localidad";
      this.placeholder["email"] = this.cliente != null? this.cliente.email : "Ingrese el email";
      this.placeholder["web"] = this.cliente != null? this.cliente.web : "Ingrese la web";
      this.placeholder["password"] = this.cliente != null? this.cliente.password : "Ingrese la contraseña";
      this.placeholder["estado"] = this.cliente != null? this.cliente.estado : "Seleccione el estado";
  }

  onSubmit() {
    
    this.cliente = null;
    var clienteEnvio;
    clienteEnvio = this.loginForm.value;
    var estado;

    if(clienteEnvio['estado'] != "" && clienteEnvio['estado'] != null){
      estado = clienteEnvio['estado'] == "Deshabilitado"? false : true;
    }


    var clienteModificado: ClienteInterface = {
      username : clienteEnvio['username'],
      razon_social : clienteEnvio['razon_social'],
      nombre_legal : clienteEnvio['nombre_legal'],
      domicilio : clienteEnvio['domicilio'],
      documento : clienteEnvio['documento'],
      localidad : clienteEnvio['localidad'],
      web: clienteEnvio['web'],
      email : clienteEnvio['email'],
      password : clienteEnvio['password'],
      enabled : estado,
    }

    this.clienteEditado.emit(clienteModificado)
    this.loginForm.reset();

  }

  atras(){
    this.mostrarLista.emit(true);
  }

}
