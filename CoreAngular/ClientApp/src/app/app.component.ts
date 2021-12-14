import { RegionModel } from './companies/companies.component';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import esriConfig from "@arcgis/core/config.js";
esriConfig.assetsPath = "/lib/esri/assets";


import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';

import Sublayer from '@arcgis/core/layers/support/Sublayer';

import { MapLayerServiceService } from './services/map-layer-service.service';


import LayerList from "@arcgis/core/widgets/LayerList"
import Legend from "@arcgis/core/widgets/Legend"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public view: any = null;
  private gisLayer: MapImageLayer;
  constructor(private imageLayerService: MapLayerServiceService) {
    this.gisLayer = imageLayerService.getBaseLayer();
  }

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;
  @ViewChild('mapLayerList', { static: true }) private mapLayerListEl!: ElementRef;
  @ViewChild('mapLegend', { static: true }) private mapLegendEl!: ElementRef;


  async initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;


    await this.gisLayer.load();

    const map = new Map(
      {
        basemap: "osm",
        layers: [this.gisLayer]
      }
    );



    const view = new MapView({
      map: map,
      extent: this.gisLayer.fullExtent,
      container // Div element
    });


    const bookmarks = new Bookmarks({
      view: view,
      // allows bookmarks to be added, edited, or deleted
      editingEnabled: true,
    });

    const bkExpand = new Expand({
      view,
      content: bookmarks,
      expanded: true,
    });

    let layerList = new LayerList({
      container: this.mapLayerListEl.nativeElement,
      view,
      selectionEnabled: true
    });
    layerList.renderNow();

    new Legend({
      container: this.mapLegendEl.nativeElement,
      view

    })

    // Add the widget to the top-right corner of the view
    view.ui.add(bkExpand, 'top-right');

    this.view = view;
    return this.view.when();
  }

  ngOnInit(): any {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then(() => {
      // The map has been initialized
      console.log('The map is ready.');
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }

  onCompaniesChange(data: RegionModel[]) {
    let layer = this.gisLayer.sublayers.find(a => a.id == 5);
    let regions = data.map(a => a.regionId).join(",");
    layer.definitionExpression = `SDE.substat.COMPANYID IN (${regions})`;
  }
}
