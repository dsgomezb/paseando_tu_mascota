import { Component, OnInit } from '@angular/core';
import { i18nMessages } from '../../TranslateLoader';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { RequestService } from 'src/app/services/http/request.service';
import { Platform, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SERVICES } from "../../constants/services";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.page.html',
  styleUrls: ['./register-client.page.scss'],
})
export class RegisterClientPage implements OnInit {
  registerClient: FormGroup;
  new_client = {
    names: '',
    lastnames: '',
    document: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirm_password: '',
    term_condition: false
  }
  constructor(
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
    public router: Router,
    private menu: MenuController,
    public formBuilder: FormBuilder
  ) { 
    this.setting_form();
  }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.menu.enable(false, 'menu');
    this.menu.close(SERVICES.menuId);
  }

    //Almacena un nuevo cliente
    save_new_client(){
      console.log(this.registerClient);
      if(this.new_client.names == '' || this.new_client.lastnames == '' || this.new_client.document == '' || this.new_client.email == '' || this.new_client.phone == '' || this.new_client.username == '' || this.new_client.password == '' || this.new_client.confirm_password == ''){
        this.toast.presentToast(i18nMessages.General["errors"]["data_marked_required"], "error-toast", 3000); //Ejemplo de como usar el translate desde typescript (se centraliza todo en el es.json)
      }else if(!this.new_client.term_condition){
        this.toast.presentToast(i18nMessages.General["errors"]["terms_conditions_required"], "error-toast", 3000);
      }else{
        this.request.postData('client/api/client_register', this.new_client, {}).then(data => {
          if(data.code == 1){
            this.toast.presentToast(data.error, "error-toast", 3000);
          }else if(data.code == 0){
            this.toast.presentToast(data.message, "info-toast", 3000);
            this.navCtrl.navigateForward('/login');
          }
        });
      }
    }

    setting_form(){
      this.registerClient = this.formBuilder.group({
        names: [],
        lastnames: [],
        document: [],
        email: ['',[Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}[^\\S]*$'),Validators.maxLength(100),Validators.minLength(5), Validators.required]],
        phone: [],
        username: [],
        password: [],
        confirm_password: [],
        term_condition: [],
      });
    }

    validate_form(){
      if(!this.registerClient.invalid){
        console.log("entra aqui");
        console.log(this.registerClient);
        this.save_new_client();
      }else{
        if(this.registerClient.get("email").invalid){
          this.toast.presentToast("cacorros", "error-toast", 3000); //Ejemplo de como usar el translate desde typescript (se centraliza todo en el es.json)
        }
      }
    }

    presentToast(message) { 		
      //Mostramos el toast a través del controlador de servicios de salidas. 		
      this.toast.presentToast(message, "error-toast",3000);
    }

}
