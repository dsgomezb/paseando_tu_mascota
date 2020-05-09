import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from "@ngx-translate/core";
import { i18nMessages } from '../../TranslateLoader';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
  ) { 
    //this.initializeApp();
  }

  /*initializeApp() {
    this.platform.ready().then(() => {
      this.translate.setDefaultLang("es");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }*/

  ngOnInit() {
console.log("en profile");
  }
}
