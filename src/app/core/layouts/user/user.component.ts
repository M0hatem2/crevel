import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LayoutService } from '../../layouts/layout.service';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.layoutService.setLayout('user');
  }
}
