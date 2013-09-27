package com.mwh.vi.projectmanagement.dtos;

import javax.xml.bind.annotation.XmlRootElement;


/*
* The data transfer object to pass the userId and autToken
*/

@XmlRootElement
public class UserTokenDTO {
	
	private UserDTO userDTO ;
	private String authToken;
	
	public UserTokenDTO(){
		
	}
	
	public UserTokenDTO(UserDTO userDTO,String authToken)
	{
		this.userDTO=userDTO;
		this.authToken=authToken;
	}
		
	public UserDTO getUserDTO() {
		return userDTO;
	}

	public void setUserDTO(UserDTO userDTO) {
		this.userDTO = userDTO;
	}

	public String getAuthToken() {
		return authToken;
	}
	public void setAuthToken(String authToken) {
		this.authToken = authToken;
	}
	
	

}
