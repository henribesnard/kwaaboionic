import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [FooterComponent, SidebarComponent],
   exports: [ FooterComponent, SidebarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
