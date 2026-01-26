# Build stage
FROM eclipse-temurin:21-jre AS build

WORKDIR /app

COPY pom.xml mvnw ./
COPY .mvn .mvn/
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY . .
RUN ./mvnw package -DskipTests

# Runtime stage
FROM openjdk:21-jre-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
