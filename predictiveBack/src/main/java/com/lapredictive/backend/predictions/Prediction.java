package com.lapredictive.backend.predictions;

import com.lapredictive.backend.mesures.Mesure;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_mesure", nullable = false)
    private Mesure idMesure;

    @Column(name = "defaut_predit", nullable = false)
    private String defautPredit;

    @Column(name = "priorite_predit", nullable = false)
    private String prioritePredit;

    @Column(name = "defaut_reel")
    private String defautReel;

    @Column(name = "priorite")
    private String priorite;

    @Column(name="probabilite")
    private Double probabilite;

    // Getters and Setters

    public Integer getId() {
        return id;
    }
    public Mesure getIdMesure() {
        return idMesure;
    }

    public void setIdMesure(Mesure idMesure) {
        this.idMesure = idMesure;
    }

    public String getDefautPredit() {
        return defautPredit;
    }

    public double getProbabilite() {
        return (probabilite != null) ? probabilite : 0.0;
    }
    
    public void setProbabilite(Double probabilite) {
        this.probabilite = probabilite;
    }
    public void setDefautPredit(String defautPredit) {
        this.defautPredit = defautPredit;
    }

    public String getPrioritePredit() {
        return prioritePredit;
    }

    public void setPrioritePredit(String prioritePredit) {
        this.prioritePredit = prioritePredit;
    }

    public String getDefautReel() {
        return defautReel;
    }

    public void setDefautReel(String defautReel) {
        this.defautReel = defautReel;
    }

    public String getPriorite() {
        return priorite;
    }

    public void setPriorite(String priorite) {
        this.priorite = priorite;
    }
}
