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

const routes: Routes = [
  {
    path:'login',
    component: LoginComponent,
  },
  {
    path:'museos',
    component: MuseumComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'museos/:id',
    component: MusemDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'personal',
    component: PersonalComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'puntos-de-informacion',
    component: InfoPointComponent,
    canActivate: [AuthGuard]

  },
  {
    path:'puntos-de-informacion/:id',
    component:InfoPointDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'configuracion',
    component: ConfigComponent,
    canActivate: [AuthGuard]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
