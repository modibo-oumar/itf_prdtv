package com.lapredictive.backend.elements;

import com.lapredictive.backend.element_types.ElementType;
import com.lapredictive.backend.sous_equipements.SousEquipements;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "element")
public class Elements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    private String nom;
    
    @ManyToOne
    @JoinColumn(name = "id_type", nullable = false)
    private ElementType type;

    @ManyToOne
    @JoinColumn(name = "id_sous_equipement", nullable = false)
    private SousEquipements sousEquipement;

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

    public SousEquipements getSousEquipement() {
        return sousEquipement;
    }

    public void setSousEquipement(SousEquipements sousEquipement) {
        this.sousEquipement = sousEquipement;
    }

    public ElementType getType() {
        return type;
    }

    public void setType(ElementType type) {
        this.type = type;
    }
}
