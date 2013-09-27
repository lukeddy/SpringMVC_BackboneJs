/**
 * 
 */
package com.mwh.vi.projectmanagement.exceptions;

/**
 * An error in server-side validation
 */

public class ValidationException extends Exception {

	private static final long serialVersionUID = 1L;

	public ValidationException() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ValidationException(String arg0, Throwable arg1) {
		super(arg0, arg1);
		// TODO Auto-generated constructor stub
	}

	public ValidationException(String arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

	public ValidationException(Throwable arg0) {
		super(arg0);
		// TODO Auto-generated constructor stub
	}

}
