import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from 'src/app/services/http/request.service';
import { ToastService } from 'src/app/services/toaster/toast.service';

@Component({
  selector: 'app-establishment',
  templateUrl: './establishment.page.html',
  styleUrls: ['./establishment.page.scss'],
})
export class EstablishmentPage implements OnInit {
  id_establishment = {
    id_establishment: ''
  };
  data_establishment = {
    name_establecimiento: null,
  }
  products = [];
  constructor(
    public activedRoute: ActivatedRoute,
    private platform: Platform,
    private translate: TranslateService,
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    var id_establishment;
    id_establishment = this.activedRoute.snapshot.params.id;
    if(id_establishment){
      this.getInfoEstablishment(id_establishment);
      this.getProductsEstablishment(id_establishment);
    }
  }

  getInfoEstablishment(id_establishment){
    this.id_establishment.id_establishment = id_establishment;
    this.request.postData('establecimientos/api/get_establishment_info', this.id_establishment, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "error-toast", 3000);
      }else if(data.code == 0){
        this.data_establishment.name_establecimiento = data.data[0].name_establecimiento;
      }
    });
  }

  getProductsEstablishment(id_establishment){
    this.id_establishment.id_establishment = id_establishment;
    this.request.postData('establecimientos/api/get_products_establishment', this.id_establishment, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "error-toast", 3000);
      }else if(data.code == 0){
        this.products = data.data;
      }
    });
  }
}
