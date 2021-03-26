import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Control, IControl, Map, NavigationControl } from 'mapbox-gl';

import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { DataService } from '../services';
import { MapboxDrawTool } from '../models';
import { RotationTool } from '../tools';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: Map;
  draw: MapboxDraw;

  floors = [
    {
      id: 'floors.1',
      tiles: 'mapbox://ognevsky.clpioex4/{z}/{x}/{y}',
    },
    {
      id: 'floors.2',
      tiles: 'mapbox://ognevsky.6e71e5mf/{z}/{x}/{y}',
    },
    {
      id: 'floors.3',
      tiles: 'mapbox://ognevsky.8fo71rlj/{z}/{x}/{y}',
    },
    {
      id: 'floors.4',
      tiles: 'mapbox://ognevsky.6zhn9bjq/{z}/{x}/{y}',
    },
    {
      id: 'floors.5',
      tiles: 'mapbox://ognevsky.7pu07ys8/{z}/{x}/{y}',
    },
    {
      id: 'floors.6',
      tiles: 'mapbox://ognevsky.8lz87tau/{z}/{x}/{y}',
    },
    {
      id: 'floors.7',
      tiles: 'mapbox://ognevsky.8lbodzrh/{z}/{x}/{y}',
    },
    {
      id: 'floors.parking',
      tiles: 'mapbox://ognevsky.3pxjyx4v/{z}/{x}/{y}',
    },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.map = new Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/ognevsky/ckgpgimma079b19r437kihrtz?fresh=true',
      center: [14.4396, 50.08405],
      zoom: 19,
      bearing: 116,
    });
    // Add map controls
    this.map.addControl(new NavigationControl());

    this.map.on('load', this.onMapLoad);

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      // Adds the LotsOfPointsMode to the built-in set of modes
      modes: Object.assign(
        {
          rotate: new RotationTool().tool(),
        },
        MapboxDraw.modes
      ),
      styles: [
        // ACTIVE (being drawn)
        // line stroke
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: [
            'all',
            ['==', '$type', 'LineString'],
            ['!=', 'mode', 'static'],
          ],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#D20C0C',
            'line-dasharray': [0.2, 2],
            'line-width': 2,
          },
        },
        // polygon fill
        {
          id: 'gl-draw-polygon-fill',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#D20C0C',
            'fill-outline-color': '#D20C0C',
            'fill-opacity': 0.1,
          },
        },
        // polygon outline stroke
        // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#D20C0C',
            'line-dasharray': [0.2, 2],
            'line-width': 2,
          },
        },
        // vertex point halos
        {
          id: 'gl-draw-polygon-and-line-vertex-halo-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static'],
          ],
          paint: {
            'circle-radius': 5,
            'circle-color': '#FFF',
          },
        },
        // vertex points
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static'],
          ],
          paint: {
            'circle-radius': 8,
            'circle-color': '#D20C0C',
          },
        },

        // midpoint points
        {
          id: 'gl-draw-polygon-and-line-midpoint-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'midpoint'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static'],
          ],
          paint: {
            'circle-radius': 4,
            'circle-color': '#D20C0C',
          },
        },

        // INACTIVE (static, already drawn)
        //vertex
        {
          id: 'gl-draw-point-static',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'feature'], ['==', '$type', 'Point']],
          paint: {
            'circle-radius': 8,
            'circle-color': '#D20C0C',
          },
        },
        // line stroke
        {
          id: 'gl-draw-line-static',
          type: 'line',
          filter: [
            'all',
            ['==', '$type', 'LineString'],
            ['==', 'mode', 'static'],
          ],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#000',
            'line-width': 3,
          },
        },
        // polygon fill
        {
          id: 'gl-draw-polygon-fill-static',
          type: 'fill',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          paint: {
            'fill-color': '#000',
            'fill-outline-color': '#000',
            'fill-opacity': 0.1,
          },
        },
        // polygon outline
        {
          id: 'gl-draw-polygon-stroke-static',
          type: 'line',
          filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#000',
            'line-width': 3,
          },
        },
      ],
    });

    console.log(new RotationTool().tool());

    this.map.addControl(this.draw as any);

    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 82) {
        this.draw.changeMode('rotate', {
          featureIds: this.draw.getSelectedIds(),
        });
      }
    });
  }

  onMapLoad = () => {
    this.dataService.loadData().subscribe((data) => {
      data.forEach((line, index) => {
        const item = this.draw.add({
          id: String(line.id),
          type: 'Polygon',
          coordinates: line.geometry.coordinates,
        });
      });
    });

    this.floors.forEach((floor) => {
      this.map.addLayer({
        id: floor.id,
        type: 'raster',
        layout: {
          visibility: 'visible',
        },
        source: {
          url: floor.tiles,
          type: 'raster',
        },
      });
    });

    const features = this.map.queryRenderedFeatures({
      layers: ['spaces'],
    } as any);
    const values = ['free', 'free', 'occupied', 'occupied', 'occupied', ''];

    console.log(features);
    if (features.length) {
      setInterval(() => {
        features.forEach((feature) => {
          const random = Math.floor(Math.random() * values.length);
          this.map.setFeatureState(
            { id: feature.id, source: 'composite', sourceLayer: 'spaces' },
            { status: values[random] }
          );
        });
      }, 1000);
      // }, 10);
    }
  };
}
