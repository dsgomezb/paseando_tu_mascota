import { Component, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from "@ngx-translate/core";
import { i18nMessages } from '../../TranslateLoader';
import { RequestService } from '../../services/http/request.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastService  } from '../../services/toaster/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
id_user;
userData = {
  user_id: ''
  };
  user_info = {
    document:'',
    email:'',
    names: '',
    phone: '',
    id_user: ''
  };
userInfo = {
  username: '',
  password: ''
  };
  user_form = {
    document:'',
    email:'',
    names: '',
    phone: ''
  };
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
  ) { 
    //this.initializeApp();
    this.id_user = localStorage.getItem('user_id');
  }

  /*initializeApp() {
    this.platform.ready().then(() => {
      this.translate.setDefaultLang("es");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }*/

  ngOnInit() {
    this.get_info_user();
  }

  async get_info_user() {
    this.userData.user_id = this.id_user;
      this.request.postData('users/api/get_info_user',this.userData, {}).then(data => {
        if(data.code == 1){
          this.toast.presentToast(data.error, "error-toast", 3000);
        }else if(data.code == 0){
          this.user_info.document = data.data.document;
          this.user_info.email = data.data.email;
          this.user_info.names = data.data.names;
          this.user_info.phone = data.data.phone;
          this.user_info.id_user = data.data.id_user;
          //this.router.navigate(['/profile']);
        }
       });
    
  }

  async update_user(){
    if(this.user_info.names == '' || this.user_info.document == '' || this.user_info.phone == '' || this.user_info.email == ''){
      this.toast.presentToast(i18nMessages.General["errors"]["data_update_profile_user"], "error-toast", 3000); //Ejemplo de como usar el translate desde typescript (se centraliza todo en el es.json)
    }else{
      this.request.postData('users/api/update_user_api', this.user_info, {}).then(data => {
        if(data.code == 1){
          this.toast.presentToast(data.error, "error-toast", 3000);
        }else if(data.code == 0){
          this.toast.presentToast(data.message, "success-toast", 3000);
          this.navCtrl.navigateForward('/home');
        }
       });
    }
  }

}
