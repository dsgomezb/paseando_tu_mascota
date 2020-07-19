import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastController: ToastController
  ) { }

  //Servicio generico para generar todos los mensajes en la aplicacion recibe(contenido del mensaje, estilo (esta en global.scss, duracion de tiempo en el que el mensaje se va a mostrar en pantalla))
  async presentToast(infoMessage: string, style: string, duration: number) {
    const toast = await this.toastController.create({
    message: infoMessage,
    duration,
    cssClass: style
    });
    toast.present();
    }
}
