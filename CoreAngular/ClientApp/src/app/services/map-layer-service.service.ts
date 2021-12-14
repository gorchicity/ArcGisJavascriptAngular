import { Injectable } from '@angular/core';
import MapImageLayer from "@arcgis/core/layers/MapImageLayer"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import FeatureSet from "@arcgis/core/tasks/support/FeatureSet"


@Injectable({
  providedIn: 'root'
})
export class MapLayerServiceService {

  private serviceUrl = "https://192.168.0.171:6443/arcgis/rest/services/sama_No_scale/MapServer";
  private layer: MapImageLayer;
  constructor() {
    this.layer = this.initLayer();
  }

  private initLayer(): MapImageLayer {
    let layer = new MapImageLayer({
      url: this.serviceUrl,
      id: "GisLayer",
      //gdbVersion:"SDE.ADMIN",
      sublayers: [
        { title:"گروه",sublayers:[ 
          { id: 72,title:"امورها"}

        ] },
        { id: 5 ,title:"پست فوق توزیع" },
      ]
    });
    return layer;
  }

  public getBaseLayer(): MapImageLayer {
    return this.layer;
  }

  public async getSubLayerFeatures(layerId: number): Promise<FeatureSet> {
    let layer = new FeatureLayer({
      url: `${this.serviceUrl}/${layerId}`
    });

    let features = await layer.queryFeatures();
    return features;
  }
}
