package com.ananda.task;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.ananda.task.model.*;

public interface TaskRepository extends MongoRepository<Task, String> {

}
