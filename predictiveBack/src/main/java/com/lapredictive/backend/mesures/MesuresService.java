package com.lapredictive.backend.mesures;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import com.lapredictive.backend.elements.ElementsService;
import com.lapredictive.backend.mesures.dto.CreateMesureDto;
import java.time.OffsetDateTime;

@Service
public class MesuresService {
    private final MesuresRepository mesuresRepository;
    private final ElementsService elementsService;

    public MesuresService(MesuresRepository mesuresRepository, ElementsService elementsService) {
        this.mesuresRepository = mesuresRepository;
        this.elementsService = elementsService;
    }

    public List<Mesure> getAllMesures() {
        return mesuresRepository.findAll();
    }

    public Mesure getMesure(Long id) {
        return mesuresRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Mesure non existante avec l'id: " + id));
    }

    public Mesure createMesure(CreateMesureDto createMesureDto) {
        Mesure mesure = new Mesure();
        mesure.setAcoustique(createMesureDto.getAcoustic());
        mesure.setVibratoire(createMesureDto.getVibratoire());
        mesure.setElement(elementsService.getElement(createMesureDto.getElement()));
        mesure.setTemperatureMax(createMesureDto.getTemperatureMax());
        mesure.setTemperatureMoy(createMesureDto.getTemperatureMoy());
        mesure.setTemperatureRef(createMesureDto.getTemperatureRef());
        return mesure;
    }

    public List<Mesure> getLatestMesuresByElementId(Integer elementId) {
        return mesuresRepository.findTop20ByElementIdOrderByDateDesc(elementId);
    }

    public List<Mesure> getMesuresByDateRange(Integer elementId, OffsetDateTime startDate, OffsetDateTime endDate) {
        return mesuresRepository.findByElementIdAndDateBetween(elementId, startDate, endDate);
    }

    public List<Mesure> getDetailedMesures(Integer elementId, OffsetDateTime date) {
        return mesuresRepository.findSurroundingMesures(elementId, date);
    }
}
