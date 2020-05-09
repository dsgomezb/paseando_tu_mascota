import { Injectable } from '@angular/core';
import { SERVICES } from "../../constants/services";
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  headers = new HttpHeaders({});

  constructor(
    public http: HttpClient
  ) { }

  //Servicio para guardar por defecto los service GET de la aplicacion (Ruta y parametros)
    async getData(path, params): Promise<any>{
      return (
        this.http.get(`${SERVICES.ruta_local}${path}`, {
          headers: this.headers,
          params
        })
        .toPromise()
        .then(response => {
          return response;
        })
        .catch(err => {
          console.log("Error al realizar la peticion GET", err);
        })
      )
    }

    //Servicio para guardar por defecto los service POST de la aplicacion (ruta, cuerpo y parametros)
    async postData(path, body, params): Promise<any>{
      return (
        this.http.post(`${SERVICES.ruta_local}${path}`, body,{
          headers: this.headers,
          params
        })
        .toPromise()
        .then(response => {
          return response;
        })
        .catch(err => {
          console.log("Error al realizar la peticion POST", err);
        })
      )
    }

}
