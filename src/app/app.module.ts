import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BackgroundComponent } from './background/background.component';
import { ContentComponent } from './content/content.component';
import { ClockComponent } from './content/clock/clock.component';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundComponent,
    ContentComponent,
    ClockComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
