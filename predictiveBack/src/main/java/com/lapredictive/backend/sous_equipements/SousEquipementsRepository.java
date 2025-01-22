package com.lapredictive.backend.sous_equipements;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lapredictive.backend.equipements.Equipements;

public interface SousEquipementsRepository extends JpaRepository<SousEquipements,Long>{
    
    List<SousEquipements> getUserSousEquipementsByEquipement(Equipements equipement);
}
