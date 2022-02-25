package com.ananda.task.controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ananda.task.TaskRepository;
import com.ananda.task.model.Comments;
import com.ananda.task.model.Task;

@RestController
@RequestMapping("/api/v1/task")
@CrossOrigin(origins = "*")
public class TaskController {
	
	@Autowired
	TaskRepository taskRepository;
	
	
	@GetMapping
	public List<Task> findAllTask(){
		return taskRepository.findAll();
	}
	
	@GetMapping("{id}")
	public Task getTask(@PathVariable String id) {
		return taskRepository.findById(id).orElse(null);
	}
	
	@PostMapping()
	public Task addTask(@RequestBody Task task) {
		task.setCreationDate(new Date());
		Task savedTask = taskRepository.save(task);
		return savedTask;
	}
	
	@PatchMapping()
	public Task updateTask(@RequestBody Task task) {
		taskRepository.findById(task.getId()).ifPresent(targetTask -> {
			targetTask.setStatus(task.getStatus());
			taskRepository.save(targetTask);
		});
		return task;
	}
	
	@PatchMapping("{id}")
	public Task updateTaskDescription(@PathVariable String id,@RequestBody Task task) {
		Task savedTask = taskRepository.findById(id).get(); 
		savedTask.setDescription(task.getDescription());
		taskRepository.save(savedTask);
		return savedTask;
	}
	
	@DeleteMapping("{id}")
	public void deleteTask(@PathVariable String id) {
		taskRepository.deleteById(id);
	}
	
	@PostMapping("{id}/comment")
	public Task addComment(@PathVariable String id, @RequestBody Comments comments) {
		Task task = taskRepository.findById(id).get();
		comments.setCreatedDate(new Date());
		task.getComments().add(comments);
		taskRepository.save(task);
		return task;
	}

}
