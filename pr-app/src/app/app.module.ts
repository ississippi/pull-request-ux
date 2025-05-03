import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PrListComponent } from './pr-list/pr-list.component';
import { PrDetailComponent } from './pr-detail/pr-detail.component';
import { PrService } from './services/pr.service';

const routes: Routes = [
  { path: '', component: PrListComponent },
  { path: 'pr/:id/:repo', component: PrDetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PrListComponent,
    PrDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes, { useHash: false })
  ],
  providers: [
    PrService,
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// src/app/app.component.ts has been moved to its own file.

