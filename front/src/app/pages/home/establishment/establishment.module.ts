import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstablishmentPageRoutingModule } from './establishment-routing.module';

import { EstablishmentPage } from './establishment.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstablishmentPageRoutingModule,
    TranslateModule
  ],
  declarations: [EstablishmentPage]
})
export class EstablishmentPageModule {}
