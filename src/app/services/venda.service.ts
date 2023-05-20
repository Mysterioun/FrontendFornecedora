import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

//Responsável por fazer a comunicação com a API para realizar as operações da classe Venda.
export class VendaService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  gerarReport(data:any){
    return this.httpClient.post(this.url+
      "/venda/gerarReport", data,{
        headers:new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  getPdf(data:any):Observable<Blob>{
    return this.httpClient.post(this.url+"/venda/getPdf", data,{responseType: 'blob'});
  }

  getVendas(){
    return this.httpClient.get(this.url+"/venda/getVendas");
  }
  
  excluir(id:any){
    return this.httpClient.post(this.url+
      "/venda/excluir/"+id,{
        headers: new HttpHeaders().set('Content-Type', "application/json")
      });
  }

}
