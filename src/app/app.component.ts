import { Component, OnInit, inject } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { SectionComponent } from './components/section/section.component';
import { RememberDbService } from './shared/service/remember.db.service';

@Component({
  standalone: true,
  imports:[HeaderComponent, SectionComponent],
  providers: [RememberDbService],
  selector: 'ri-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  private dbService = inject(RememberDbService);

  ngOnInit(): void {
    this.dbService.createDb();
  }
}
