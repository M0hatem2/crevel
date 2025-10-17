import { Component } from '@angular/core';
import { LetsTalkForm } from '../../features/lets-talk-form/lets-talk-form';
import { HowWeSucceed } from '../../features/how-we-succeed/how-we-succeed';
import { LanguageService } from '../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [LetsTalkForm, HowWeSucceed, TranslateModule],
  templateUrl: './contact-me.html',
  styleUrl: './contact-me.scss',
})
export class ContactMe {
  constructor(private languageService: LanguageService) {}
}
