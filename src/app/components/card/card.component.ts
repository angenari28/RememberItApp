import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CardContent } from './card-content.interface';

@Component({
  selector: 'ri-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
})
export class CardComponent implements OnInit {
  @Input() removeCallback: Function = () => {};
  @Input() cardContent!: CardContent;
  @Input() textCallback: Function = () => {};

  protected textContent!: FormControl<string | null>;
  protected titleContent!: FormControl<string | null>;

  ngOnInit(): void {
    this.textContent = new FormControl(this.cardContent.text ?? '');
    this.titleContent = new FormControl(this.cardContent.title ?? '');

    this.textContent.valueChanges.pipe(debounceTime(1000)).subscribe({
      next: (value: string | null) => {
        this.textCallback(value, this.cardContent.id);
      },
    });
  }
}
