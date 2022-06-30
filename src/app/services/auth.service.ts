import { RolesService } from './roles.service';
import { RolService } from './rol.service';

import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { from, Observable, switchMap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth,
    private userService: UserService,
    private authorize: AngularFireAuth,
    private rolService: RolesService,
    private router: Router
    ) {}

  signUp(name: string, email: string, password: string, rol:string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(switchMap(({ user }) => updateProfile(user, { displayName: name }).then(()=>{
      var newUser: User = {}
          newUser.mail=email
          newUser.name=name
          newUser.rol=rol
          newUser.uid=user.uid
          this.userService.postUser(newUser)
    })));
  }

  login(email: string, password: string):Observable<any> {
    this.userService.getUserById(email).subscribe(
      user=>{
        localStorage.setItem('user',user.id)
        localStorage.setItem('rol',user.rol!)
        this.rolService.getRolById(user.rol!).subscribe(
          result=>{
            if (result.name==='admin') {
              this.router.navigate(['museos'])
            } else if (result.name==='gestor') {
              //console.log('Gestor porque el yisus quiere Gestor XD')
              console.log(user.museo)
              this.router.navigate([`museos/${user.museo!}`])
            }else if (result.name==='visualizador') {
              this.router.navigate(['museos'])
            }
          }
        )

      }
    )
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(){
    localStorage.clear()
    return from(this.auth.signOut())
  }

}
