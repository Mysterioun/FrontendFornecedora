import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

//Essa classe é responsável por verificar se o usuário está autenticado.
export class AuthService {

  constructor(private router: Router) { }

  public isAuthenticated():boolean{
    const token = localStorage.getItem('token');
    if(!token){
      this.router.navigate(['/']);
      return false;
    }
    else{
      return true;
    }
  }
}
