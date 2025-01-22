package com.lapredictive.backend.sous_equipements;

import com.lapredictive.backend.equipements.Equipements;
import com.lapredictive.backend.sous_equipement_types.TypeSousEquipments;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "sous_equipement")
public class SousEquipements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @ManyToOne
    @JoinColumn(name = "id_type")
    private TypeSousEquipments type;

    @ManyToOne
    @JoinColumn(name = "id_equipement", nullable = false)
    private Equipements equipement;

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

    public TypeSousEquipments getType() {
        return type;
    }

    public void setType(TypeSousEquipments type) {
        this.type = type;
    }

    public Equipements getEquipement() {
        return equipement;
    }

    public void setEquipement(Equipements equipement) {
        this.equipement = equipement;
    }
}
