import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonInput,
    IonLabel
  ]
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  ngOnInit() {}

  login() {
    console.log('Login:', this.username, this.password);
    this.router.navigate(['/home']);
  }

  loginFacebook() {
    console.log('Login com Facebook');
  }

  loginGoogle() {
    console.log('Login com Google');
  }
}