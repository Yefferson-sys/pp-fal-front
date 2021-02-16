import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor() { }

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
  }

  onMenuCtrl() {
    
  }
}
