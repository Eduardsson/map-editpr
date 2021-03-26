import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

import { throwError, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private location: PlatformLocation) {}

  /**
   * @returns observable of requested spaces
   */
  loadData(): Observable<Array<GeoJSON.Feature<GeoJSON.Polygon>>> {
    return this.http
      .get(
        location.origin + '/assets/spaces.json?d=' + new Date().toISOString(),
        { responseType: 'text' as 'json' }
      )
      .pipe(
        map(
          (data: string) =>
            data
              .split('\n')
              .map((line) => {
                try {
                  return JSON.parse(line);
                } catch (error) {
                  console.log(error);
                  return null;
                }
              })
              .filter((line) => line !== null) as Array<
              GeoJSON.Feature<GeoJSON.Polygon>
            >
        ),
        catchError((err) => {
          return throwError('Could not load data');
        })
      );
  }
}
