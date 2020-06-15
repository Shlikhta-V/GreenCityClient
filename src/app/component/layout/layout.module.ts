import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import {
  HeaderComponent,
  FooterComponent,
  SearchPopupComponent,
  SearchNotFoundComponent,
  SearchItemComponent,
  SearchAllResultsComponent
} from './components';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SearchPopupComponent,
    SearchItemComponent,
    SearchNotFoundComponent,
    SearchAllResultsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    InfiniteScrollModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SearchPopupComponent
  ],
  providers: [

  ]
})
export class LayoutModule {}
