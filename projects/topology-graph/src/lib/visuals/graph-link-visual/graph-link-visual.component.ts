import { Component, Input } from '@angular/core';
import { Link } from '@crczp/topology-graph-model';
import { LinkSpeedDecorator } from '../../model/decorators/link-speed-decorator';
import { LinkMailDecorator } from '../../model/decorators/link-mail-decorator';
import { LinkDecoratorSpeedEnum } from '../../model/enums/link-decorator-speed-enum';
import { ICONS_PATH } from '../../icons-path';

/**
 * Visual component used to display links in the graph-visual and its decorators. Binds to link mode.
 */
@Component({
    selector: '[linkVisual]',
    templateUrl: './graph-link-visual.component.html',
    styleUrls: ['./graph-link-visual.component.css'],
})
export class GraphLinkVisualComponent {
    @Input('linkVisual') link: Link;

    iconsPath = ICONS_PATH;
    speedDecorator: LinkSpeedDecorator;
    mailDecorator: LinkMailDecorator;

    linkDecoratorSpeed: LinkDecoratorSpeedEnum;
    linkDecoratorMailSpeed: LinkDecoratorSpeedEnum;

    /**
     * Calculates decorator animation speed (duration) from SpeedEnum.
     * @param {LinkDecoratorSpeedEnum} speedEnum enum describing speed of decorator
     * @returns {number} calculated duration of animation
     */
    calculateDecoratorAnimationDuration(speedEnum: LinkDecoratorSpeedEnum) {
        switch (speedEnum) {
            case LinkDecoratorSpeedEnum.Fast:
                return 750;
            case LinkDecoratorSpeedEnum.Medium:
                return 2000;
            case LinkDecoratorSpeedEnum.Slow:
                return 3000;
        }
    }
}
