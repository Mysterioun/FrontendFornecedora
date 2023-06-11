import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UsuarioService } from '../services/usuario.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-esqueceu-senha',
  templateUrl: './esqueceu-senha.component.html',
  styleUrls: ['./esqueceu-senha.component.scss']
})

//Essa classe é responsável por recuperar a senha do usuário.
export class EsqueceuSenhaComponent implements OnInit {

  esqueceuSenhaForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<EsqueceuSenhaComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.esqueceuSenhaForm = this.formBuilder.group({
      email: [null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    });
  }

  //Essa função é responsável por enviar o email para o usuário.
  handleSubmit(){
    this.ngxService.start();
    var formData = this.esqueceuSenhaForm.value;
    var data = {
      email: formData.email
    }
    this.usuarioService.esqueceuSenha(data).subscribe((response: any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.Mensagem;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage,"");
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.Mensagem){
        this.responseMessage = error.error?.Mensagem;
      }
      else{
        this.responseMessage = GlobalConstants.erroGenerico;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }


}
