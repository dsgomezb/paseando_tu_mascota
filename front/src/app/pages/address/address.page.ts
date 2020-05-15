import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { RequestService } from 'src/app/services/http/request.service';

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
  user_address = [];  
  constructor(
    public request: RequestService,
    private toast: ToastService,
  ) { 
    this.id_user = localStorage.getItem('user_id');
  }

  ngOnInit() {
    this.getAddressUser();
  }

  getAddressUser(){
    this.userData.user_id = this.id_user;
    this.request.postData('users/api/get_address_user',this.userData, {}).then(data => {
      if(data.code == 1){
        this.toast.presentToast(data.error, "info-toast", 3000);
      }else if(data.code == 0){
        this.user_address = data.data;
        console.log(this.user_address);
        //this.router.navigate(['/profile']);
      }
     });
  }
}
