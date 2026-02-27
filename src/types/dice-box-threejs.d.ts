declare module "@3d-dice/dice-box-threejs" {
  export interface DiceBoxConfig {
    assetPath?: string;
    origin?: string;
    onRollComplete?: (results: unknown) => void;
    [key: string]: unknown;
  }

  export interface DiceBoxRenderer {
    domElement: HTMLElement;
    setSize?: (width: number, height: number) => void;
  }

  export default class DiceBox {
    constructor(container: string | HTMLElement, config?: DiceBoxConfig);
    scene?: { background?: unknown };
    camera?: import("three").Camera;
    renderer?: DiceBoxRenderer;
    diceList?: import("three").Object3D[];
    rolling?: boolean;
    initialize(): void | Promise<void>;
    roll(notation: string): Promise<unknown>;
    reroll?(indexes: number[]): Promise<unknown>;
    getDiceResults?(index: number): unknown;
  }
}
