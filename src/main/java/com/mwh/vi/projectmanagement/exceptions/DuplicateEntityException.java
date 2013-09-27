/**
 * 
 */
package com.mwh.vi.projectmanagement.exceptions;

/**
 * Signifies a duplicate entry
 */

public class DuplicateEntityException extends Exception {

	private static final long serialVersionUID = 1L;

	public DuplicateEntityException() {
		super();
		// TODO Auto-generated constructor stub
	}

	public DuplicateEntityException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

	public DuplicateEntityException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}

	public DuplicateEntityException(Throwable cause) {
		super(cause);
		// TODO Auto-generated constructor stub
	}

}
