import { Component, Input } from '@angular/core';
import {NodeSemaphoreDecorator} from '../../../../model/decorators/node-semaphore-decorator';

/**
 * Visual component used for visualizing node semaphore decorator
 */
@Component({
  selector: '[semaphore-decorator]',
  templateUrl: './node-visual-semaphore-decorator.component.html',
  styleUrls: ['./node-visual-semaphore-decorator.component.css']
})
export class NodeVisualSemaphoreDecoratorComponent {

  @Input('semaphore-decorator') decorator: NodeSemaphoreDecorator;

  constructor() {

  }
}

