import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RealDatabaseService } from 'src/app/services/real-database.service';
import { userQuestion } from 'src/app/model/userQuestion';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Question } from 'src/app/model/question';
import { PlayPage } from '../play/play.page';
import { AboutPage } from '../about/about.page';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController, NavController, NavParams } from '@ionic/angular';
import { elementAt } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { set } from 'firebase/database';
import { CameraService } from 'src/app/services/camera.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {
  component = AboutPage;
  questionForm!: FormGroup;
  user!: string;
  optionText: string = 'Pack de preguntas';
  data: Array<userQuestion> = [];
  favorites: Array<any> = []
  likes: Array<any> = []
  presentingElement!: Element;
  image: string = ""
  detalle_cuenta:string=""

  constructor(private cameraService: CameraService, private actionSheetCtrl: ActionSheetController, private realDatabase: RealDatabaseService, private route: Router, private authService: AuthService, private firestoreService: FirestoreService) {
    this.questionForm = new FormGroup({
      titulo: new FormControl('', [Validators.required,]),
      descripcion: new FormControl('', [Validators.required,]),
      verdad: new FormControl('', [Validators.required,]),
      reto: new FormControl('', [Validators.required,]),
    });
  }

  async ngOnInit() {
    this.firestoreService.insertUser()
    await this.getQuestions()
    this.getUser()
    await this.getFavorites()
    await this.getLikes()
    this.image = await this.firestoreService.getAvatar(this.user);
    this.detalle_cuenta = await this.firestoreService.getDetalle_cuenta(this.user);
    this.presentingElement = document.querySelector('.ion-page')!
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Estas seguro?',
      buttons: [
        {
          text: 'Si',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };


  play(verdad: any[], reto: any[]) {
    const extras: NavigationExtras = {
      queryParams: {
        verdad: JSON.stringify(verdad),
        reto: JSON.stringify(reto),
      }
    }
    this.route.navigate(['play'], extras)
  }

  listButton() {
    let icon = document.getElementById('listIcon')
    let listView = document.getElementById('listView')
    let cardView = document.getElementById('cardView')
    this.optionText = 'Pack de preguntas'
    if (icon?.getAttribute('name') == 'list-outline') {
      icon.setAttribute('name', 'grid')
      cardView!.style.display = 'none';
      listView!.style.display = '';
    }
    else {
      icon?.setAttribute('name', 'list-outline')
      cardView!.style.display = '';
      listView!.style.display = 'none';

    }

  }
  favoriteButton() {
    this.optionText = 'Favoritos'
    let icon = document.getElementById('favoriteIcon')
    if (icon?.getAttribute('name') == 'heart-outline') {
      icon.setAttribute('name', 'heart')
    }
    else {
      icon?.setAttribute('name', 'heart-outline')
    }
  }
  downloadButton() {
    this.optionText = 'Descargados'
  }
  addButton() {

  }
  getUser() {
    this.user = this.authService.getCurrentUser()?.email!;
  }

  async getQuestions() {
    await this.firestoreService.getQuestions().then((value) => {
      this.data = value
    })
  }
  async getFavorites() {
    await this.firestoreService.getFavorites(this.user).then((value) => {
      this.favorites = value
    })
  }
  changeStateOfFavoriteIcon(id: string) {
    let icon = document.getElementById(id + '_fav')
    if (icon?.getAttribute('name') == 'heart-outline') {
      this.firestoreService.updateFavorites(this.user, id, 'add')
      icon?.setAttribute('name', 'heart')
    }
    else {
      this.firestoreService.updateFavorites(this.user, id, 'delete')
      icon?.setAttribute('name', 'heart-outline')
    }
  }
  async getLikes() {
    await this.firestoreService.getLikes(this.user).then((value) => {
      this.likes = value
    })
  }
  changeStateOfLikeIcon(id: string) {
    let icon = document.getElementById(id + '_like')
    if (icon?.getAttribute('name') == 'thumbs-up-outline') {
      this.firestoreService.updateLikes(this.user, id, 'like')
      icon?.setAttribute('name', 'thumbs-up')
    }
    else {
      this.firestoreService.updateLikes(this.user, id, 'dislike')
      icon?.setAttribute('name', 'thumbs-up-outline')
    }
  }
  setQuestions() {
    let verdad = this.questionForm.get('verdad')?.value as string;
    let reto = this.questionForm.get('reto')?.value as string;
    let verdadArray: Array<string> = verdad.split(/\r\n|\r|\n/, -1)
    let retoArray: Array<string> = reto.split(/\r\n  |\r|\n/, -1)

    console.log(verdadArray)
    console.log(retoArray)
    let question: userQuestion = {
      id: '',
      autor: '',
      titulo: this.questionForm.get('titulo')?.value,
      descripcion: this.questionForm.get('descripcion')?.value,
      likes: [''],
      verdad: verdadArray,
      reto: retoArray,
    }
    this.firestoreService.setQuestions(this.user, question)

  }
  setDescripcion() {
    let descripcionInput = document.getElementById('descripcionInput') as HTMLInputElement;
    this.firestoreService.setDescripcion(this.user, descripcionInput?.value as string)
  }
  

  logout() {
    return this.authService.logout().then(response => this.route.navigate(['/login'])).catch((e) => console.log(e));
  }

  /* ##################################### */

  async editar() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 90,
    });

    if (image) {
      const ress = await this.updateImg(image)
      console.log("esto es la URL :" + ress)
      this.firestoreService.setAvatar(this.user, ress)
    }
  }

  async updateImg(file: any) {
    const path = "user";
    const nombre = this.user;
    const res = await this.cameraService.updateImg(file, path, nombre);
    return res;
  }



}
