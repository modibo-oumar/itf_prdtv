package com.lapredictive.backend.equipements;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lapredictive.backend.sous_zones.SousZones;

public interface EquipementsRepository extends JpaRepository <Equipements,Long>{
    
    List<Equipements> getEquipmentsBySousZone(SousZones souZone);
}
