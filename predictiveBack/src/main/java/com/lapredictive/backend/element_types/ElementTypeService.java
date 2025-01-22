package com.lapredictive.backend.element_types;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lapredictive.backend.element_types.dto.CreateElementTypeDto;
import com.lapredictive.backend.element_types.dto.UpdateElementTypeDto;

@Service
public class ElementTypeService {
    private ElementTypeRepository elementTypeRepository;

    public ElementTypeService(ElementTypeRepository elementTypeRepository) {
        this.elementTypeRepository = elementTypeRepository;
    }

    public List<ElementType> getAllElementTypes() {
        return elementTypeRepository.findAll();
    }

    public ElementType getElementTypeById(Long id) {
        return elementTypeRepository.findById(id).orElse(null);
    }

    public ElementType createElementType(CreateElementTypeDto createElementTypeDto) {
        ElementType type = new ElementType();
        type.setNom(createElementTypeDto.getNom());

        return elementTypeRepository.save(type);
    }

    public ElementType updateElementType(Long id, UpdateElementTypeDto updateElementTypeDto) {
        ElementType type = elementTypeRepository.findById(id).orElse(null);

        type.setNom(updateElementTypeDto.getNom());
        return elementTypeRepository.save(type);
    }

    public void deleteElementType(Long id) {
        elementTypeRepository.deleteById(id);
    }
}
