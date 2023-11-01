import { Component, OnInit, inject } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { RememberDbService } from 'src/app/shared/service/remember.db.service';
import { from } from 'rxjs';
import { CardContent } from '../card/card-content.interface';

@Component({
  selector: 'ri-section',
  standalone: true,
  imports: [CommonModule, CardComponent],
  providers: [RememberDbService],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.less'],
})
export class SectionComponent implements OnInit {
  public removeCardCallback: Function = this.removeCard.bind(this);
  public textCardCallback: Function = this.saveText.bind(this);
  protected dbService = inject(RememberDbService);

  protected cards: CardContent[] = [];

  ngOnInit(): void {
    this.getElement();
  }

  private getElement(): void {
    from(
      this.dbService.getElement<CardContent[]>('postsStore', 'all')
    ).subscribe({
      next: (res) => {
        this.cards =
          res && res.length > 0 ? res : ([{ id: 0 }] as CardContent[]);
      },
    });
  }

  protected addCard(): void {
    const lastCard = this.cards[this.cards.length - 1] ?? { id: -1 };

    this.cards.push({ id: (lastCard.id ?? -1) + 1 } as CardContent);
  }

  protected removeCard(index: number): void {
    this.cards.splice(index, 1);
    this.dbService.removeElement('postsStore', index.toString());
  }

  protected saveText(text: string, index: number): void {
    from(
      this.dbService.getElement<CardContent>('postsStore', index.toString())
    ).subscribe({
      next: (res) => {
        if (!res)
          this.dbService.addElement('postsStore', {
            text,
            id: index,
          } as CardContent);
        else
          this.dbService.editElement('postsStore', index.toString(), {
            text,
            id: index,
          } as CardContent);
      },
    });
  }
}
