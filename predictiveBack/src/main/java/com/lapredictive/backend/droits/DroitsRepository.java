package com.lapredictive.backend.droits;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lapredictive.backend.utilisateurs.Users;

@Repository
public interface DroitsRepository extends JpaRepository<Droits, Long> {

    List<Droits> findByIdUtilisateur(Users idUtilisateur);
}
