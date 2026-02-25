package com.zenrelief.app.web;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping
public class GameController {

    private static final Map<String, GameMeta> GAMES = new LinkedHashMap<>();

    static {
        GAMES.put("bubble", new GameMeta("\uD83E\uDEE7", "Bubble Wrap", "Pop every bubble"));
        GAMES.put("squishy", new GameMeta("\uD83D\uDD2E", "Squishy Ball", "Press and stretch a soft ball"));
        GAMES.put("slice", new GameMeta("\u2702\uFE0F", "Slice Studio", "Infinite satisfying cuts"));
        GAMES.put("rain", new GameMeta("\uD83C\uDF27\uFE0F", "Rain Tap", "Drops and splashes like rain"));
        GAMES.put("breath", new GameMeta("\uD83E\uDEC1", "Breath Ring", "Tap with breathing rhythm"));
        GAMES.put("sand", new GameMeta("\uD83C\uDFD6\uFE0F", "Sand Flow", "Drag gravity and watch sand"));
        GAMES.put("chain", new GameMeta("\uD83E\uDDE9", "Chain Pop", "Tap 2+ adjacent same-color"));
        GAMES.put("scratch", new GameMeta("\uD83C\uDFAB", "Scratch Card", "A surprise phrase every round"));
        GAMES.put("spinner", new GameMeta("\uD83C\uDF00", "Fidget Spinner", "Flick, spin, and unwind"));
        GAMES.put("garden", new GameMeta("\uD83E\uDEB4", "Zen Garden", "Rake calm line patterns"));
        GAMES.put("doodle", new GameMeta("\u2728", "Glow Doodle", "Draw fading neon trails"));
        GAMES.put("ripple", new GameMeta("\uD83C\uDF0A", "Ripple Calm", "Tap to spread soft water ripples"));
        GAMES.put("petals", new GameMeta("\uD83C\uDF38", "Petal Drift", "Swipe to release floating petals"));
        GAMES.put("chime", new GameMeta("\uD83C\uDF90", "Wind Chime", "Tap chimes for gentle resonance"));
    }

    @GetMapping("/api/games")
    public List<GameItem> games(Locale locale) {
        return GAMES.entrySet().stream()
                .map(e -> new GameItem(e.getKey(), e.getValue().icon(), e.getValue().title(), e.getValue().subtitle()))
                .toList();
    }

    @GetMapping(value = "/api/game/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> gameApiHtml(@PathVariable String id, Locale locale) {
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(buildGameHtml(id, locale));
    }

    @GetMapping(value = "/play/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> playPage(@PathVariable String id, Locale locale) {
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(buildGameHtml(id, locale));
    }

    private String buildGameHtml(String id, Locale locale) {
        if (!GAMES.containsKey(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unknown game: " + id);
        }

        String css = readResource("gameassets/common.css");
        String commonJs = readResource("gameassets/js/common.js");
        String gameJs = readResource("gameassets/js/" + id + ".js");
        String lang = normalizeLang(locale);

        return """
                <!DOCTYPE html>
                <html lang="%s">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                  <link rel="preconnect" href="https://fonts.googleapis.com" />
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
                  <style>%s</style>
                </head>
                <body>
                  <div class="page" data-game="%s">
                    <header class="topbar">
                      <button id="back" class="btn">&larr; Back</button>
                      <h1 id="title"></h1>
                      <button id="reset" class="btn">Reset</button>
                    </header>
                    <div class="meta"><span id="meta-a"></span> <span id="meta-b"></span></div>
                    <div class="stage"><canvas id="stage" class="canvas"></canvas></div>
                    <p id="hint" class="hint"></p>
                  </div>
                  <script>window.__ZEN_BACK='/';</script>
                  <script>%s</script>
                  <script>%s</script>
                </body>
                </html>
                """.formatted(lang, css, id, commonJs, gameJs);
    }

    private static String readResource(String path) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            content = content.replace("\uFEFF", "");
            if (content.startsWith("\u00EF\u00BB\u00BF")) {
                content = content.substring(3);
            }
            return content;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot load resource: " + path, e);
        }
    }

    private static String normalizeLang(Locale locale) {
        String language = locale == null ? "en" : locale.getLanguage();
        if ("zh".equalsIgnoreCase(language)) return "zh";
        if ("ja".equalsIgnoreCase(language)) return "ja";
        return "en";
    }

    public record GameItem(String id, String icon, String title, String subtitle) {
    }

    private record GameMeta(String icon, String title, String subtitle) {
    }
}
