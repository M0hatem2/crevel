import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-topics',
  imports: [TranslateModule],
  templateUrl: './topics.html',
  styleUrl: './topics.scss'
})
export class Topics {
  constructor(private languageService: LanguageService) {}

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }
}
