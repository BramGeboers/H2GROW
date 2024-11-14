package be.ucll.se.team19backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Team19BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(Team19BackendApplication.class, args);
	}

}