package com.lapredictive.backend.sous_zones;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lapredictive.backend.zones.Zones;

public interface SousZonesRepository extends JpaRepository<SousZones,Long>{
    
    List<SousZones> getUserSousZonesByZone(Zones zone);
}
