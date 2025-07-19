package com.cyberwallet.walletapi.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de OpenAPI/Swagger para CyberWallet.
 * Define información de la API, servidores y el esquema de seguridad para JWT.
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "CyberWallet API",
                version = "1.0",
                description = "Documentación oficial de la API REST de CyberWallet.",
                contact = @Contact(
                        name = "Equipo CyberWallet",
                        email = "soporte@cyberwallet.com",
                        url = "https://www.cyberwallet.com"
                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "http://www.apache.org/licenses/LICENSE-2.0.html"
                )
        ),
        servers = {
                @Server(
                        description = "Servidor de producción",
                        url = "https://api.cyberwallet.com"
                ),
                @Server(
                        description = "Servidor local (desarrollo)",
                        url = "http://localhost:8080"
                )
        },
        security = {
                @SecurityRequirement(name = "bearerAuth")
        }
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Autenticación basada en JSON Web Tokens. El token debe ser enviado en el encabezado 'Authorization: Bearer <token>'."
)
public class SwaggerConfig {
    // No se requiere más configuración aquí; las anotaciones manejan todo.
}
