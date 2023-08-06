import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { User } from 'src/app/model/user';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RealDatabaseService } from 'src/app/services/real-database.service';
const checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pass = group.get('password')?.value;
  const confirmPass = group.get('confirmPassword')?.value
  return pass === confirmPass ? null : { notEqual: true }
};


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  //reactiveForms
  registerForm!: FormGroup;
  showPassword: boolean = false;

  pw!: string;//password
  cpw!: string;//confirmPassword

  constructor(private toastController: ToastController, private route: Router, private authService: AuthService, private realDatabaseService: RealDatabaseService) {
    //reactiveForm
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email,]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('',),
    }, { validators: checkPasswords })
  }
  ngOnInit() {
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  submitForm() {
    if (this.registerForm.valid && !localStorage.getItem(this.registerForm.get('email')?.value)) {
      let user = this.createUser(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value);
      this.authService.register(user).then(response => {
        this.realDatabaseService.regUser();
        this.mostrarToast('Registro Exitoso');
        this.route.navigate(['/login']);
      }).catch(e => console.log(e));
    }
    else {
      this.mostrarToast('Fallo en el registro');
    }
  }
  createUser(email: string, password: string) {
    let user: User = {
      email: email,
      password: password
    }
    return user;
  }
  idAsString(id: Guid): string {
    const convertedId = JSON.parse(JSON.stringify(id));
    return convertedId.value;
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
