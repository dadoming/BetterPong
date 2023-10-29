import { Bar } from "../Bar";
import { Vector2D } from "../utils/Vector";


export class Effect {
    private effectCur: number;
    private effectMax: number;
    private effectType: string;
    
    constructor(effectName: string, target: Bar) {
        this.effectCur = 0;
        this.effectMax = 100;
        this.effectType = effectName;
        switch (this.effectType) {
            case 'SLOW':
                this.effectMax = 120;
                target.increaseHitAmount();
                target.setEffectVelocity(new Vector2D(0, 0.5));
                break;
            case 'STOP':
                this.effectMax = 80;
                target.increaseHitAmount();
                target.setEffectVelocity(new Vector2D(0, 0));
                break;
            case 'REVERSE':
                this.effectMax = 200;
                target.increaseHitAmount();
                target.setEffectVelocity(new Vector2D(0, -1));
                break;
            case 'REVERSE-SLOW':
                this.effectMax = 150;
                target.increaseHitAmount();
                target.setEffectVelocity(new Vector2D(0, -0.5));
                break;
            default:
                this.effectMax = 100;
                break;
        }
    }

    get effect(): number {
        return this.effectCur;
    }

    get effectMaxVal(): number {
        return this.effectMax;
    }

    update(delta: number, player: Bar): void {
        this.effectCur += delta * 0.5;
        console.log(this.effectCur);
        if (this.effectCur >= this.effectMax) {
            player.decreaseHitAmount();
            console.log("decrease hit amount");
            if (player.hitAmountEffect <= 0)
            {
                player.setEffectVelocity(new Vector2D(0, 1));
                player.setEffect(undefined);
            }
        }
    }
}