import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})

//Essa classe é responsável por exibir o header do sistema.
export class AppHeaderComponent {

  role: any;
  constructor(private router: Router,
    private dialog:MatDialog) {
  }
  //Função responsável por abrir o modal de confirmação de saída do sistema.
  logout(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      Mensagem: 'Sair',
      confirmation:true
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    })
  }

}
