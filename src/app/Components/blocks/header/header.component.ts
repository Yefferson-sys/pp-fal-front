import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: string;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if (matchMedia) {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addListener(WidthChange);
      WidthChange(mq);
    }

    function WidthChange(mq) {
      let logout = document.getElementById('signout').classList;
      if (mq.matches) {
        if(logout.contains('text-right')) {
          logout.remove('text-right');
        }
      } else {
        if(!logout.contains('text-right')) {
          logout.add('text-right');
        }
      }
    }

    if(localStorage.getItem('identification') == null) {
      this.onLogout();
    }

    this.router.events.subscribe((event: Event)=> {
      if (event instanceof NavigationEnd) {
        if(localStorage.getItem('token')) {
          this.user = JSON.parse(localStorage.getItem('person'))['name'];
        } else {
          this.router.navigate(['']);
        }
      }
    })
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['']);
    this.user = undefined;
  }
}
