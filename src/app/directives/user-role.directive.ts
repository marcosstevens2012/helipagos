import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Role } from '../models/role.models';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appUserRole]'
})

@Directive({ selector: '[appUserRole]'})
export class UserRoleDirective implements OnInit {
  constructor(
      private templateRef: TemplateRef<any>,
      private authService: AuthService,
      private viewContainer: ViewContainerRef
  ) { }

  userRoles: Role[];

  @Input() 
  set appUserRole(roles: Role[]) {
      if (!roles || !roles.length) {
          throw new Error('El rol está vacío o no existe');
      }

      this.userRoles = roles;
  }

  ngOnInit() {
      let hasAccess = false;

      if (this.authService.isAuthorized() && this.userRoles) {
          hasAccess = this.userRoles.some(r => this.authService.hasRole(r));
      }

      if (hasAccess) {
          this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
          this.viewContainer.clear();
      }
  }

}
