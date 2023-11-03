import { GameObject } from '../GameObject';
import { Vector2D } from '../utils/Vector';
import { FireTex, specialpowerConfig } from '../main';
import { SpecialPower } from './SpecialPower';
import { Effect } from './Effect';
import { Ball } from '../Ball';
import { Bar } from '../Paddles/Bar';
import { UIShooter, Shooter } from './Shooter';
import * as PIXI from 'pixi.js';
import { UIGame } from '../Game';
enum collide {
    NO,
    YES_REMOVE,
    YES_SHOOT
}
export class Fire extends SpecialPower {
    constructor(center: Vector2D, velocity: Vector2D, public shooter: Bar) {
        super('Fire', center, velocity, shooter, specialpowerConfig.fire.diameter, specialpowerConfig.fire.vertices);
    }

    onCollide(target: GameObject): any {
        if (target instanceof Ball) {
            if (target.getEffect === undefined || target.getEffect.name !== 'CANNON') {
                target.setEffect(new Effect('CANNON', target));
                this.shooter.setShooter(new Shooter(this.shooter, this.game));
                return collide.YES_SHOOT;
            }
        }

        if (!(target instanceof SpecialPower)) {
            return collide.YES_REMOVE;
        }
        return collide.NO;
    }
}

export class UIFire extends Fire {
    public displayObject: PIXI.Sprite;
    constructor(center: Vector2D, velocity: Vector2D, shooter: Bar) {
        super(center, velocity, shooter);
        this.displayObject = new PIXI.Sprite(FireTex);
        this.displayObject.anchor.set(0.5);
        this.displayObject.x = center.x;
        this.displayObject.y = center.y;
    }

    update(delta: number): boolean {
        if (!super.update(delta)) {
            return false;
        }

        this.displayObject.x = this.center.x;
        this.displayObject.y = this.center.y;
        return true;
    }

    onCollide(target: GameObject): boolean {
        const ret = super.onCollide(target) as collide;
        if (ret === collide.YES_SHOOT) {
            this.shooter.setShooter(new UIShooter(this.shooter, this.game as UIGame));
            this.game.remove(this);
        }
        else if (ret === collide.YES_REMOVE) {
            this.game.remove(this);
        }

        return ret !== collide.NO;
    }
}
