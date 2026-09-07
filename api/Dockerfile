# Runtime-only image: builda o jar localmente antes (./gradlew bootJar) e mande-o pronto.
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

RUN addgroup --system spring && adduser --system --ingroup spring spring
RUN mkdir -p /app/logs && chown -R spring:spring /app
USER spring:spring

COPY build/libs/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
