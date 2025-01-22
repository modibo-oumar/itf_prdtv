package com.lapredictive.backend.equipements;

import com.lapredictive.backend.equipement_types.TypeEquipements;
import com.lapredictive.backend.sous_zones.SousZones;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "equipement")
public class Equipements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(length = 255, nullable = false)
    private String nom;

    @ManyToOne
    @JoinColumn(name = "id_type", nullable = false)
    private TypeEquipements type;

    @ManyToOne
    @JoinColumn(name = "id_sous_zone", nullable = false)
    private SousZones sousZone;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public TypeEquipements getType() {
        return type;
    }

    public void setType(TypeEquipements type) {
        this.type = type;
    }

    public SousZones getSousZone() {
        return sousZone;
    }

    public void setSousZone(SousZones sousZone) {
        this.sousZone = sousZone;
    }
}
