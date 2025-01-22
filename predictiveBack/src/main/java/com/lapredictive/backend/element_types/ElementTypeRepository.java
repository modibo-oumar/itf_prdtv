package com.lapredictive.backend.element_types;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElementTypeRepository extends JpaRepository<ElementType,Long>{
    
}
