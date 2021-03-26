// Type definitions for Mapbox GL JS 1.12
// Project: https://github.com/mapbox/mapbox-gl-js
// Definitions by: Dominik Bruderer <https://github.com/dobrud>
//                 Patrick Reames <https://github.com/patrickr>
//                 Karl-Aksel Puulmann <https://github.com/macobo>
//                 Dmytro Gokun <https://github.com/dmytro-gokun>
//                 Liam Clarke <https://github.com/LiamAttClarke>
//                 Vladimir Dashukevich <https://github.com/life777>
//                 Marko Klopets <https://github.com/mklopets>
//                 André Fonseca <https://github.com/amxfonseca>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/// <reference types="geojson" />
/// <reference types="@types/mapbox-gl" />

declare module '@mapbox/mapbox-gl-draw/src/constants' {
  export const classes: {
    CONTROL_BASE: string;
    CONTROL_PREFIX: string;
    CONTROL_BUTTON: string;
    CONTROL_BUTTON_LINE: string;
    CONTROL_BUTTON_POLYGON: string;
    CONTROL_BUTTON_POINT: string;
    CONTROL_BUTTON_TRASH: string;
    CONTROL_BUTTON_COMBINE_FEATURES: string;
    CONTROL_BUTTON_UNCOMBINE_FEATURES: string;
    CONTROL_GROUP: string;
    ATTRIBUTION: string;
    ACTIVE_BUTTON: string;
    BOX_SELECT: string;
  };

  export const sources: {
    HOT: string;
    COLD: string;
  };

  export const cursors: {
    ADD: string;
    MOVE: string;
    DRAG: string;
    POINTER: string;
    NONE: string;
  };

  export const types: {
    POLYGON: string;
    LINE: string;
    POINT: string;
  };

  export const geojsonTypes: {
    FEATURE: string;
    POLYGON: string;
    LINE_STRING: string;
    POINT: string;
    FEATURE_COLLECTION: string;
    MULTI_PREFIX: string;
    MULTI_POINT: string;
    MULTI_LINE_STRING: string;
    MULTI_POLYGON: string;
  };

  export const modes: {
    DRAW_LINE_STRING: string;
    DRAW_POLYGON: string;
    DRAW_POINT: string;
    SIMPLE_SELECT: string;
    DIRECT_SELECT: string;
    STATIC: string;
  };

  export const events: {
    CREATE: string;
    DELETE: string;
    UPDATE: string;
    SELECTION_CHANGE: string;
    MODE_CHANGE: string;
    ACTIONABLE: string;
    RENDER: string;
    COMBINE_FEATURES: string;
    UNCOMBINE_FEATURES: string;
  };

  export const updateActions: {
    MOVE: string;
    CHANGE_COORDINATES: string;
  };

  export const meta: {
    FEATURE: string;
    MIDPOINT: string;
    VERTEX: string;
  };

  export const activeStates: {
    ACTIVE: string;
    INACTIVE: string;
  };

  export const interactions: [
    'scrollZoom',
    'boxZoom',
    'dragRotate',
    'dragPan',
    'keyboard',
    'doubleClickZoom',
    'touchZoomRotate'
  ];

  export const LAT_MIN: number;
  export const LAT_RENDERED_MIN: number;
  export const LAT_MAX: number;
  export const LAT_RENDERED_MAX: number;
  export const LNG_MIN: number;
  export const LNG_MAX: number;
}

declare module '@mapbox/mapbox-gl-draw' {
  import { Feature, FeatureCollection } from 'geojson';
  import { IControl } from 'mapbox-gl';
  import { IMapboxDrawControls } from '@mapbox/mapbox-gl-draw';

  namespace MapboxDraw {
    export interface IMapboxDrawControls {
      point?: boolean;
      line_string?: boolean;
      polygon?: boolean;
      trash?: boolean;
      combine_features?: boolean;
      uncombine_features?: boolean;
    }

    export interface Feature {
      id: string;
      properties: any;
      coordinates: any;
      type: 'Polygon' | 'Point' | 'Line';
      toGeoJSON: () => GeoJSON.Feature;
    }

    export const modes: {
      simple_select: any;
      direct_select: any;
      draw_point: any;
      draw_polygon: any;
      draw_line_string: any;
    };
  }

  class MapboxDraw implements IControl {
    getDefaultPosition: () => string;

    constructor(options?: {
      displayControlsDefault?: boolean;
      keybindings?: boolean;
      touchEnabled?: boolean;
      boxSelect?: boolean;
      clickBuffer?: number;
      touchBuffer?: number;
      controls?: IMapboxDrawControls;
      styles?: object[];
      modes?: object;
      defaultMode?: string;
      userProperties?: boolean;
    });

    public add(geojson: object): string[];

    public get(featureId: string): Feature | undefined;

    public getFeatureIdsAt(point: { x: number; y: number }): string[];

    public getSelectedIds(): string[];

    public getSelected(): FeatureCollection;

    public getSelectedPoints(): FeatureCollection;

    public getAll(): FeatureCollection;

    public delete(ids: string | string[]): this;

    public deleteAll(): this;

    public set(featureCollection: FeatureCollection): string[];

    public trash(): this;

    public combineFeatures(): this;

    public uncombineFeatures(): this;

    public getMode(): string;

    public changeMode(mode: string, options?: object): this;

    public setFeatureProperty(
      featureId: string,
      property: string,
      value: any
    ): this;

    onAdd(map: mapboxgl.Map): HTMLElement;

    onRemove(map: mapboxgl.Map): any;
  }

  export = MapboxDraw;
}
