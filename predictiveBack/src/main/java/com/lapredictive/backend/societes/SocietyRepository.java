package com.lapredictive.backend.societes;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {

    Optional<Society> findById(Long id);

    Optional<Society> findByName(String name);
}
