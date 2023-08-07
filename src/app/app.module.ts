import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';

@NgModule({
  declarations: [AppComponent],
  imports: [AngularFireStorageModule,AngularFireModule.initializeApp(environment.firebase),HttpClientModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, IonicStorageModule.forRoot(), HttpClientModule, provideFirebaseApp(() => initializeApp(environment.firebase)), provideAuth(() => getAuth())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent],
})
export class AppModule { }
