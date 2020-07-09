import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { RequestService } from 'src/app/services/http/request.service';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  id_user;
  userData = {
    user_id: ''
  };
  user_address_id = {
    user_address_id:'',
    id_user: ''
  };
  user_address = [];  
  constructor(
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
    public router: Router
  ) { 
    this.id_user = localStorage.getItem('user_id');
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getAddressUser();
  }

  getAddressUser(){
    this.userData.user_id = this.id_user;
    this.request.postData('users/api/get_address_user',this.userData, {}).then(data => {
      if(data.code == 0){
        this.user_address = data.data;
      }else{
        this.toast.presentToast(data.error, "info-toast", 3000);
      }
    });
  }

  deleteAddress(id_user_address){
    const data_user = {
      id_user_address: id_user_address
    };
    this.request.postData('users/api/delete_address_user', data_user, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "error-toast", 3000);
      }else if(data.code == 0){
        this.toast.presentToast(data.message, "success-toast", 3000);
        this.ionViewWillEnter();
      }
    });
  }

  editAddress(id_user_add){
    this.router.navigate(["add-address", id_user_add]);
  }

  select_address(id_user_add, id_user){
    this.user_address_id.user_address_id = id_user_add;
    this.user_address_id.id_user = id_user;
    this.request.postData('users/api/change_status_address_user',this.user_address_id, {}).then(data => {
      if(data.code == 0){
        this.toast.presentToast(data.message, "success-toast", 3000);
        this.ionViewWillEnter();
      }else{
        this.toast.presentToast(data.error, "info-toast", 3000);
      }
    });
  }
}
