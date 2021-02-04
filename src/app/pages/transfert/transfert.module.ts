import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransfertPageRoutingModule } from './transfert-routing.module';

import { TransfertPage } from './transfert.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TransfertPageRoutingModule
  ],
  declarations: [TransfertPage]
})
export class TranfertPageModule {}
