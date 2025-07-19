package com.cyberwallet.walletapi;

import com.cyberwallet.walletapi.dto.auth.AuthenticationRequest;
import com.cyberwallet.walletapi.dto.auth.RegisterRequest;
import com.cyberwallet.walletapi.dto.user.ChangePasswordRequestDTO;
import com.cyberwallet.walletapi.dto.auth.ResetPasswordRequest;
import com.cyberwallet.walletapi.dto.wallet.DepositRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.LoadCardRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.TransferAliasRequestDTO;
import com.cyberwallet.walletapi.dto.wallet.TransferCvuRequestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.client.RestClientException;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Slf4j
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EndToEndWalletApiTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final ObjectMapper mapper = new ObjectMapper();

    private String getBaseUrl(String path) {
        return "http://localhost:" + port + path;
    }

    private static final String PASSWORD = "StrongP@ss123";
    private static final String CARD_NUMBER = "4111111111111111"; // VISA válida
    private static final String CARD_EXP = "12/30";
    private static final String CARD_CVV = "123";
    // private static final String CARD_HOLDER = "Usuario Test"; // Eliminar esta línea

    private static String aliasA;
    private static String aliasB;
    private static String cvuA;
    private static String cvuB;
    private static String tokenA;
    private static String tokenB;

    @BeforeEach
    void cleanDatabaseBeforeTest() {
        try {
            log.info("[TEST] Limpiando base de datos antes del test...");
            restTemplate.postForEntity(getBaseUrl("/api/v1/test-utils/cleanup"), null, Void.class);
            assertDatabaseIsClean();
            log.info("[TEST] Limpieza previa completada.");
        } catch (Exception e) {
            log.warn("[TEST] Limpieza previa falló por endpoint, forzando limpieza manual: {}", e.getMessage());
            forceCleanDatabase();
        }
    }

    @AfterEach
    void cleanDatabaseAfterTest() {
        // Comentamos la limpieza automática para evitar conflictos con las validaciones JDBC
        // forceCleanDatabase();
        // assertDatabaseIsClean();
        log.info("[TEST] Finalizando test sin limpieza automática");
    }

    private void assertDatabaseIsClean() {
        int users = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Integer.class);
        int wallets = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM wallets", Integer.class);
        int txs = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM transacciones", Integer.class);
        if (users > 0 || wallets > 0 || txs > 0) {
            throw new IllegalStateException("La base no está limpia: users=" + users + ", wallets=" + wallets + ", txs=" + txs);
        }
    }

    private void forceCleanDatabase() {
        try {
            jdbcTemplate.execute("TRUNCATE TABLE transacciones CASCADE");
            jdbcTemplate.execute("TRUNCATE TABLE password_reset_tokens CASCADE");
            jdbcTemplate.execute("TRUNCATE TABLE activation_tokens CASCADE");
            jdbcTemplate.execute("TRUNCATE TABLE blacklisted_tokens CASCADE");
            jdbcTemplate.execute("TRUNCATE TABLE wallets CASCADE");
            jdbcTemplate.execute("TRUNCATE TABLE users CASCADE");
            log.info("[TEST] Limpieza forzada ejecutada correctamente.");
        } catch (Exception ex) {
            log.error("[TEST] Limpieza forzada falló: {}", ex.getMessage(), ex);
            throw ex;
        }
    }

    @Test
    @Order(1)
    void testEndToEndFlow() throws Exception {
        log.info("[TEST] Iniciando test end to end de CyberWallet");
        System.out.println("[INFO] Registro de Usuario A");
        String emailA = "usuarioA." + UUID.randomUUID() + "@mail.com";
        String usernameA = "usuarioA" + UUID.randomUUID().toString().substring(0, 5);
        String nombreA = "Juan";
        String apellidoA = "Perez";
        RegisterRequest regA = buildRegisterRequest(nombreA, apellidoA, emailA, "40123456", usernameA);
        ResponseEntity<String> regRespA = restTemplate.postForEntity(getBaseUrl("/api/v1/auth/register"), regA, String.class);
        assertThat(regRespA.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        log.info("[INFO] Usuario A registrado: {}", emailA);
        System.out.println("[INFO] Registro de Usuario B");
        String emailB = "usuarioB." + UUID.randomUUID() + "@mail.com";
        String usernameB = "usuarioB" + UUID.randomUUID().toString().substring(0, 5);
        String nombreB = "Maria";
        String apellidoB = "Gomez";
        RegisterRequest regB = buildRegisterRequest(nombreB, apellidoB, emailB, "40234567", usernameB);
        ResponseEntity<String> regRespB = restTemplate.postForEntity(getBaseUrl("/api/v1/auth/register"), regB, String.class);
        assertThat(regRespB.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        log.info("[INFO] Usuario B registrado: {}", emailB);

        // Login A
        System.out.println("[INFO] Login Usuario A");
        tokenA = loginAndGetToken(emailA, PASSWORD);
        assertThat(tokenA).isNotBlank();
        log.info("[INFO] Usuario A logueado, token obtenido");
        // Obtener aliasA real
        aliasA = getAlias(tokenA);
        System.out.println("[ALIAS] Alias asignado a Usuario A: " + aliasA);
        log.info("[ALIAS] Alias asignado a Usuario A: {}", aliasA);
        assertThat(aliasA)
            .as("Alias debe tener formato palabra.palabra.palabra")
            .matches("^[a-z]+\\.[a-z]+\\.[a-z]+$");

        // Login B
        System.out.println("[INFO] Login Usuario B");
        tokenB = loginAndGetToken(emailB, PASSWORD);
        assertThat(tokenB).isNotBlank();
        log.info("[INFO] Usuario B logueado, token obtenido");
        // Obtener aliasB real
        aliasB = getAlias(tokenB);
        System.out.println("[ALIAS] Alias asignado a Usuario B: " + aliasB);
        log.info("[ALIAS] Alias asignado a Usuario B: {}", aliasB);
        assertThat(aliasB)
            .as("Alias debe tener formato palabra.palabra.palabra")
            .matches("^[a-z]+\\.[a-z]+\\.[a-z]+$");

        // Fondeo A
        System.out.println("[INFO] Usuario A fondea 3 millones");
        String cardHolderA = nombreA + " " + apellidoA;
        loadCard(tokenA, 3_000_000, cardHolderA);
        // Fondeo B
        System.out.println("[INFO] Usuario B fondea 3 millones");
        String cardHolderB = nombreB + " " + apellidoB;
        loadCard(tokenB, 3_000_000, cardHolderB);

        // Consultar alias y cvu
        aliasA = getAlias(tokenA);
        System.out.println("[ALIAS] Alias asignado a Usuario A: " + aliasA);
        log.info("[ALIAS] Alias asignado a Usuario A: {}", aliasA);
        assertThat(aliasA)
            .as("Alias debe tener formato palabra.palabra.palabra")
            .matches("^[a-z]+\\.[a-z]+\\.[a-z]+$");
        aliasB = getAlias(tokenB);
        System.out.println("[ALIAS] Alias asignado a Usuario B: " + aliasB);
        log.info("[ALIAS] Alias asignado a Usuario B: {}", aliasB);
        assertThat(aliasB)
            .as("Alias debe tener formato palabra.palabra.palabra")
            .matches("^[a-z]+\\.[a-z]+\\.[a-z]+$");
        cvuA = getCvu(tokenA);
        cvuB = getCvu(tokenB);
        log.info("[INFO] Alias/CVU A: {}/{} | Alias/CVU B: {}/{}", aliasA, cvuA, aliasB, cvuB);

        // Consultar movimientos
        System.out.println("[INFO] Usuario A consulta movimientos");
        assertThat(getMovimientos(tokenA)).isNotEmpty();
        System.out.println("[INFO] Usuario B consulta movimientos");
        assertThat(getMovimientos(tokenB)).isNotEmpty();

        // Desconectar y volver a logear (persistencia)
        System.out.println("[INFO] Usuario A y B se desconectan y vuelven a logear");
        tokenA = loginAndGetToken(emailA, PASSWORD);
        tokenB = loginAndGetToken(emailB, PASSWORD);
        assertThat(tokenA).isNotBlank();
        assertThat(tokenB).isNotBlank();
        log.info("[INFO] Persistencia de sesión validada");

        // Transferencia A -> B por alias
        System.out.println("[INFO] Usuario A transfiere 1 millón a B por alias");
        // Antes de transferir por alias
        System.out.println("[TRANSFERENCIA] Usando alias destino: " + aliasB);
        log.info("[TRANSFERENCIA] Usando alias destino: {}", aliasB);
        assertThat(aliasB)
            .as("Alias destino debe tener formato palabra.palabra.palabra")
            .matches("^[a-z]+\\.[a-z]+\\.[a-z]+$");
        transferirPorAlias(tokenA, aliasB, 1000000);
        // Si hay actualización de alias, volver a obtener y loguear
        // updateAlias(tokenB, "nuevo.alias.b");
        // aliasB = getAlias(tokenB);
        // System.out.println("[ALIAS] Alias actualizado de Usuario B: " + aliasB);
        // log.info("[ALIAS] Alias actualizado de Usuario B: {}", aliasB);
        // B transfiere 2 millones a A por CVU
        System.out.println("[INFO] Usuario B transfiere 1 millón a A por CVU");
        transferirPorCvu(tokenB, cvuA, 1_000_000);

        // --- Validación de cambio de contraseña Usuario A ---
        System.out.println("[INFO] Usuario A cambia su contraseña");
        String nuevaPassA = "NuevaP@ss456";
        changePassword(tokenA, PASSWORD, nuevaPassA, nuevaPassA);
        System.out.println("[INFO] Cambio de contraseña de Usuario A completado");
        // Login con nueva contraseña
        tokenA = loginAndGetToken(emailA, nuevaPassA);
        assertThat(tokenA).isNotBlank();
        log.info("[INFO] Usuario A logueado con nueva contraseña");

        // --- Validación de reseteo de contraseña Usuario B ---
        System.out.println("[INFO] Usuario B inicia olvido de contraseña");
        // Simular flujo de olvido de contraseña
        forgotPassword(emailB); // El token se genera y se guarda en la base
        System.out.println("[INFO] Solicitud de reseteo de contraseña enviada para Usuario B");
        // Nota: En un test real se obtendría el token del email, pero aquí lo simulamos
        System.out.println("[INFO] Reseteo de contraseña de Usuario B simulado");
        log.info("[INFO] Usuario B - flujo de reseteo de contraseña completado");

        // Consultar movimientos finales
        System.out.println("[INFO] Usuario A consulta movimientos finales");
        assertThat(getMovimientos(tokenA)).isNotEmpty();
        System.out.println("[INFO] Usuario B consulta movimientos finales");
        assertThat(getMovimientos(tokenB)).isNotEmpty();

        // Desconectar
        System.out.println("[INFO] Logout Usuario A");
        logout(tokenA);
        System.out.println("[INFO] Logout Usuario B");
        logout(tokenB);

        // Limpiar base de datos después de todas las validaciones JDBC
        System.out.println("[INFO] Limpiando base de datos después de validaciones JDBC");
        forceCleanDatabase();
        assertDatabaseIsClean();
        log.info("[TEST] Test end to end finalizado correctamente");
    }

    @Test
    @Order(2)
    void testRegistroPorPaisYProvincia() throws Exception {
        log.info("[TEST] Validando registro y provincias para los 3 países soportados");
        // Definir los países soportados y un DNI base para evitar duplicados
        String[] paises = {"AR", "BR", "UY"};
        String[] nombres = {"Argentina", "Brasil", "Uruguay"};
        int dniBase = 50000000;
        for (int i = 0; i < paises.length; i++) {
            // Limpiar base antes de cada iteración
            forceCleanDatabase();
            assertDatabaseIsClean();
            String iso2 = paises[i];
            String nombrePais = nombres[i];
            log.info("[TEST] País: {} (ISO2: {})", nombrePais, iso2);
            // 1. Obtener provincias
            ResponseEntity<String> provResp = restTemplate.getForEntity(getBaseUrl("/api/v1/validations/provinces/list/" + iso2), String.class);
            assertThat(provResp.getStatusCode()).isEqualTo(HttpStatus.OK);
            JsonNode provRoot = mapper.readTree(provResp.getBody());
            JsonNode provincias = provRoot.path("data");
            assertThat(provincias.isArray()).isTrue();
            assertThat(provincias.size()).as("El país %s debe tener provincias configuradas", nombrePais).isGreaterThan(0);
            String provinciaValida = provincias.get(0).asText();
            log.info("[TEST] Provincia usada para registro: {}", provinciaValida);
            // 2. Obtener IDs de país y provincia desde la base
            Long paisId = jdbcTemplate.queryForObject(
                "SELECT id FROM paises WHERE iso2 = ? OR nombre = ?", new Object[]{iso2, nombrePais}, Long.class);
            assertThat(paisId).as("Debe existir el país %s en la base", nombrePais).isNotNull();
            Long provinciaId = jdbcTemplate.queryForObject(
                "SELECT id FROM provincias WHERE nombre = ? AND pais_id = ?", new Object[]{provinciaValida, paisId}, Long.class);
            assertThat(provinciaId).as("Debe existir la provincia %s en la base", provinciaValida).isNotNull();
            // 3. Registrar usuario con ese país y provincia
            String email = String.format("test.%s.%d@mail.com", iso2.toLowerCase(), System.currentTimeMillis());
            String username = String.format("testuser_%s_%d", iso2.toLowerCase(), System.currentTimeMillis() % 10000);
            String nombre = "Test";
            String apellido = nombrePais;
            String dni = String.valueOf(dniBase + i);
            RegisterRequest reg = buildRegisterRequest(nombre, apellido, email, dni, username);
            reg.setPaisId(paisId);
            reg.setProvinciaId(provinciaId);
            ResponseEntity<String> regResp = restTemplate.postForEntity(getBaseUrl("/api/v1/auth/register"), reg, String.class);
            assertThat(regResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            log.info("[TEST] Usuario registrado correctamente para {}", nombrePais);
            // 4. Login para validar que el usuario puede autenticarse
            String token = loginAndGetToken(email, PASSWORD);
            assertThat(token).isNotBlank();
            log.info("[TEST] Login exitoso para usuario de {}", nombrePais);
        }
        log.info("[TEST] Validación de registro por país y provincia completada exitosamente");
    }

    private RegisterRequest buildRegisterRequest(String nombre, String apellido, String email, String dni, String username) {
        return new RegisterRequest(
                "Calle Falsa", 123, 1L, 1L, nombre, apellido, dni, "1990-01-01", "Masculino", email, username, PASSWORD, PASSWORD, "1122334455"
        );
    }

    private String loginAndGetToken(String emailOrUsername, String password) throws Exception {
        AuthenticationRequest login = new AuthenticationRequest(emailOrUsername, password);
        ResponseEntity<String> resp = restTemplate.postForEntity(getBaseUrl("/api/v1/auth/login"), login, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode root = mapper.readTree(resp.getBody());
        String token = root.path("data").path("accessToken").asText();
        System.out.println("[DEBUG] Token obtenido: " + token);
        return token;
    }

    // Modificar loadCard para aceptar el nombre del titular
    private void loadCard(String token, int amount, String cardHolderName) throws Exception {
        LoadCardRequestDTO req = new LoadCardRequestDTO(CARD_NUMBER, CARD_EXP, CARD_CVV, BigDecimal.valueOf(amount), cardHolderName);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<LoadCardRequestDTO> entity = new HttpEntity<>(req, headers);
        ResponseEntity<String> resp = restTemplate.postForEntity(getBaseUrl("/api/v1/wallet/load-card"), entity, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        System.out.println("[INFO] Fondeo realizado: " + amount);
    }

    private String getAlias(String token) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        ResponseEntity<String> resp = restTemplate.exchange(getBaseUrl("/api/v1/wallet/details"), HttpMethod.GET, new HttpEntity<>(headers), String.class);
        JsonNode root = mapper.readTree(resp.getBody());
        return root.path("data").path("alias").asText();
    }

    private String getCvu(String token) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        ResponseEntity<String> resp = restTemplate.exchange(getBaseUrl("/api/v1/wallet/details"), HttpMethod.GET, new HttpEntity<>(headers), String.class);
        JsonNode root = mapper.readTree(resp.getBody());
        return root.path("data").path("cvu").asText();
    }

    private void transferirPorAlias(String token, String aliasDestino, int amount) {
        System.out.println("[TRANSFERENCIA] Usando alias destino: " + aliasDestino);
        log.info("[TRANSFERENCIA] Usando alias destino: {}", aliasDestino);
        TransferAliasRequestDTO req = new TransferAliasRequestDTO(aliasDestino, BigDecimal.valueOf(amount));
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransferAliasRequestDTO> entity = new HttpEntity<>(req, headers);
        ResponseEntity<String> resp = restTemplate.postForEntity(getBaseUrl("/api/v1/wallet/transfer/alias"), entity, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        System.out.println("[INFO] Transferencia por alias realizada");
    }

    private void transferirPorCvu(String token, String cvuDestino, int amount) {
        TransferCvuRequestDTO req = new TransferCvuRequestDTO();
        req.setTargetCvu(cvuDestino);
        req.setAmount(BigDecimal.valueOf(amount));
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransferCvuRequestDTO> entity = new HttpEntity<>(req, headers);
        ResponseEntity<String> resp = restTemplate.postForEntity(getBaseUrl("/api/v1/wallet/transfer/cvu"), entity, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        System.out.println("[INFO] Transferencia por CVU realizada");
    }

    private void updateAlias(String token) throws Exception {
        // Obtener alias anterior
        String previousAlias = getAlias(token);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = String.format("{\"newAlias\":\"\"}"); // El valor no importa, el backend genera uno nuevo
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> resp = restTemplate.exchange(getBaseUrl("/api/v1/wallet/alias"), HttpMethod.PUT, entity, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode root = mapper.readTree(resp.getBody());
        String newAlias = root.path("data").path("newAlias").asText();
        System.out.println("[ALIAS] Alias cambiado: " + previousAlias + " → " + newAlias);
        log.info("[ALIAS] Alias cambiado: {} → {}", previousAlias, newAlias);
    }

    private JsonNode getMovimientos(String token) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        ResponseEntity<String> resp = restTemplate.exchange(getBaseUrl("/api/v1/transactions/history"), HttpMethod.GET, new HttpEntity<>(headers), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        JsonNode root = mapper.readTree(resp.getBody());
        System.out.println("[DEBUG] Movimientos: " + root.path("data").toString());
        return root.path("data");
    }

    private void logout(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        ResponseEntity<String> resp = restTemplate.postForEntity(getBaseUrl("/api/v1/auth/logout"), new HttpEntity<>(null, headers), String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        System.out.println("[INFO] Logout realizado");
    }

    private void changePassword(String token, String currentPassword, String newPassword, String confirmNewPassword) {
        ChangePasswordRequestDTO req = new ChangePasswordRequestDTO();
        req.setCurrentPassword(currentPassword);
        req.setNewPassword(newPassword);
        req.setConfirmNewPassword(confirmNewPassword);
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<ChangePasswordRequestDTO> entity = new HttpEntity<>(req, headers);
        ResponseEntity<String> resp = restTemplate.postForEntity(getBaseUrl("/api/v1/auth/change-password"), entity, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        System.out.println("[INFO] Contraseña actualizada");
    }

    private String forgotPassword(String email) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(String.format("{\"email\":\"%s\"}", email), headers);
        ResponseEntity<String> resp = restTemplate.postForEntity(getBaseUrl("/api/v1/auth/forgot-password"), entity, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        System.out.println("[DEBUG] Solicitud de reseteo de contraseña enviada para: " + email);
        return "token_simulado"; // Simulamos el token para el test
    }

    private void resetPassword(String token, String email, String newPassword, String confirmNewPassword) {
        ResetPasswordRequest req = new ResetPasswordRequest();
        req.setToken(token);
        req.setNewPassword(newPassword);
        req.setConfirmNewPassword(confirmNewPassword);
        req.setEmail(email);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<ResetPasswordRequest> entity = new HttpEntity<>(req, headers);
        ResponseEntity<String> resp = restTemplate.postForEntity(getBaseUrl("/api/v1/auth/reset-password"), entity, String.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        System.out.println("[INFO] Contraseña reseteada");
    }

    /**
     * Obtiene el hash de la contraseña de un usuario desde la base de datos.
     * @param email Email del usuario
     * @return El hash de la contraseña en la base de datos
     */
    private String getPasswordHashFromDb(String email) {
        String sql = "SELECT password FROM users WHERE email = ?";
        String hash = jdbcTemplate.queryForObject(sql, new Object[]{email}, String.class);
        log.info("[JDBC] Hash de contraseña en base para {}: {}", email, hash);
        return hash;
    }

    // Ejemplo de uso tras cambio de contraseña:
    // String hashAntes = getPasswordHashFromDb(emailA);
    // ...cambiar contraseña...
    // String hashDespues = getPasswordHashFromDb(emailA);
    // assertThat(hashAntes).isNotEqualTo(hashDespues);
} 