package com.mwh.vi.projectmanagement.exceptions;

/**
 * Signifies exceptions while connecting facebook
 */

public class FacebookAuthenticationException extends Exception {
	private static final long serialVersionUID = 1L;
	
	public FacebookAuthenticationException(){
		super();
	}
	
	public FacebookAuthenticationException(String message){
		super(message);
	}

}
