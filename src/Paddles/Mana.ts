import * as PIXI from 'pixi.js';
import { UIGame } from '../Game';
import { Vector2D } from '../utils/Vector';

export class Mana {

    protected manaCur: number;
    protected manaMax: number;

    constructor() {
        this.manaCur = 100;
        this.manaMax = 100;
    }

    get mana(): number {
        return this.manaCur;
    }
    get manaMaxVal(): number {
        return this.manaMax;
    }

    set mana(val: number) {
        this.manaCur = val;
    }
    set manaMaxVal(val: number) {
        this.manaMax = val;
    }

    public spendMana(val: number): void {
        this.manaCur -= val;
    }

    public gainMana(val: number): void {
        this.manaCur += val;
    }

    public isManaEnough(val: number): boolean {
        return this.manaCur >= val;
    }

    public isManaFull(): boolean {
        return this.manaCur == this.manaMax;
    }

    update(player: string, delta: number): void {        
        if (this.manaCur < this.manaMax) {
            this.manaCur += 0.1 * delta;
        }
    }
}

export class UIMana extends Mana {
    public manaBar: PIXI.Graphics;
    constructor(player: string, private readonly game: UIGame) {
        super();
        this.manaBar = new PIXI.Graphics();
        this.printMana(player);
    }

    printMana(player: string): void {
        
        const manaBarPosition = this.getManaBarPosition(player);
        this.manaBar.clear();
        this.manaBar.x = manaBarPosition.x;
        this.manaBar.y = manaBarPosition.y;

        this.manaBar.beginFill(0x0000FF);
        this.manaBar.drawRect(0, 0, this.mana, 8);
        this.manaBar.endFill();
        if (this.mana < this.manaMax)
        {
            this.manaBar.beginFill(0xFF0000);
            this.manaBar.drawRect(this.mana, 0, this.manaMax - this.mana, 8);
            this.manaBar.endFill();
        }
        this.game.app.stage.addChild(this.manaBar);
    }

    getManaBarPosition(player: string): Vector2D {
        const position: Vector2D = new Vector2D(0, 0);

        if (player === "Player1"){
            position.x = 10;
            position.y = 10;
        } 
        else if (player === "Player2") 
        {
            position.x = this.game.width - this.manaMax - 10;
            position.y = 10;
        }
        else if (player === "Player3")
        {
            position.x = 10;
            position.y = 32;
        }
        else if (player === "Player4")
        {
            position.x = this.game.width - this.manaMax - 10;
            position.y = 32;
        }
        return position;
    }

    update(player: string, delta: number): void {
        super.update(player, delta);
        this.printMana(player);
    }
}