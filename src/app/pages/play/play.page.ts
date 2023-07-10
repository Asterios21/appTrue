import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {
  verdad!: string[];
  reto!: string[];
  verdadLength!: number;
  retoLength!: number;
  public question!: string;
  data: any;
  disableButton: boolean = false;
  public alertButtons = ['Listo'];

  constructor(private route: ActivatedRoute) {
    route.queryParams.subscribe(params => {
      if (params) {
        this.verdad = JSON.parse(params['verdad']);
        this.reto = JSON.parse(params['reto']);
      }
    })
  }
  ngOnInit() {
    this.verdadLength = this.verdad.length;
    this.retoLength = this.reto.length;
    this.verdad = this.shuffle(this.verdad);
    this.reto = this.shuffle(this.reto);
    console.log(this.verdad);
    console.log(this.reto);
  }
  disableButtonForTime() {
    this.disableButton = true;
    setTimeout(() => {
      this.disableButton = false;
    }, 3000); // Deshabilita el botón durante 3 segundos (ajusta el tiempo según tus necesidades)
  }
  genVerdad() {
    if (this.verdadLength == 0) {
      this.verdad = this.shuffle(this.verdad);
      this.verdadLength = this.verdad.length;
      this.question = this.verdad[this.verdadLength - 1];
      this.verdadLength = this.verdad.length-1;
      console.log(this.verdadLength);
      console.log(this.verdad);
    }
    else {
      this.question = this.verdad[this.verdadLength - 1];
      this.verdadLength = this.verdadLength - 1;
      console.log(this.verdadLength);
      console.log(this.verdad);
    }
  }
  genReto() {
    if (this.retoLength == 0) {
      this.reto = this.shuffle(this.reto);
      this.retoLength = this.reto.length;
      this.question = this.reto[this.retoLength - 1];
      this.retoLength = this.reto.length-1;
      console.log(this.retoLength);
      console.log(this.reto);
    }
    else {
      this.question = this.reto[this.retoLength - 1];
      this.retoLength = this.retoLength - 1;
      console.log(this.retoLength);
      console.log(this.reto);
    }
  }
  shuffle(a: string[]) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
}
