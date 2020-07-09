import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { RequestService } from 'src/app/services/http/request.service';
import { Platform, NavController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SERVICES } from "../../constants/services";
@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.page.html',
  styleUrls: ['./register-client.page.scss'],
})
export class RegisterClientPage implements OnInit {

  constructor(
    public request: RequestService,
    private toast: ToastService,
    private navCtrl: NavController,
    public router: Router,
    private menu: MenuController,
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.menu.enable(false, 'menu');
    this.menu.close(SERVICES.menuId);
  }

}
