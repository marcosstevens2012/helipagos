import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Role } from 'src/app/models/role.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  direction = "";
  url = "";

  constructor(
    private router: Router, 
    private authService: AuthService,
    private activateRoute: ActivatedRoute
    ) { }

  get isAuthorized() {
    return this.authService.isAuthorized();
  }

  get isAdmin() {
    return this.authService.hasRole(Role.ROLE_ADMIN);
  }

  cambioUrl(url: string){
    localStorage.setItem('itemsPerPage', '10') //Volvemos items por pag. a 10 cada vez que se cambia de url
    this.url = url;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }



 
}
