import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RealDatabaseService } from 'src/app/services/real-database.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit {
  optionText:string='Pack de preguntas';
  constructor(private realDatabase:RealDatabaseService,private authService:AuthService) { }

  ngOnInit() {
  }
  listButton(){
    this.optionText='Pack de preguntas'
  }
  favoriteButton(){
    this.optionText='Favoritos'
  }
  downloadButton(){
    this.optionText='Descargados'
  }
  

}
