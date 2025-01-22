package com.lapredictive.backend.zones;

import com.lapredictive.backend.societes.Society;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "zone")
public class Zones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment primary key
    private Long id;

    @Column(length = 255, nullable = false)
    private String nom;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "id_societe", nullable = false)
    private Society societe;

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

    public Society getSociete() {
        return societe;
    }

    public void setSociete(Society societe) {
        this.societe = societe;
    }

    @Override
    public String toString() {
        return "Zones{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", societe=" + (societe != null ? societe.getId() : "null") +
                '}';
    }
}
