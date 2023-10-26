import { Component, signal } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ri-section',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.less']
})
export class SectionComponent {
  public removeCardCallback: Function = this.removeCard.bind(this);
  protected cardList = [{id: 1}];
  protected readonly cards = signal(this.cardList);

  protected addCard(): void {
    this.cards.mutate(value => {value.push({id: this.cardList.length + 1})});
  }

  protected removeCard(index: number): void {
    this.cards.mutate(value => {value.splice(index, 1)});
  }
}
