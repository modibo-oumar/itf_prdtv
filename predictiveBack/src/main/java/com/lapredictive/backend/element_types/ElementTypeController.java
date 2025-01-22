package com.lapredictive.backend.element_types;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.lapredictive.backend.element_types.dto.CreateElementTypeDto;
import com.lapredictive.backend.element_types.dto.UpdateElementTypeDto;

@RestController
public class ElementTypeController {
    private ElementTypeService elementTypeService;

    public ElementTypeController(ElementTypeService elementTypeService) {
        this.elementTypeService = elementTypeService;
    }

    @GetMapping("/elementtypes")
    public List<ElementType> getAllElementTypes() {
        return elementTypeService.getAllElementTypes();
    }

    @GetMapping("elementtype/{typeId}")
    public ElementType getElementType(@PathVariable Long typeId) {
        return elementTypeService.getElementTypeById(typeId);
    }

    @PostMapping("/admin/elementtype")
    public ElementType createElementType(@RequestBody CreateElementTypeDto CreateElementTypeDto) {
        return elementTypeService.createElementType(CreateElementTypeDto);
    }

    @PutMapping("/admin/elementtype/{typeId}")
    public ElementType updateElementType(@PathVariable Long typeId,
            @RequestBody UpdateElementTypeDto updateElementTypeDto) {
        return elementTypeService.updateElementType(typeId, updateElementTypeDto);
    }

    @DeleteMapping("/admin/elementtype/{typeId}")
    public void deleteElementType(@PathVariable Long typeId) {
        elementTypeService.deleteElementType(typeId);
    }
}
