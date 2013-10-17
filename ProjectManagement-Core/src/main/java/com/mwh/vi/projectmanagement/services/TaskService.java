package com.mwh.vi.projectmanagement.services;

import javax.xml.bind.ValidationException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mwh.vi.projectmanagement.exceptions.DuplicateEntityException;
import com.mwh.vi.projectmanagement.models.Task;
import com.mwh.vi.projectmanagement.repository.TaskRepository;



/**
 * Task functionality related services
 * 
 */

@Service("taskService")
public class TaskService {
	
	protected static Logger logger = Logger.getLogger(TaskService.class);
	
	@Autowired
	private TaskRepository taskRepository;
	
	
	
	public Task add(Task task) throws ValidationException, DuplicateEntityException{
		validateTask(task);
		checkForDuplicate(task);
		taskRepository.create(task);
		return task;
	}
	
	
	
	/**
	 * Validates the task
	 * 
	 * @param task
	 * @throws ValidationException
	 */
	private void validateTask(Task task) throws ValidationException {
		// FIXME - Add data format validation also
		StringBuilder sb = new StringBuilder();
		if (null == task.getProjectId()) {
			sb.append("Project Id is missing. Project Id is a required field. ");
		}
		if (sb.length() > 0) {
			throw new ValidationException(sb.toString());
		}
	}
	
	
	
	/**
	 * Checks if the task is an duplicate entry
	 * 
	 * @param task
	 * @throws DuplicateEntityException
	 */
	private void checkForDuplicate(Task newTask)
			throws DuplicateEntityException{
		Task existingTask = null;
		String id = newTask.getId();
		
		if (null != id) {
			existingTask = taskRepository.findById(id);
			if (null != existingTask) {
				throw new DuplicateEntityException(
						"The Task already existing in the system");
			}
		}
	}
	

}
