import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toaster/toast.service';
import { RequestService } from 'src/app/services/http/request.service';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  id_user;
  userData = {
    user_id: ''
  };
  establishments = [];  
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

}
