import * as PIXI from 'pixi.js';
import { Game } from '../Game';
import { Vector2D } from '../utils/Vector';

export class Energy {

    private energyCur: number;
    private energyMax: number;
    private energyBar: PIXI.Graphics;

    constructor(player: string) {
        this.energyCur = 100;
        this.energyMax = 100;
        this.energyBar = new PIXI.Graphics();
        this.printEnergy(player);
    }

    get energy(): number {
        return this.energyCur;
    }
    get energyMaxVal(): number {
        return this.energyMax;
    }

    set energy(val: number) {
        this.energyCur = val;
    }
    set energyMaxVal(val: number) {
        this.energyMax = val;
    }

    public spendEnergy(val: number): void {
        this.energyCur -= val;
    }

    public gainEnergy(val: number): void {
        this.energyCur += val;
    }

    public isEnergyEnough(val: number): boolean {
        return this.energyCur >= val;
    }

    public isEnergyFull(): boolean {
        return this.energyCur == this.energyMax;
    }

    getEnergyBarPosition(player: string): Vector2D {
        const position: Vector2D = new Vector2D(0, 0);

        if (player === "Player1"){
            position.x = 10;
            position.y = 18;
        } 
        else if (player === "Player2") 
        {
            position.x = Game.width - this.energyMax - 10;
            position.y = 18;
        }
        else if (player === "Player3")
        {
            position.x = 10;
            position.y = 40;
        }
        else if (player === "Player4")
        {
            position.x = Game.width - this.energyMax - 10;
            position.y = 40;
        }
        return position;
    }

    printEnergy(player: string): void {
        
        const energyBarPosition = this.getEnergyBarPosition(player);
        this.energyBar.clear();
        this.energyBar = new PIXI.Graphics();
        this.energyBar.x = energyBarPosition.x;
        this.energyBar.y = energyBarPosition.y;

        this.energyBar.beginFill(0xFFFF00);
        this.energyBar.drawRect(0, 0, this.energy, 8);
        this.energyBar.endFill();
        if (this.energy < this.energyMax)
        {
            this.energyBar.beginFill(0xFFA500);
            this.energyBar.drawRect(this.energy, 0, this.energyMax - this.energy, 8);
            this.energyBar.endFill();
        }
        Game.app.stage.addChild(this.energyBar);
    }

    update(player: string, delta: number): void {
        
        this.printEnergy(player);
        
        if (this.energyCur < this.energyMax) {
            this.energyCur += 0.5 * delta;
        }
    }
}
