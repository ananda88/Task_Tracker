package com.ananda.task.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomePageController {

	@GetMapping("taskhome")
	public String homePage() {
		return "index";
	}
	
}
