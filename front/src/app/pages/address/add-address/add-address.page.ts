import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { i18nMessages } from '../../../TranslateLoader';
import { RequestService } from '../../../services/http/request.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastService  } from '../../../services/toaster/toast.service';
import { Platform, NavController } from '@ionic/angular';


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  new_address = {
    address_title: '',
    user_address: '',
    description_user_address: '',
    id_muni: ''
  }
  states = [];
  constructor(
    private platform: Platform,
    private translate: TranslateService,
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
  ) { }


  ngOnInit() {
    this.getStates();
  }

  getStates(){
    this.request.postData('users/api/get_states',{}, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "error-toast", 3000);
      }else if(data.code == 0){
        this.states = data.data;
      }
     });
  }

  save_new_address_user(){

  }
}
