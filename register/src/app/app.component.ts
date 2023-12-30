import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BehaviorSubject, Observable, of } from "rxjs";
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'register';
  isLoggedIn$: Observable<boolean> = of(false);

  constructor(public loginService: LoginService, private router: Router) {

  }

  logout() {
    this.loginService.logout();
  }

  ngOnInit() {
    this.loginService.isLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        this.router.navigate(["/", "checkout"]);
      } else {
        this.router.navigate(["/", "login"]);
      }
    });
    this.isLoggedIn$ = this.loginService.isLoggedIn();

  }
}
