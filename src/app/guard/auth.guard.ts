import { UserService } from './../services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private router: Router,
  ) {}
  canActivate(){
    if(localStorage.getItem('user')){
      return this.userService.getUserById(localStorage.getItem('user')!).pipe(
        take(1),
        switchMap(async (user)=>{
          if(user.rol==='ZFwDIYvZia8PKqIRS9Ng'||'kKjkKRN2Kzz01dDxLevq'||'KcyTEOBshsvabhvqmcpz'){
            return true
          }else{
            this.router.navigate(['login'])
            return false
          }
        })
      )
    }else{
      this.router.navigate(['login'])
      return false
    }

  }

}
