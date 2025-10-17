import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleLine } from '../../shared/components/title-line/title-line';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

interface CardItem {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-our-blueprint',
  imports: [CommonModule, TitleLine],
  templateUrl: './our-blueprint.html',
  styleUrl: './our-blueprint.scss',
})
export class OurBlueprint {
  constructor(private languageService: LanguageService) {}

  get currentLanguage(): string {
    return this.languageService.currentLanguage;
  }

  getTranslation(key: string): string {
    return this.languageService.getTranslationSync(key);
  }

  // بيانات المراحل
  cardData: CardItem[] = [
    {
      title: 'OUR_BLUEPRINT.PHASE_1_TITLE',
      description: 'OUR_BLUEPRINT.PHASE_1_DESCRIPTION',
      icon: 'fas fa-search',
    },
    {
      title: 'OUR_BLUEPRINT.PHASE_2_TITLE',
      description: 'OUR_BLUEPRINT.PHASE_2_DESCRIPTION',
      icon: 'fas fa-pencil-alt',
    },
    {
      title: 'OUR_BLUEPRINT.PHASE_3_TITLE',
      description: 'OUR_BLUEPRINT.PHASE_3_DESCRIPTION',
      icon: 'fas fa-code',
    },
    {
      title: 'OUR_BLUEPRINT.PHASE_4_TITLE',
      description: 'OUR_BLUEPRINT.PHASE_4_DESCRIPTION',
      icon: 'fas fa-rocket',
    },
  ];
}
