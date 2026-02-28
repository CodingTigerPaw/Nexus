declare module "three" {
  export class Camera {
    position: { x: number; y: number; z: number };
  }

  export class OrthographicCamera extends Camera {
    constructor(
      left: number,
      right: number,
      top: number,
      bottom: number,
      near?: number,
      far?: number
    );
  }

  export class Object3D {
    id: number;
    uuid: string;
    parent: Object3D | null;
    children: Object3D[];
    traverse(callback: (object: Object3D) => void): void;
  }

  export class ColorLike {
    setStyle(value: string): void;
  }

  export class MaterialLike {
    clone(): MaterialLike;
    needsUpdate?: boolean;
  }

  export class MeshStandardMaterial extends MaterialLike {
    color: ColorLike;
    emissive: ColorLike;
    emissiveIntensity: number;
    map?: unknown;
    bumpMap?: unknown;
    normalMap?: unknown;
  }

  export class Mesh extends Object3D {
    isMesh: boolean;
    material: MeshStandardMaterial | MeshStandardMaterial[];
  }

  export class Texture {}

  export class Vector2 {
    constructor(x?: number, y?: number);
  }

  export class Raycaster {
    setFromCamera(pointer: Vector2, camera: Camera): void;
    intersectObjects(
      objects: Object3D[],
      recursive?: boolean
    ): Array<{ object: Object3D }>;
  }

  export class TextureLoader {
    load(
      url: string,
      onLoad: (texture: Texture) => void,
      onProgress?: unknown,
      onError?: (event: unknown) => void
    ): void;
    loadAsync(url: string): Promise<Texture>;
  }
}
