package com.lapredictive.backend.elements;

import com.lapredictive.backend.element_types.ElementTypeService;
import com.lapredictive.backend.elements.dto.CreateElementDto;
import com.lapredictive.backend.elements.dto.UpdateElementDto;
import com.lapredictive.backend.predictions.Prediction;
import com.lapredictive.backend.predictions.PredictionsService;
import com.lapredictive.backend.sous_equipements.SousEquipements;
import com.lapredictive.backend.sous_equipements.SousEquipementsService;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ElementsService {

    private ElementsRepository elementRepository;
    private SousEquipementsService sousEquipementsService;
    private PredictionsService predictionsService;
    private ElementTypeService elementTypeService;

    public ElementsService(ElementsRepository elementRepository, SousEquipementsService sousEquipementsService,
            PredictionsService predictionsService, ElementTypeService elementTypeService) {
        this.elementRepository = elementRepository;
        this.sousEquipementsService = sousEquipementsService;
        this.predictionsService = predictionsService;
        this.elementTypeService = elementTypeService;
    }

    public List<Elements> getAllElements() {
        return elementRepository.findAll();
    }

    public Elements getElement(Long id) {
        return elementRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Element non existant avec l'id: " + id));
    }

    public List<Elements> getUserElements(Long userId) {
        List<SousEquipements> userSousEquipements = sousEquipementsService.getUserSousEquipements(userId);
        List<Elements> userElements = new ArrayList<>();
        for (SousEquipements sousEquipement : userSousEquipements){
            for(Elements element : elementRepository.getUserElementsBySousEquipement(sousEquipement)){
                if (element.getSousEquipement().getId() == sousEquipement.getId()){
                    userElements.add(element);
                }
            }
        }
        return userElements;
    }

    public Elements createElement(CreateElementDto createElementDto) {
        SousEquipements sousEquipement = sousEquipementsService
                .getSousEquipement(createElementDto.getSousEquipementId());

        Elements element = new Elements();
        element.setNom(createElementDto.getNom());
        element.setType(elementTypeService.getElementTypeById(createElementDto.getType()));
        element.setSousEquipement(sousEquipement);

        return elementRepository.save(element);
    }

    public Elements updateElement(Long id, UpdateElementDto updateElementDto) {
        Elements existingElement = elementRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Element non existant avec l'id: " + id));

        existingElement.setNom(updateElementDto.getNom());
        existingElement.setType(elementTypeService.getElementTypeById(updateElementDto.getType()));

        SousEquipements sousEquipement = sousEquipementsService
                .getSousEquipement(updateElementDto.getSousEquipementId());
        existingElement.setSousEquipement(sousEquipement);

        return elementRepository.save(existingElement);
    }

    public void deleteElement(Long id) {
        elementRepository.deleteById(id);
    }

    public Prediction getLatestPredictionByElementId(Long elementId) {
        return predictionsService.getLatestPredictionByElementId(elementId);
    }

    // public List<Elements> getUserElements(Long userId){

    // }
}
