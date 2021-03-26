import { Map, MapMouseEvent } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export interface MapboxDrawEvents<T extends object> {
  /**
   * Triggered when a drag event is detected on the map
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onDrag?: (state: T, e: MapMouseEvent) => void;

  /**
   * Triggered when the mouse is clicked
   * @param state - a mutable state object created by onSetup
   * @param  e - the captured event that is triggering this life cycle event
   */
  onClick?: (state: T, e: MapMouseEvent) => void;

  /**
   * Triggered with the mouse is moved
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onMouseMove?: (state: T, e: MapMouseEvent) => void;

  /**
   * Triggered when the mouse button is pressed down
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onMouseDown?: (state: T, e: MapMouseEvent) => void;

  /**
   * Triggered when the mouse button is released
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onMouseUp?: (state: T, e: MapMouseEvent) => void;

  /**
   * Triggered when the mouse leaves the map's container
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onMouseOut?: (state: T, e: MapMouseEvent) => void;

  /**
   * Triggered when a key up event is detected
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onKeyUp?: (state: T, e: KeyboardEvent) => void;

  /**
   * Triggered when a key down event is detected
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onKeyDown?: (state: T, e: KeyboardEvent) => void;

  /**
   * Triggered when a touch event is started
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onTouchStart?: (state: T, e: TouchEvent) => void;

  /**
   * Triggered when one drags their finger on a mobile device
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onTouchMove?: (state: T, e: TouchEvent) => void;

  /**
   * Triggered when one removes their finger from the map
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onTouchEnd?: (state: T, e: TouchEvent) => void;

  /**
   * Triggered when one quickly taps the map
   * @param state - a mutable state object created by onSetup
   * @param e - the captured event that is triggering this life cycle event
   */
  onTap?: (state: T, e: TouchEvent) => void;

  /**
   * Triggered when the mode is being exited, to be used for cleaning up artifacts such as invalid features
   * @param state - a mutable state object created by onSetup
   */
  onStop?: (state: T) => void;

  /**
   * Triggered when draw.trash() is called.
   * @param state - a mutable state object created by onSetup
   */
  onTrash?: (state: T) => void;

  /**
   * Triggered when draw.combineFeatures() is called.
   * @param state - a mutable state object created by onSetup
   */
  onCombineFeature?: (state: T) => void;

  /**
   * Triggered when draw.uncombineFeatures() is called.
   * @param state - a mutable state object created by onSetup
   */
  onUncombineFeature?: (state: T) => void;
}

/**
 *
 */
export abstract class MapboxDrawTool<T extends object> {
  map: Map;

  hmm = 'hovno';

  /**
   * Sets Draw's internal selected state
   */
  setSelected: (features: any) => any;

  /**
   * Sets Draw's internal selected coordinate state
   */
  setSelectedCoordinates: (
    coords: Array<{ coord_path: string; feature_id: string }>
  ) => any;

  /**
   * Get all selected features as a DrawFeature
   */
  getSelected: () => Array<any>;

  /**
   * Get the ids of all currently selected features
   */
  getSelectedIds: () => Array<string>;

  /**
   * Check if a feature is selected
   */
  isSelected: (id: string) => boolean;

  /**
   * Check if a feature is selected
   */
  getFeature: (id: string) => MapboxDraw.Feature;

  /**
   * Add a feature to draw's internal selected state
   */
  select: (id: string) => void;

  /**
   * Remove a feature from draw's internal selected state
   */
  delete: (id: string) => void;

  /**
   * Delete a feature from draw
   */
  deleteFeature: (id: string, opts: any) => void;

  /**
   * Add a DrawFeature to draw. See this.newFeature for converting geojson into a DrawFeature
   */
  addFeature: (feature: any) => any;

  /**
   * Indicate if the different actions are currently possible with your mode See draw.actionalbe for a list of possible actions. All undefined actions are set to false by default
   */
  setActionableState: (actions: any) => void;

  /**
   * Trigger a mode change
   * @param mode - the mode to transition into
   * @param opts - the options object to pass to the new mode (optional, default {})
   * @param eventOpts - used to control what kind of events are emitted. (optional, default {})
   */
  changeMode: (mode: string, opts?: any, eventOpts?: any) => void;

  /**
   * Update the state of draw map classes
   */
  updateUIClasses: (opts: any) => void;

  /**
   * If a name is provided it makes that button active, else if makes all buttons inactive
   */
  activateUIButton: (name?: string) => void;

  /**
   * Get the features at the location of an event object or in a bbox
   */
  featuresAt: (event: any, bbox: any, buffertype: 'click' | 'tap') => void;

  /**
   * Create a new DrawFeature from geojson
   * @param geojson GeoJSONFeature
   */
  newFeature: (geojson: any) => any;

  /**
   * Check is an object is an instance of a DrawFeature
   */
  isInstanceOf: (type: string, feature: any) => boolean;

  /**
   * Force draw to rerender the feature of the provided id
   * @param id a feature id
   */
  doRender: (id: string) => void;

  /**
   * Triggered while a mode is being transitioned into.
   * @param opts - this is the object passed via draw.changeMode('mode', opts);
   * @returns state object
   */
  abstract onSetup(opts: any): T;

  /**
   * Triggered per feature on render to convert raw features into set of features for display on the map See styling draw for information about what geojson properties Draw uses as part of rendering.
   * @param state - a mutable state object created by onSetup
   * @param geojson - a geojson being evaulated. To render, pass to display.
   * @param display - all geojson objects passed to this be rendered onto the map
   */
  abstract toDisplayFeatures(
    state: T,
    geojson: GeoJSON.Feature,
    display: (geojson: GeoJSON.Feature) => void
  ): void;

  tool(): MapboxDrawEvents<T> {
    const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    return keys.reduce((classAsObj, key) => {
      classAsObj[key] = this[key];
      return classAsObj;
    }, {});
  }
}
