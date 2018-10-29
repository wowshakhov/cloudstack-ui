import {
  HorizontalConnectionPos,
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { PopoverComponent } from './popover.component';

/**
 * This directive is used in conjunction with cs-popover component:
 *    <button [csPopoverTrigger]="popover"></button>
 *    <cs-popover #popover></cs-popover>
 *
 * It handles opening and closing the popover.
 */
@Directive({
  selector: '[csPopoverTrigger]',
})
export class PopoverTriggerDirective implements AfterViewInit, OnDestroy {
  @Input()
  public csPopoverTrigger: PopoverComponent;
  @Input()
  public popoverPositionX: HorizontalConnectionPos;
  @Input()
  public popoverPositionY: VerticalConnectionPos;
  @Output()
  public popoverOpened = new EventEmitter<void>();
  @Output()
  public popoverClosed = new EventEmitter<void>();

  private portal: TemplatePortal<any>;
  private overlayRef: OverlayRef | null = null;

  constructor(
    private overlayBuilder: Overlay,
    private element: ElementRef,
    private viewContainerRef: ViewContainerRef,
  ) {}

  public ngAfterViewInit(): void {
    if (!this.csPopoverTrigger) {
      throw new Error(`csPopoverTrigger: you need to pass a PopoverComponent instance.

      Example:
        <button [csPopoverTrigger]="popover"></button>
        <cs-popover #popover></cs-popover>
      `);
    }
  }

  public ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  @HostListener('click')
  public handleClick() {
    if (this.open) {
      this.closePopover();
    } else {
      this.openPopover();
    }
  }

  @HostListener('document:click', ['$event'])
  public outsideClick(event: MouseEvent) {
    const clickTarget = event.target as HTMLElement;
    const el = this.element.nativeElement;

    if (
      this.open &&
      clickTarget !== el &&
      !el.contains(clickTarget) &&
      !!this.overlayRef &&
      !this.overlayRef.overlayElement.contains(clickTarget)
    ) {
      this.closePopover();
    }
  }

  public get open(): boolean {
    if (!this.overlayRef) {
      return false;
    }

    return this.overlayRef.hasAttached();
  }

  public openPopover() {
    if (!this.open) {
      const { overlay, portal } = this.createOverlay();
      this.overlayRef = overlay;
      this.portal = portal;
      this.overlayRef.attach(this.portal);
      this.popoverOpened.emit();
    }
  }

  public closePopover() {
    if (this.open && this.overlayRef) {
      this.overlayRef.detach();
      this.popoverClosed.emit();
    }
  }

  private createOverlay(): { overlay: OverlayRef; portal: TemplatePortal } {
    const portal = new TemplatePortal(this.csPopoverTrigger.templateRef, this.viewContainerRef);

    const overlay = this.overlayBuilder.create(
      new OverlayConfig({
        positionStrategy: this.getPositionStrategy(),
        scrollStrategy: this.overlayBuilder.scrollStrategies.reposition(),
      }),
    );

    return {
      overlay,
      portal,
    };
  }

  private getPositionStrategy(): PositionStrategy {
    const overlayX = this.popoverPositionX || 'center';
    const overlayY = this.popoverPositionY || 'top';

    const fallbackOverlayX = overlayX === 'start' ? 'end' : overlayX === 'end' ? 'start' : 'center';
    const fallbackOverlayY =
      overlayY === 'top' ? 'bottom' : overlayY === 'bottom' ? 'top' : 'center';

    return this.overlayBuilder
      .position()
      .flexibleConnectedTo(this.element)
      .withPositions([
        {
          overlayX,
          overlayY,
          originX: 'center',
          originY: 'bottom',
        },
        {
          overlayX: fallbackOverlayX,
          overlayY: fallbackOverlayY,
          originX: 'center',
          originY: 'top',
        },
      ]);
  }
}
