import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  imports: [MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(public loginService: LoginService) {
    // (async () => {
    //   while (this.loginService.currentUser === "") {
    //     console.log("trying login");
    //     await this.loginService.tryLogin();
    //   }
    // })();
  }
}
