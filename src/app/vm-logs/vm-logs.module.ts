import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { VmLogsComponent } from './vm-logs/vm-logs.component';
import { VmLogsFilterComponent } from './vm-logs-filter/vm-logs-filter.component';
import { VmLogsService } from './services/vm-logs.service';
import { VmLogKeywordsComponent } from './vm-log-keywords/vm-log-keywords.component';
import { VmLogsEffects } from './redux/vm-logs.effects';
import { EffectsModule } from '@ngrx/effects';
import { VmLogsFilterContainerComponent } from './containers/vm-logs-filter.container';
import { StoreModule } from '@ngrx/store';
import { vmLogsReducers } from './redux/vm-logs.reducers';
import { VmLogsTableComponent } from './vm-logs-table/vm-logs-table.component';
import { VmLogsTableContainerComponent } from './containers/vm-logs-table.container';
import { CdkTableModule } from '@angular/cdk/table';
import { BasePathPipe } from './pipes/base-path.pipe';
import { ParseTimestampPipe } from './pipes/parse-timestamp.pipe';
import { DateObjectToDatePipe } from './pipes/date-object-to-date.pipe';
import { VmLogsScrollService } from './services/vm-logs-scroll.service';
import { reducer as scrollVmLogs } from './redux/scroll-vm-logs.reducers';
import { VmLogsContainerComponent } from './containers/vm-logs.container';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    MatChipsModule,
    CdkTableModule,
    StoreModule.forFeature('vmLogs', vmLogsReducers),
    StoreModule.forFeature('scrollVmLogs', scrollVmLogs),
    EffectsModule.forFeature([VmLogsEffects]),
  ],
  declarations: [
    VmLogsComponent,
    VmLogsContainerComponent,
    VmLogsFilterComponent,
    VmLogsFilterContainerComponent,
    VmLogsTableComponent,
    VmLogsTableContainerComponent,
    VmLogKeywordsComponent,
    BasePathPipe,
    ParseTimestampPipe,
    DateObjectToDatePipe
  ],
  providers: [
    VmLogsService,
  ]
})
export class VmLogsModule {
}
