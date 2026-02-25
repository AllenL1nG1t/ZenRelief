package com.zenrelief.app.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/games")
public class LegacyGamesBlockController {

    @GetMapping({"", "/", "/**"})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public void blockLegacyGamesRoutes() {
        // Intentionally return 404 to avoid direct game page exposure.
    }
}
