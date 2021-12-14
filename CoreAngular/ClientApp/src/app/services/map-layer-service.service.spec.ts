import { TestBed } from '@angular/core/testing';

import { MapLayerServiceService } from './map-layer-service.service';

describe('MapLayerServiceService', () => {
  let service: MapLayerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapLayerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
