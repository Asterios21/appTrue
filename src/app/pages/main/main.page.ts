import { Component, OnInit, Input } from '@angular/core';
import { JsonService } from 'src/app/services/json-service.service';
import { Question } from 'src/app/model/question';
import { NavigationExtras, Router } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import { PlayPage } from '../play/play.page';
import { AboutPage } from '../about/about.page';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
const getLengthOfObject = (obj: object) => {
  let lengthOfObject = Object.keys(obj).length;
  console.log(lengthOfObject);
}

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  component=PlayPage;
  secondComponent=AboutPage;
  
  question: Question[] = [];
  constructor(public json: JsonService, private route: Router, private navCtrl: NavController,private authService:AuthService,private firestoreService:FirestoreService) { }

  ngOnInit() {
    this.firestoreService.insertUser()
    this.json.getJson("assets/data/questions.json").subscribe((res: any) => {
      var id: string, descripcion!: string, verdad!: string[], reto!: string[];
      for (let key in res) {
        id = key;
        for (let key1 in res[key]) {
          if (key1 == 'Descripcion') {
            descripcion = res[key][key1];
          }
          if (key1 == 'Verdad') {
            verdad = res[key][key1];
          }
          if (key1 == 'Reto') {
            reto = res[key][key1];
          }
        }
        var object = this.createQuestion(id, descripcion, verdad, reto);
        this.question.push(object);
      }
    });
  }
  createQuestion(id: string, descripcion: string, verdad: string[], reto: string[]) {
    var question: Question = {
      id: id,
      descripcion: descripcion,
      verdad: verdad,
      reto: reto,
    }
    return question;
  }
  play(verdad: any[], reto: any[]) {
    const extras: NavigationExtras = {
      queryParams: {
        verdad: JSON.stringify(verdad),
        reto: JSON.stringify(reto),
      }
    }
    this.route.navigate(['play'], extras)
  }
  logout(){
    return this.authService.logout().then(response=>this.route.navigate(['/login'])).catch((e)=>console.log(e));
  }
}
