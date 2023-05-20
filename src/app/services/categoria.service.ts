import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

//Essa classe é responsável por fazer a comunicação com a API para realizar as operações de CRUD de categoria.
export class CategoriaService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url +
      "/categoria/add",data,{
        headers: new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  editar(data:any){
    return this.httpClient.post(this.url +
      "/categoria/editar",data,{
        headers: new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  getCategorias(){
    return this.httpClient.get(this.url + "/categoria/get")
  }

  getFiltrandoCategorias(){
    return this.httpClient.get(this.url+"/categoria/get?filterValue=true");
  }

  excluir(id:any){
    return this.httpClient.post(this.url +
      "/categoria/excluir/"+id,{
        headers: new HttpHeaders().set('Content-Type', "application/json")
      })
  }

}
