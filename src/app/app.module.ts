import { MaterialModule } from './material/material.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { LoginComponent } from './pages/login/login.component';
import { MuseumComponent } from './pages/museum/museum.component';
import { PersonalComponent } from './pages/personal/personal.component';
import { InfoPointComponent } from './pages/info-point/info-point.component';
import { ConfigComponent } from './pages/config/config.component';
import { MusemDetailComponent } from './pages/musem-detail/musem-detail.component';
import { InfoPointDetailComponent } from './pages/info-point-detail/info-point-detail.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { HotToastModule } from '@ngneat/hot-toast';
import { LayerComponent } from './pages/layer/layer.component';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { DialogMuseumComponent } from './pages/museum/dialog-museum/dialog-museum.component';
import { DialogStaffComponent } from './pages/personal/dialog-staff/dialog-staff.component';
import { MuseumCardComponent } from './pages/museum/museum-card/museum-card.component';
import { DialogRVisitComponent } from './pages/musem-detail/dialog-r-visit/dialog-r-visit.component';
import { InfoPointCardComponent } from './pages/info-point/info-point-card/info-point-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    MuseumComponent,
    DialogMuseumComponent,
    PersonalComponent,
    InfoPointComponent,
    ConfigComponent,
    MusemDetailComponent,
    InfoPointDetailComponent,
    LayerComponent,
    DialogStaffComponent,
    MuseumCardComponent,
    DialogRVisitComponent,
    InfoPointCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    HotToastModule.forRoot(),
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
