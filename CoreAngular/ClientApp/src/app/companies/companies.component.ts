import { MapLayerServiceService } from './../services/map-layer-service.service';
import { Component, OnInit , EventEmitter ,Output} from '@angular/core';
import FeatureSet from '@arcgis/core/tasks/support/FeatureSet';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})

export class CompaniesComponent implements OnInit {
  
  companies: RegionModel[] = [];
  constructor(private mapLayerServiceService: MapLayerServiceService) { }
  
  @Output() onChange: EventEmitter<RegionModel[]> = new EventEmitter();
  
  ngOnInit(): void {
    this.getCompanies();
  }

  async getCompanies() {
    let featureSet = await this.mapLayerServiceService.getSubLayerFeatures(72);
    featureSet.features.forEach((a, ind) => {
      this.companies.push(new RegionModel(a.attributes["EDS_SDE.TBFC_REGIONS.REG_CODE"] as number,
        a.attributes["EDS_SDE.TBFC_REGIONS.REG_NAME"].toString() as string,
        true)
      );

    })
  }

  change(item: RegionModel, eventHandle:any) {
    item.checked = eventHandle.target.checked;
    
    this.onChange.emit(this.companies.filter(a=> a.checked));
  }

}

export class RegionDto{
  constructor(public regionId:number,public regionName:string)
  {

  }
}

export class RegionModel extends RegionDto{
  constructor( regionId:number, regionName:string, public checked:boolean)
  {
    super(regionId,regionName)
  }
}
