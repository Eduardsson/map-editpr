import { MapMouseEvent } from 'mapbox-gl';
import {
  rhumbBearing,
  point,
  featureCollection,
  centerOfMass,
  transformRotate,
} from '@turf/turf';
import combine from '@turf/combine';
import { MapboxDrawEvents, MapboxDrawTool } from '../models';

interface RotationState {
  featureIds: Array<string>;
  features: Array<any>;
  dragStarted: boolean;
  currentBearing: number;
  rotationPivot: GeoJSON.Feature<GeoJSON.Point>;
  placeholderFeature: any;
  placeholderGeoJSON: any;
}

export class RotationTool
  extends MapboxDrawTool<RotationState>
  implements MapboxDrawEvents<RotationState> {
  onSetup(opts: { featureIds: Array<string> }) {
    const featureIds = opts.featureIds;

    const features = featureIds.map((id) => {
      const feature = this.getFeature(id);

      if (!feature) {
        throw new Error(
          'You must provide a valid featureId to enter rotation mode'
        );
      }

      if (feature.type !== 'Polygon') {
        throw new TypeError('rotation mode can only handle polygons');
      }

      if (
        feature.coordinates === undefined ||
        feature.coordinates.length !== 1 ||
        feature.coordinates[0].length <= 2
      ) {
        throw new TypeError('rotation mode can only handle polygons');
      }

      return feature;
    });

    const collection = featureCollection(
      features.map((feature) => feature.toGeoJSON())
    );

    const state: RotationState = {
      featureIds,
      features,
      dragStarted: false,
      currentBearing: null,
      rotationPivot: centerOfMass(collection),
      placeholderFeature: null,
      placeholderGeoJSON: null,
    };

    this.setSelected(featureIds);

    return state;
  }

  onMouseDown(state: RotationState, e: MapMouseEvent) {
    /** Disable map draging - this will enable onDrag event firing */
    this.map.dragPan.disable();

    state.currentBearing = rhumbBearing(
      point([e.lngLat.lng, e.lngLat.lat]),
      state.rotationPivot
    );

    const featuresGeoJSON = state.features.map((feature) => {
      return feature.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;
    });

    /** Create only one geoJSON object - for better performance */
    const multipolygon = ((combine(
      featureCollection(featuresGeoJSON)
    ) as unknown) as GeoJSON.FeatureCollection<GeoJSON.MultiPolygon>)
      .features[0];

    multipolygon.id = 'rotate-placeholder';
    const placeholderFeature = this.newFeature(multipolygon);

    state.placeholderFeature = placeholderFeature;
    state.placeholderGeoJSON = placeholderFeature.toGeoJSON();

    this.addFeature(placeholderFeature);
  }

  onDrag(state: RotationState, e: MapMouseEvent) {
    e.originalEvent.stopPropagation();

    const bearing = rhumbBearing(
      point([e.lngLat.lng, e.lngLat.lat]),
      state.rotationPivot
    );

    transformRotate(state.placeholderGeoJSON, bearing - state.currentBearing, {
      pivot: state.rotationPivot.geometry.coordinates,
      mutate: true,
    });
    this.doRender('rotate-placeholder');

    state.currentBearing = bearing;
  }

  toDisplayFeatures(
    state: RotationState,
    geojson: GeoJSON.Feature,
    display: (geojson: GeoJSON.Feature) => void
  ) {
    if (
      state.featureIds.findIndex((id) => id === geojson.properties.id) !== -1
    ) {
      geojson.properties.active = 'true';
      //display(geojson);
    } else {
      if (geojson.properties.id === 'rotate-placeholder') {
        display(state.placeholderGeoJSON);
      } else {
        geojson.properties.active = 'false';
        display(geojson);
      }
    }
  }
}
