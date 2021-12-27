import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';
import { ListComponent } from './list/list.component';
import { AddPostComponent } from './add-post/add-post.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    CommunityComponent,
    ListComponent,
    AddPostComponent,
    EditComponent,
  ],
  imports: [CommonModule, CommunityRoutingModule, SharedModule],
})
export class CommunityModule {}
