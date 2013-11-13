package com.mwh.vi.projectmanagement.repository;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

import java.util.List;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mwh.vi.projectmanagement.models1.Task;



/**
 * This is the DAO for the task functionality
 */

@Repository
public class TaskRepository {
	
	protected static Logger logger = Logger.getLogger("TaskRepository");
	
	@Inject
    private MongoTemplate mongoTemplate;
	
	
	
	public Task create(Task task){
		mongoTemplate.insert(task);
		return task;
	}
	
	public boolean update(Task task){
    	mongoTemplate.save(task);
    	return true;
    }
	
	
	public Task findById(String id) {
        return mongoTemplate.findById(id, Task.class);
    }
	
	/**
     * query to get the list of Task 
     */
    public List<Task> findByIds(List<String> taskIds){
    	return mongoTemplate.find(query(where("id").in(taskIds)),Task.class);
    }
    
    /**
     * query to get the list of Task 
     */
    public List<Task> findAll(){
    	return mongoTemplate.findAll(Task.class);
    }
    
    
   
 
}
