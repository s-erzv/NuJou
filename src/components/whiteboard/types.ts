export type ToolMode = 'select' | 'pen' | 'text' | 'sticky' | 'rect' | 'ellipse';

interface BaseObject {
  id: string;
  x?: number;
  y?: number;
  rotation?: number;
}

export interface LineObject extends BaseObject {
  kind: 'line';
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface TextObject extends BaseObject {
  kind: 'text';
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
  width: number;
}

export interface StickyObject extends BaseObject {
  kind: 'sticky';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  text: string;
}

export interface RectObject extends BaseObject {
  kind: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
}

export interface EllipseObject extends BaseObject {
  kind: 'ellipse';
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill: string;
  stroke: string;
}

export type CanvasObject = LineObject | TextObject | StickyObject | RectObject | EllipseObject;

let counter = 0;
export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}
