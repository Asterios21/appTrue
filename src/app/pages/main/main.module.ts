import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { HttpClientModule } from '@angular/common/http';
import { ObjToArrayPipe } from './objToArray.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    MainPageRoutingModule
  ],
  declarations: [MainPage,ObjToArrayPipe]
})
export class MainPageModule {}
