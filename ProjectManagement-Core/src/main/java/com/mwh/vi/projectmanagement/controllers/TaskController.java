package com.mwh.vi.projectmanagement.controllers;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mwh.vi.projectmanagement.models.Result;
import com.mwh.vi.projectmanagement.models.Task;
import com.mwh.vi.projectmanagement.services.TaskService;


@Controller
@RequestMapping("/services/task")
public class TaskController {
	
	protected static Logger logger = Logger.getLogger(TaskController.class);

	@Resource(name = "taskService")
	private TaskService taskService;
	
	
	@RequestMapping(value="/add",method = RequestMethod.PUT, headers = "Accept=application/json")
	public @ResponseBody
	Result addUser(@RequestBody Task task) {
		logger.debug("Received request to add new task");

		Result result = new Result();
		Task addedTask= null;
		try {
		    addedTask = taskService.add(task);
			result.setSuccess(true);
			result.setData(addedTask);
		} catch (Exception e) {
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		
		return result;
	}


}
