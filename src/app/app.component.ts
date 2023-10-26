import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SectionComponent } from './components/section/section.component';

@Component({
  standalone: true,
  imports:[HeaderComponent, SectionComponent],
  selector: 'ri-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
}
