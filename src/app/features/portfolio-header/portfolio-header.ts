import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCard } from "../../shared/components/custom-card/custom-card";

@Component({
  selector: 'app-portfolio-header',
  imports: [CommonModule, CustomCard],
  templateUrl: './portfolio-header.html',
  styleUrl: './portfolio-header.scss'
})
export class PortfolioHeader {
  cards = [
    { title: 'Card 1', description: 'Description 1' },
    { title: 'Card 2', description: 'Description 2' },
    { title: 'Card 3', description: 'Description 3' }
  ];

  onScroll() {
    // Handle scroll event
    console.log('Scrolling...');
  }

  getCardStyle(index: number) {
    return {
      'transform': `translateX(${index * 10}px)`,
      'opacity': 0.8 + (index * 0.1)
    };
  }
}
