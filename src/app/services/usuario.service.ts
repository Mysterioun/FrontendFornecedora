import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

//Essa classe é responsável por fazer a comunicação com a API para realizar as operações de CRUD de usuario.
export class UsuarioService {

  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  cadastrar(data:any){
    return this.httpClient.post(this.url+
      "/usuario/cadastrar", data,{
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
  }

  esqueceuSenha(data:any){
    return this.httpClient.post(this.url+
      "/usuario/esqueceuSenha", data,{
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
  }

  login(data:any){
    return this.httpClient.post(this.url+
      "/usuario/login", data,{
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      })
  }

  checkToken(){
    return this.httpClient.get(this.url+"/usuario/checkToken");
  }

  getPeloId(id: any){
    return this.httpClient.get(this.url+"/usuario/getPeloId/"+id);
  }

}