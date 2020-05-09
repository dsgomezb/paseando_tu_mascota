import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from "@ngx-translate/core";
import { i18nMessages } from './TranslateLoader';
import { SERVICES } from "./constants/services";
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  menuId = SERVICES.menuId;
  public appPages = [
    {
      title: 'Inbox',
      url: '/folder/Inbox',
      icon: 'mail'
    },
    {
      title: 'Outbox',
      url: '/folder/Outbox',
      icon: 'paper-plane'
    },
    {
      title: i18nMessages["home"],
      url: '/home/Outbox',
      icon: 'paper-plane'
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private menu: MenuController,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translate.setDefaultLang("es");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.translate.use('es');
      this.isUserInSession();

      this.translate.get("Components").subscribe(components => {
        i18nMessages.Components = components;
      });

      this.translate.get("General").subscribe(general => {
        i18nMessages.General = general;
      });

      this.translate.get("ResponseServer").subscribe(responseServer => {
        i18nMessages.ResponseServer = responseServer;
      });

      this.translate.get("Menu").subscribe(menu => {
        i18nMessages.Menu = menu;
      });

    });
  }

  isUserInSession() {
    var token_user = localStorage.getItem('token');
    console.log(token_user);
    if(token_user){
      this.openMenu();
    }else{
      this.closeMenu();
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    /*const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }*/
  }

  openMenu() {
    this.menu.enable(true, this.menuId);
    this.menu.open(this.menuId);
  }
  
  closeMenu() {
    this.menu.enable(false, this.menuId);
    this.menu.close(this.menuId);
  }

  async logout() {
    localStorage.clear();
    this.closeMenu();
    this.router.navigate(['/']);
  }
  
}
