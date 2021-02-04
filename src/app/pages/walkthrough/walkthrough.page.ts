import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})
export class WalkthroughPage implements OnInit {
mySlideOptions = {items: 1, dots: true, margin: 30, center: true, loop: true, };

  constructor(private router: Router) { }
  loginPage()
  {
  this.router.navigate(['login'])
  }
  ngOnInit() {
  }

}
