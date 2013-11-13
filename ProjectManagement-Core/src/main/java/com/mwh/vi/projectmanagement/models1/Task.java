package com.mwh.vi.projectmanagement.models;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Model Object representing an PM User
 * 
 */

@XmlRootElement(name = "task")
@Document(collection="PMTasks")
public class Task {
	
	@Id
	private String id;
	private String userId;
	private String projectId;
	private String phase;
	private String hours;
	private Date weekEndDate;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getPhase() {
		return phase;
	}
	public void setPhase(String phase) {
		this.phase = phase;
	}
	public String getHours() {
		return hours;
	}
	public void setHours(String hours) {
		this.hours = hours;
	}
	public Date getWeekEndDate() {
		return weekEndDate;
	}
	public void setWeekEndDate(Date weekEndDate) {
		this.weekEndDate = weekEndDate;
	}
	
	
	
	
	
	
	

}
