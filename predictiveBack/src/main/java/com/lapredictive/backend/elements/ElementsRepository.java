package com.lapredictive.backend.elements;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lapredictive.backend.sous_equipements.SousEquipements;

public interface ElementsRepository extends JpaRepository<Elements,Long>{
    

    List<Elements> getUserElementsBySousEquipement(SousEquipements sousEquipement);
}
