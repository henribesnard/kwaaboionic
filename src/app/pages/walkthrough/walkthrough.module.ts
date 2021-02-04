import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalkthroughPageRoutingModule } from './walkthrough-routing.module';

import { WalkthroughPage } from './walkthrough.page';
import { OwlModule } from "ngx-owl-carousel";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
	OwlModule,
    WalkthroughPageRoutingModule
  ],
  declarations: [WalkthroughPage]
})
export class WalkthroughPageModule {}
