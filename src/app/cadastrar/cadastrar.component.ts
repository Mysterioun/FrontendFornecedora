import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UsuarioService } from '../services/usuario.service';
import { GlobalConstants } from '../shared/global-constants';
import Inputmask from 'inputmask'

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss'],
})

//Essa classe é responsável por cadastrar um novo usuário no sistema.
export class CadastrarComponent implements OnInit {

  //As variaveis abaixo são responsáveis por controlar a visibilidade dos campos de senha e confirmar senha.

  password = true;
  confirmPassword = true;
  cadastrarForm: any = FormGroup;
  responseMessage: any; 
  
  //Construtor da classe, resposável por instanciar os serviços utilizados.

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<CadastrarComponent>,
    private ngxService: NgxUiLoaderService
    ) { }


  ngOnInit(): void {
      this.cadastrarForm = this.formBuilder.group({
        nome:[null,[Validators.required, Validators.pattern(GlobalConstants.nomeRegex)]],
        email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
        numeroContato:[null,[Validators.required, Validators.pattern(GlobalConstants.numeroContatoRegex)]],
        senha: [null,[Validators.required]],
        confirmarSenha: [null,[Validators.required]]

      })
      this.aplicarMascaraTelefone();

  }

  //Essa função é responsável por validar se as senhas digitadas são iguais.

  validateSubmit(){
    if(this.cadastrarForm.controls['senha'].value != this.cadastrarForm.controls['confirmarSenha'].value){
      return true;

    }else{
      return false;
    }
  }

  //Essa função é responsável por cadastrar um novo usuário no sistema.

  handleSubmit(){
      this.ngxService.start();
      var formData = this.cadastrarForm.value;
      var data = {
        nome: formData.nome,
        email: formData.email,
        numeroContato: formData.numeroContato,
        senha: formData.senha
      }

      this.usuarioService.cadastrar(data).subscribe((response: any) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage,"");
        this.router.navigate(['/']);
      },(error)=>{
        this.ngxService.stop();
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }
        else{
          this.responseMessage = GlobalConstants.erroGenerico;
        }
       // this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);

      })
  }

  //Essa função é responsável por atualizar a página.
  refresh(): void {
    window.location.reload();
}

aplicarMascaraTelefone() {
  const telefoneInput = document.getElementById('numeroContato') as HTMLInputElement;
  const telefoneMask = Inputmask('(99) 99999-9999');
  telefoneMask.mask(telefoneInput);
}
 
}
