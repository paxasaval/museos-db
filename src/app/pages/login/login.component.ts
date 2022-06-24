import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  observers: Subscription[]=[]

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService
    ) {
  }

  ngOnInit(): void {}
  get email(){
    return this.loginForm.get('email')
  }


  get password(){
    return this.loginForm.get('email')
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    var obs = this.authService.login(email, password).pipe(
      this.toast.observe({
        success: 'Ha iniciado sesión con exito',
        loading: 'Iniciando sesion...',
        error: `Ha ocurrido un error`
      })
    ).subscribe(() => {
    });
    this.observers.push(obs)

  }
  ngOnDestroy(): void {
    this.observers.forEach(x=>{
      x.unsubscribe()
    })
  }
}
