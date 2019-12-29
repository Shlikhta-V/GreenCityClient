import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from 'src/app/service/news/news.service';
import { NewsDto } from 'src/app/service/news/NewsDto';
import { of } from 'rxjs';
import { LanguageService } from 'src/app/i18n/language.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-eco-events',
  templateUrl: './eco-events.component.html',
  styleUrls: ['./eco-events.component.css']
})
export class EcoEventsComponent implements OnInit, OnDestroy {
  readonly eventImg = 'assets/img/main-event-placeholder.png';
  readonly arrow = 'assets/img/icon/arrow.png';
  latestNews: NewsDto[] = [];

  constructor(private newsService: NewsService, private languageService: LanguageService) { }

  ngOnInit() {
    this.newsService.loadLatestNews();
    this.newsService.latestNewsSubject.pipe(
      catchError(() => of([]))
    ).subscribe(
      (newsItems: NewsDto[]) => {
        newsItems.forEach(el => el.creationDate = this.convertDate(el.creationDate));
        this.latestNews = newsItems;
      },
      error => { throw error; }
    );
  }

  ngOnDestroy() {
    this.newsService.latestNewsSubject.unsubscribe();
  }

  private convertDate(date: string): string {
    const localizedMonth = this.languageService.getLocalizedMonth(new Date(date).getMonth());
    const formattedDate = new Date(date).getDay()
      + ' '
      + localizedMonth.charAt(0).toUpperCase()
      + localizedMonth.slice(1, localizedMonth.length);
    return formattedDate;
  }
}