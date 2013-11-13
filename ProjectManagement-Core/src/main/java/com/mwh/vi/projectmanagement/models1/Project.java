package com.mwh.vi.projectmanagement.models1;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@XmlRootElement(name = "project")
@Document(collection="PMProjects")
public class Project {
	
	@Id
	private String id;
	private String projectName;
	private String projectCode;
	private String projectDescription;
	private Date startDate;
	private Date endDate;
	private String buyer;
	private String buyerClientDetail;
	private String revenueType;
	private String bucket;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getProjectDescription() {
		return projectDescription;
	}
	public void setProjectDescription(String projectDescription) {
		this.projectDescription = projectDescription;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getProjectCode() {
		return projectCode;
	}
	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}
	public String getBuyer() {
		return buyer;
	}
	public void setBuyer(String buyer) {
		this.buyer = buyer;
	}
	public String getBuyerClientDetail() {
		return buyerClientDetail;
	}
	public void setBuyerClientDetail(String buyerClientDetail) {
		this.buyerClientDetail = buyerClientDetail;
	}
	public String getRevenueType() {
		return revenueType;
	}
	public void setRevenueType(String revenueType) {
		this.revenueType = revenueType;
	}
	public String getBucket() {
		return bucket;
	}
	public void setBucket(String bucket) {
		this.bucket = bucket;
	}
	
	

}
