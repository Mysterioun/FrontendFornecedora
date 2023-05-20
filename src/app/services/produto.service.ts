import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

//Essa classe é responsável por fazer a comunicação com a API para realizar as operações de CRUD de produto.
export class ProdutoService {
  
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  add(data:any){
    return this.httpClient.post(this.url +
      "/produto/add",data,{
        headers: new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  editar(data:any){
    return this.httpClient.post(this.url +
      "/produto/editar",data,{
        headers: new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  getProdutos(){
    return this.httpClient.get(this.url + "/produto/get")
  }

  editarStatus(data:any){
    return this.httpClient.post(this.url +
      "/produto/editarStatus", data,{
        headers: new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  excluir(id:any){
    return this.httpClient.post(this.url +
      "/produto/excluir/"+id,{
        headers: new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  getProdutosPelaCategoria(id: any){
    return this.httpClient.get(this.url+"/produto/getPelaCategoria/"+id);
  }

  getPeloId(id: any){
    return this.httpClient.get(this.url+"/produto/getPeloId/"+id);
  }
  
}
