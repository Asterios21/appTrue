import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/model/user';
import { RealDatabaseService } from 'src/app/services/real-database.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  pw!: string;
  constructor(private route: Router, private toastController: ToastController, private authService: AuthService,private realDatabaseService:RealDatabaseService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }
  ngOnInit() {

  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  login() {
    let user: User = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.authService.login(user).then(response => { console.log(response);this.route.navigate(['/main']); }).catch(e => {console.log(e);this.mostrarToast('Usuario o contraseña incorrectos');});
    
  }
  loginWithGoogle(){
    this.authService.loginWithGoogle().then(response=>{this.route.navigate(['/main']);}).catch(e=>console.log(e));
  }
  async mostrarToast(mensaje: string, duracion: number = 2000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion,
      position: 'top' // Puedes ajustar la posición del toast si lo deseas
    });
    toast.present();
  }
}
