import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SystemValues } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements CanActivate {
  sys = new SystemValues();
  constructor(private router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    ;
    if (this.sys.IsUsrLoggedIn) { return true; }

    const bankName = localStorage.getItem('__bName');
    this.router.navigate([bankName + '/login']);
    return false;
  }
}
