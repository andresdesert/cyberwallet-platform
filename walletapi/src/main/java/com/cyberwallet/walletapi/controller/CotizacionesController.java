package com.cyberwallet.walletapi.controller;

import com.cyberwallet.walletapi.dto.response.ApiResponse;
import com.cyberwallet.walletapi.service.DollarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cotizaciones")
@RequiredArgsConstructor
@Tag(name = "Cotizaciones", description = "API para consultar cotizaciones del dólar")
public class CotizacionesController {

    private final DollarService dollarService;

    @Operation(summary = "Obtener cotizaciones del dólar", description = "Devuelve las cotizaciones actuales del dólar de diferentes fuentes")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCotizaciones() {
        List<Map<String, Object>> cotizaciones = dollarService.getDollarRates();
        return ResponseEntity.ok(ApiResponse.success("Cotizaciones obtenidas correctamente.", cotizaciones));
    }
}
