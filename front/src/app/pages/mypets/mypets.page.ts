import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { RequestService } from 'src/app/services/http/request.service';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mypets',
  templateUrl: './mypets.page.html',
  styleUrls: ['./mypets.page.scss'],
})
export class MypetsPage implements OnInit {
  id_user;
  userData = {
    user_id: ''
  };
  pets_user = [];
  data_pet = [];
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
    this.getPetsUser();
  }

  getPetsUser(){
    this.userData.user_id = this.id_user;
    this.request.postData('pet/api/get_pets_user', this.userData, {}).then(data => {
      if(data.code == 0){
        this.pets_user = data.data;
      }else{
        this.toast.presentToast(data.error, "info-toast", 3000);
      }
    });
  }

  deletePet(id_pet){
    const data_pet = {
      id_pet: id_pet
    };
    this.request.postData('pet/api/delete_pet', data_pet, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "error-toast", 3000);
      }else if(data.code == 0){
        this.toast.presentToast(data.message, "success-toast", 3000);
        this.ionViewWillEnter();
      }
    });
  }

  pet_detail(id_pet){
    const data_pet = {
      id_pet: id_pet
    };
    this.request.postData('pet/api/get_pet', data_pet, {}).then(data => {
      if(data.code == 0){
        this.data_pet = data.data;
        console.log(this.data_pet);
      }else{
        this.toast.presentToast(data.error, "info-toast", 3000);
      }
    });
  }

}
