import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { AddPostComponent } from './add-post/add-post.component';


@NgModule({
  declarations: [
    CommunityComponent,
    DetailComponent,
    ListComponent,
    AddPostComponent
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule
  ]
})
export class CommunityModule { }
