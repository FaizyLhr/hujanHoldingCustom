import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '.';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private apiService: ApiService) {}

  getNews(status: number) {
    return this.apiService.get(`/news/get/all/${status}`);
  }

  postNews(data: any) {
    return this.apiService.post('/news/add', { news: data });
  }

  getNewsDetail(slug: string): Observable<any> {
    return this.apiService.get('/news/get/' + slug);
  }
}
