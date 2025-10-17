import { Component } from '@angular/core';
import { BtnLetsTalk } from "../../shared/components/btn-lets-talk/btn-lets-talk";
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-contact-us',
  imports: [BtnLetsTalk],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss'
})
export class ContactUs {
  constructor(private languageService: LanguageService) {}

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
