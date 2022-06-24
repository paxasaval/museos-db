import { AuthGuard } from './guard/auth.guard';
import { InfoPointDetailComponent } from './pages/info-point-detail/info-point-detail.component';
import { MusemDetailComponent } from './pages/musem-detail/musem-detail.component';
import { ConfigComponent } from './pages/config/config.component';
import { InfoPointComponent } from './pages/info-point/info-point.component';
import { PersonalComponent } from './pages/personal/personal.component';
import { MuseumComponent } from './pages/museum/museum.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = ()=> redirectUnauthorizedTo(['login']);
const redirectLoggedInToAdmin = () => redirectLoggedInTo(['museos']);


const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToAdmin)
  },
  {
    path:'museos',
    component: MuseumComponent,
    ...canActivate(redirectUnauthorizedToLogin)

  },
  {
    path:'museos/:id',
    component: MusemDetailComponent,
    ...canActivate(redirectUnauthorizedToLogin)

  },
  {
    path:'personal',
    component: PersonalComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    canActivate: [AuthGuard]
  },
  {
    path:'puntos-de-informacion',
    component: InfoPointComponent,
    ...canActivate(redirectUnauthorizedToLogin)


  },
  {
    path:'puntos-de-informacion/:id',
    component:InfoPointDetailComponent,
    ...canActivate(redirectUnauthorizedToLogin)

  },
  {
    path:'configuracion',
    component: ConfigComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'',
    pathMatch:'full',
    redirectTo: 'login'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
