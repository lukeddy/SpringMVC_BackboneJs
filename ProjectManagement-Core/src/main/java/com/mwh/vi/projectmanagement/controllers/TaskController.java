package com.mwh.vi.projectmanagement.controllers;

import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mwh.vi.projectmanagement.dtos.TaskDTO;
import com.mwh.vi.projectmanagement.models1.Result;
import com.mwh.vi.projectmanagement.models1.Task;
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
	
	@RequestMapping(value="/listAll",method = RequestMethod.GET, headers = "Accept=application/json")
	public @ResponseBody
	Result getAllTask() {
		logger.debug("Received request to list all task");

		Result result = new Result();
		List<TaskDTO> taskList= null;
		try {
			taskList = taskService.getAllTask();
			result.setSuccess(true);
			result.setData(taskList);
		} catch (Exception e) {
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		
		return result;
	}


}
