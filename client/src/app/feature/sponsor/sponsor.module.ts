import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SponsorRoutingModule } from './sponsor-routing.module';
import { SponsorComponent } from './sponsor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [SponsorComponent, ListComponent, DetailComponent, AddNewsComponent, EditComponent],
  imports: [CommonModule, SponsorRoutingModule, SharedModule],
})
export class SponsorModule {}
