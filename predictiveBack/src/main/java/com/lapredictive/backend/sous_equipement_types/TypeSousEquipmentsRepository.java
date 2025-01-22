package com.lapredictive.backend.sous_equipement_types;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeSousEquipmentsRepository extends JpaRepository<TypeSousEquipments,Long>{
    
}
