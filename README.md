# Zen Relief (Spring Boot)

Zen Relief has been refactored into a Java Spring Boot project.

## Tech Stack

- Java 21
- Spring Boot 3 (Web)
- Maven
- Static frontend assets served from Spring (`src/main/resources/static`)

## Project Structure

- `pom.xml` - Maven + Spring Boot build config
- `src/main/java/com/zenrelief/app/ZenReliefApplication.java` - application entry
- `src/main/java/com/zenrelief/app/web/GameController.java` - game list + game content API
- `src/main/java/com/zenrelief/app/web/LegacyGamesBlockController.java` - blocks legacy `/games/**` direct routes
- `src/main/resources/application.properties` - app config
- `src/main/resources/static/index.html` - single-page shell
- `src/main/resources/static/index.js` - load game list + load selected game
- `src/main/resources/static/style.css` - shell styles
- `src/main/resources/gameassets/common.css` - shared game css
- `src/main/resources/gameassets/js/common.js` - shared i18n/sfx/best-score helpers
- `src/main/resources/gameassets/js/*.js` - game-specific logic (served through Java API)

## Built-in Games

- Bubble Wrap
- Squishy Ball
- Slice Studio (infinite cutting)
- Rain Tap
- Breath Ring
- Sand Flow
- Chain Pop
- Scratch Card
- Fidget Spinner
- Zen Garden
- Glow Doodle
- Ripple Calm
- Petal Drift
- Wind Chime

Each game is an independent JS file under `src/main/resources/gameassets/js/` for easier maintenance.

## Language Support

- Auto-detects device/browser language via `navigator.languages` and `Accept-Language`.
- Supported locales: Chinese (`zh`), English (`en`), Japanese (`ja`).
- Home page game list and in-game labels/hints/surprise phrases are localized.

## Run

```bash
mvn spring-boot:run
```

Open: `http://localhost:8080`

## Build Jar

```bash
mvn clean package
java -jar target/zen-relief-1.0.0.jar
```

## Notes

- The app now keeps the browser URL at `/` while switching games inside the page.
- Game loading is done by Java API (`/api/game/{id}`), not direct page navigation.
- Legacy direct game routes (`/games/**`) are blocked to reduce URL exposure.

## License

MIT
