package com.lapredictive.backend.equipement_types;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeEquipementsRepository extends JpaRepository<TypeEquipements,Long>{
    
}
