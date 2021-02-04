import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangepasswordPageRoutingModule } from './changepassword-routing.module';

import { ChangepasswordPage } from './changepassword.page';
import { ComponentsModule } from './../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
	ComponentsModule,
    IonicModule,
    ChangepasswordPageRoutingModule
  ],
  declarations: [ChangepasswordPage]
})
export class ChangepasswordPageModule {}
