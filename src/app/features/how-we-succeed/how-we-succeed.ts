import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { howWeSucceedService, HowWeSucceedItem } from './services/howWeSucceed.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-how-we-succeed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-we-succeed.html',
  styleUrls: ['./how-we-succeed.scss'],
})
export class HowWeSucceed {
  constructor(
    private howWeSucceedService: howWeSucceedService,
    private languageService: LanguageService
  ) {}
  howWeSucceedData: HowWeSucceedItem[] = [];

  get currentLanguage(): string {
    return this.languageService.currentLanguage;
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }

  getHowWeSucceed() {
    const currentLang = this.languageService.currentLanguage;
    this.howWeSucceedService.getHowWeSucceedData(currentLang).subscribe((response) => {
      this.howWeSucceedData = response.HowWeSucceed.data;
      console.log(this.howWeSucceedData);
    });
  }

  ngOnInit() {
    this.getHowWeSucceed();
  }
}
