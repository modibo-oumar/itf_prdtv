package com.lapredictive.backend.mesures;

import org.hibernate.annotations.CreationTimestamp;

import com.lapredictive.backend.elements.Elements;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "mesures")
public class Mesure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_element", nullable = false)
    private Elements element;

    @CreationTimestamp
    @Column(name = "date")
    private OffsetDateTime date; // Changed to OffsetDateTime

    @Column(name = "acoustique")
    private Double acoustique;

    @Column(name = "vibratoire")
    private Double vibratoire;

    @Column(name = "temperature_max")
    private Double temperatureMax;

    @Column(name = "temperature_ref")
    private Double temperatureRef;

    @Column(name = "temperature_moy")
    private Double temperatureMoy;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public Elements getElement() {
        return element;
    }

    public void setElement(Elements element) {
        this.element = element;
    }

    public OffsetDateTime getDate() {
        return date;
    }

    public void setDate(OffsetDateTime date) {
        this.date = date;
    }

    public Double getAcoustique() {
        return acoustique;
    }

    public void setAcoustique(Double acoustique) {
        this.acoustique = acoustique;
    }

    public Double getVibratoire() {
        return vibratoire;
    }

    public void setVibratoire(Double vibratoire) {
        this.vibratoire = vibratoire;
    }

    public Double getTemperatureMax() {
        return temperatureMax;
    }

    public void setTemperatureMax(Double temperatureMax) {
        this.temperatureMax = temperatureMax;
    }

    public Double getTemperatureRef() {
        return temperatureRef;
    }

    public void setTemperatureRef(Double temperatureRef) {
        this.temperatureRef = temperatureRef;
    }

    public Double getTemperatureMoy() {
        return temperatureMoy;
    }

    public void setTemperatureMoy(Double temperatureMoy) {
        this.temperatureMoy = temperatureMoy;
    }

}
