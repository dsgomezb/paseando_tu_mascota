import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { i18nMessages } from '../../../TranslateLoader';
import { RequestService } from '../../../services/http/request.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastService  } from '../../../services/toaster/toast.service';
import { Platform, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';


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
    id_muni: null,
    id_user: null
  }

  data_edit_address = {
    id_user_address: null,
    address_title: '',
    user_address: '',
    description_user_address: '',
    id_muni: {
      id_muni: null,
      nombre_muni: null
    },
  }

  idUserAddressEdit = {
    id_user_address: ''
  };

  id_user_add = null;
  states = [];
  constructor(
    private platform: Platform,
    private translate: TranslateService,
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
    public router: Router,
    public activedRoute: ActivatedRoute,
  ) {
    this.new_address.id_user = localStorage.getItem('user_id');
   }


  ngOnInit() {

  }

  ionViewWillEnter(){
    this.getStates();
    this.id_user_add = this.activedRoute.snapshot.params.id;
    if(this.id_user_add){
      this.getDataUserAddress(this.id_user_add);
    }
  }

  getDataUserAddress(id_user_address){
    this.idUserAddressEdit.id_user_address = id_user_address;
    this.request.postData('users/api/get_address_data_edit', this.idUserAddressEdit, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "error-toast", 3000);
      }else if(data.code == 0){
        this.data_edit_address.id_user_address = data.data.id_user_address;
        this.data_edit_address.address_title = data.data.address_title;
        this.data_edit_address.description_user_address = data.data.description_user_address;
        this.data_edit_address.user_address = data.data.user_address;
        this.data_edit_address.id_muni.id_muni = data.data.id_muni;
        this.data_edit_address.id_muni.nombre_muni = data.data.nombre_muni;
      }
    });
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

  //Almacena una nueva direccion del usuario
  save_new_address_user(){
    if(this.new_address.address_title == '' || this.new_address.user_address == '' || this.new_address.id_muni == ''){
      this.toast.presentToast(i18nMessages.General["errors"]["data_marked_required"], "error-toast", 3000); //Ejemplo de como usar el translate desde typescript (se centraliza todo en el es.json)
    }else{
      this.request.postData('users/api/add_user_address', this.new_address, {}).then(data => {
        if(data.code == 1){
          this.toast.presentToast(data.error, "error-toast", 3000);
        }else if(data.code == 0){
          this.toast.presentToast(data.message, "info-toast", 3000);
          this.navCtrl.navigateForward('/address');
        }
      });
    }
  }

  //actualiza una direccion del usuario
  update_address_user(){
    if(this.data_edit_address.address_title == '' || this.data_edit_address.user_address == '' || this.data_edit_address.id_muni.id_muni == ''){
      this.toast.presentToast(i18nMessages.General["errors"]["data_marked_required"], "error-toast", 3000); //Ejemplo de como usar el translate desde typescript (se centraliza todo en el es.json)
    }else{
      this.request.postData('users/api/update_user_address', this.data_edit_address, {}).then(data => {
        if(data.code == 1){
          this.toast.presentToast(data.error, "error-toast", 3000);
        }else if(data.code == 0){
          this.toast.presentToast(data.message, "info-toast", 3000);
          this.navCtrl.navigateForward('/address');
        }
      });
    }
  }

}
