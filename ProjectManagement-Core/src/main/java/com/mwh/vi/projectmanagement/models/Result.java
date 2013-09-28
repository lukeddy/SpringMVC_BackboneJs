/**
 * 
 */
package com.mwh.vi.projectmanagement.models;

import javax.xml.bind.annotation.XmlRootElement;


/**
 * All web service calls return a Result object, which will then be converted to JSON.
 * This is done for easy-to-understand contract of web services.
 */
@XmlRootElement
public class Result {

	private boolean success;
	private String errorString;
	private Object data;
	/**
	 * @return the success
	 */
	public boolean isSuccess() {
		return success;
	}
	
	/**
	 * @param success the success to set
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}
	/**
	 * @return the errorString
	 */
	public String getErrorString() {
		return errorString;
	}
	/**
	 * @param errorString the errorString to set
	 */
	public void setErrorString(String errorString) {
		this.errorString = errorString;
	}
	/**
	 * @return the data
	 */
	public Object getData() {
		return data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(Object data) {
		this.data = data;
	}
	
	@Override
	public String toString() {
		return "{\"success\": "+ this.success +", \"data\":\""+ this.data +"\", \"errorString\":\""+ this.errorString +"\"}";
	}

	
}
