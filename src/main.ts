import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((e) =>
  console.log(
    `%c${e}`,
    'color: yellow; background: red; font-size: 24px '
  )
);
