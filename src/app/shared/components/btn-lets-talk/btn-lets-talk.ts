import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-btn-lets-talk',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './btn-lets-talk.html',
  styleUrls: ['./btn-lets-talk.scss']
})
export class BtnLetsTalk {
  constructor(private translate: TranslateService) {}

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }
}
