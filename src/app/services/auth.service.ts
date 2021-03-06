
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
    private router: Router
    ) {}

  signUp(name: string, email: string, password: string): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(switchMap(({ user }) => updateProfile(user, { displayName: name }).then(()=>{
      var newUser: User = {}
          newUser.mail=email
          newUser.name=name
          newUser.rol='KcyTEOBshsvabhvqmcpz'
          newUser.uid=user.uid
          this.userService.postUser(newUser)
    })));
  }

  login(email: string, password: string):Observable<any> {
    this.userService.getUserById(email).subscribe(
      user=>{
        localStorage.setItem('user',user.id)
        localStorage.setItem('rol',user.rol!)
        if (user.rol==='KcyTEOBshsvabhvqmcpz') {
          console.log('Administrador')
          this.router.navigate(['museos'])
        } else if (user.rol==='ZFwDIYvZia8PKqIRS9Ng') {
          console.log('Gestor porque el yisus quiere Gestor XD')
          this.router.navigate([`museos/${user.museo!}`])
        }else if (user.rol==='kKjkKRN2Kzz01dDxLevq') {
          console.log('Visualizador')
          this.router.navigate(['museos'])
        }
      }
    )
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(){
    return from(this.auth.signOut())
  }

}
