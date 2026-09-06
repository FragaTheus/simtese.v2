# =========================
# STAGE 1 - BUILD
# =========================
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

# Baixa as dependencias antes de copiar o codigo para aproveitar cache
RUN ./gradlew --no-daemon dependencies || true

COPY src ./src

RUN ./gradlew --no-daemon clean bootJar -x test

# =========================
# STAGE 2 - RUNTIME
# =========================
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

RUN addgroup --system spring && adduser --system --ingroup spring spring
RUN mkdir -p /app/logs && chown -R spring:spring /app
USER spring:spring

COPY --from=build /app/build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
