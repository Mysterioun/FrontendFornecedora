import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CadastrarComponent } from '../cadastrar/cadastrar.component';
import { EsqueceuSenhaComponent } from '../esqueceu-senha/esqueceu-senha.component';
import { LoginComponent } from '../login/login.component';
import { UsuarioService } from '../services/usuario.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

//Essa classe é responsável por exibir a tela inicial do sistema, onde o usuário pode se cadastrar, logar ou recuperar a senha.
export class HomeComponent implements OnInit {

  constructor(private dialog:MatDialog,
    private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {

    this.usuarioService.checkToken().subscribe((response:any)=>{
      this.router.navigate(['/cafe/dashboard']);
    },(error:any)=>{
      console.log(error);
    });
  }

  //Função responsável por abrir o modal de cadastro.

  handleCadastrarAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(CadastrarComponent, dialogConfig);
  }


  //Função responsável por abrir o modal de esqueceu a senha.

  handleEsqueceuSenhaAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(EsqueceuSenhaComponent, dialogConfig);
  }

  //Função responsável por abrir o modal de login.

  handleLoginAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(LoginComponent, dialogConfig);
  }

}
