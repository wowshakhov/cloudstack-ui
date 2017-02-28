import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { VirtualMachine, IVmAction } from '../shared/vm.model';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { IAsyncJob } from '../../shared/models/async-job.model';
import { VmService } from '../shared/vm.service';


@Component({
  selector: 'cs-vm-list-item',
  templateUrl: 'vm-list-item.component.html',
  styleUrls: ['vm-list-item.component.scss']
})
export class VmListItemComponent implements OnInit, OnChanges {
  @Input() public vm: VirtualMachine;
  @Input() public isSelected: boolean;
  @Output() public onVmAction = new EventEmitter();
  @Output() public onClick = new EventEmitter();

  public actions: Array<IVmAction>;
  public color: string;

  constructor(
    private asyncJobService: AsyncJobService,
    private vmService: VmService
  ) {}

  public ngOnInit(): void {
    this.updateColor();
    this.actions = this.vm.actions.map(a => VirtualMachine.getAction(a));
    this.asyncJobService.event.subscribe((job: IAsyncJob<VirtualMachine>) => {
      if (job.jobResult && job.jobResult.id === this.vm.id) {
        this.vm.state = job.jobResult.state;
        this.vm.nic[0] = job.jobResult.nic[0];
      }
    });
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    this.onClick.emit(this.vm);
  }

  public openConsole(): void {
    window.open(
      `/client/console?cmd=access&vm=${this.vm.id}`,
      this.vm.displayName,
      'resizable=0,width=820,height=640'
    );
  }

  public getAction(event: MouseEvent, act: string): void {
    event.stopPropagation();
    if (act === 'console') {
      this.openConsole();
      return;
    }

    let e = {
      action: this.actions.find(a => a.nameLower === act),
      vm: this.vm
    };

    if (act === 'restore') {
      e['templateId'] = this.vm.templateId;
    }

    this.onVmAction.emit(e);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    for (let propName in changes) {
      if (changes.hasOwnProperty(propName) && propName === 'isSelected') {
        this.isSelected = changes[propName].currentValue;
      }
    }
  }

  private updateColor(): void {
    this.color = this.vmService.getColor(this.vm);
  }
}
