package com.lapredictive.backend.zones;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lapredictive.backend.societes.Society;


public interface ZoneRepository extends JpaRepository<Zones, Long> {

    List<Zones> findBySociete(Society societe);
}
