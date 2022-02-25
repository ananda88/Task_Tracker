FROM openjdk:11

WORKDIR /app

COPY ./target/Task-1.0.0.jar .

CMD ["java", "-jar", "Task-1.0.0.jar"]