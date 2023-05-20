import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-mudar-senha',
  templateUrl: './mudar-senha.component.html',
  styleUrls: ['./mudar-senha.component.scss']
})
export class MudarSenhaComponent implements OnInit {
  senhaAntiga = true;
  senhaNova = true;
  confirmSenha = true;
  changePasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<MudarSenhaComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      senhaAntiga:[null, Validators.required],
      senhaNova: [null, Validators.required],
      confirmSenha: [null, Validators.required]
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['senhaNova'].value != this.changePasswordForm.controls['confirmSenha'].value){
      return true;
    }
    else{
      return false;
    }
  }

  handlepasswordChangeSubmit(){
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    var data = {
      senhaAntiga: formData.senhaAntiga,
      senhaNova: formData.senhaNova,
      confirmSenha: formData.confirmSenha
    }

    this.usuarioService.mudarSenha(data).subscribe((response: any)=>{
      this.ngxService.stop();
      this.responseMessage = response?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage, "sucesso");
    },(error)=>{
      console.log(error);
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
     // this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
  refresh(): void {
    window.location.reload();
}
}
