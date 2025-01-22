package com.lapredictive.backend.droits;

import com.lapredictive.backend.utilisateurs.Users;
import com.lapredictive.backend.zones.Zones;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "droits")
public class Droits {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Users idUtilisateur;

    @ManyToOne
    @JoinColumn(name = "id_zone", nullable = false)
    private Zones idZone;

    public Long getId() {
        return id;
    }

    public Users getIdUtilisateur() {
        return idUtilisateur;
    }

    public void setIdUtilisateur(Users idUtilisateur) {
        this.idUtilisateur = idUtilisateur;
    }

    public Zones getIdZone() {
        return idZone;
    }

    public void setIdZone(Zones idZone) {
        this.idZone = idZone;
    }

    @Override
    public String toString() {
        return "Droits{" +
                "id=" + id +
                ", idUtilisateur=" + (idUtilisateur != null ? idUtilisateur.getId() : "null") +
                ", idZone=" + (idZone != null ? idZone.getId() : "null") +
                '}';
    }

}
