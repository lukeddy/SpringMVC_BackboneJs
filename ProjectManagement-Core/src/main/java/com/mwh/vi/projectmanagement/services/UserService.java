/**
 * 
 */
package com.mwh.vi.projectmanagement.services;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.xml.bind.ValidationException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mwh.vi.projectmanagement.dtos.UpdatedUserInfoDTO;
import com.mwh.vi.projectmanagement.exceptions.DuplicateEntityException;
import com.mwh.vi.projectmanagement.models.User;
import com.mwh.vi.projectmanagement.repository.UserRepository;
import com.mwh.vi.projectmanagement.security.TokenManager;



/**
 * User functionality related services
 * 
 */

@Service("userService")
public class UserService {
	protected static Logger logger = Logger.getLogger(UserService.class);

	@Autowired
	private UserRepository userRepository;
	
	@Resource(name = "tokenManager")
	private TokenManager tokenManager;
	

	public UserService() {

	}

	/**
	 * Adds a new User
	 * @throws MessagingException 
	 * @throws UnsupportedEncodingException 
	 */
	public User add(User newUser) throws ValidationException,
			DuplicateEntityException, UnsupportedEncodingException{
		validateUser(newUser);
		checkForDuplicate(newUser);
		Date now = new Date();
		newUser.setCity("");
		newUser.setState("");
        newUser.setLastActivity(now);
        newUser.setRegistrationDate(now);
        
		userRepository.create(newUser);
		return newUser;

	}
	
	
	/**
	 * Validates the user
	 * 
	 * @param user
	 * @throws ValidationException
	 */
	private void validateUser(User user) throws ValidationException {
		// FIXME - Add data format validation also
		StringBuilder sb = new StringBuilder();
		if (null == user.getUserName()) {
			sb.append("UserName is missing. UserName is a required field. ");
		}
		if (null == user.getFirstName()) {
			sb.append("FirstName is missing. FirstName is a required field. ");
		}
		if (null == user.getLastName()) {
			sb.append("LastName is missing. LastName is a required field. ");
		}
		if (null == user.getPassword()) {
			sb.append("Password is missing. Password is a required field. ");
		}
		if(null==user.getGender())
		{
			sb.append("Gender is missing. Gender is a required field.");
		}
		if (sb.length() > 0) {
			throw new ValidationException(sb.toString());
		}
	}

	/**
	 * Checks if the user is an duplicate entry
	 * 
	 * @param user
	 * @throws DuplicateEntityException
	 */
	private void checkForDuplicate(User newUser)
			throws DuplicateEntityException{
		User existingUser = null;
		String id = newUser.getId();
		String userName = newUser.getUserName();
		
		if (null != id) {
			existingUser = userRepository.findById(id);
			if (null != existingUser) {
				throw new DuplicateEntityException(
						"The User already existing in the system");
			}
		}

		if (null == existingUser) {
			User matchingUser = null;
			if (null != userName) {
				matchingUser = userRepository.findByUserName(userName);

				if (null != matchingUser) {
					throw new DuplicateEntityException(
							"The User with same userName as '" + userName
									+ "' exists in the system");
				}
			}
		}
		
	}
	
	/**
	 * Retrieves a single User
	 */
	public User getByUserName(String userName) {
		logger.debug("Retrieving User with userName: " + userName);

		return userRepository.findByUserName(userName);
	}
	
	/**
	 * Retrieves a single User by user
	 */
	public User getUserByUserId(String userId) {
		logger.debug("Retrieving User with userId: " + userId);

		return userRepository.findByUserId(userId);
	}
	
	public List<User>getLoggers(List<String>userIds){
		return userRepository.findByIds(userIds);
	}
	
	
	/** 
	 * Checks for the validation of the user If valid or not 
	 */
	public boolean isValidUser(String userName, String password) throws ValidationException {
		User user = userRepository.findByUserName(userName);
		//checkVerified(user);
		
		if(user != null && !user.getPassword().equals(password)){
			throw new ValidationException("The username or password you entered is incorrect.");
		}
		else if (user== null){
			throw new ValidationException("The username or password you entered is incorrect.");
		}
		
		else{
			return true;
		}
	}
	
	
	
	public String generateToken(String userName, String password) {
		User user = this.getByUserName(userName);
		String token = tokenManager.generateToken(user);

		return token;
	}
	
	public User getUserTokenDTO(String userName){
		User user = userRepository.findByUserName(userName);
		return user;
	}
	
	
	public boolean updateUser(User user){
		return userRepository.update(user);
	}
	
	public boolean updateUserInfo(UpdatedUserInfoDTO updatedUserInfoDTO){
		User user=getUserByUserId(updatedUserInfoDTO.getId());
		//FIXME user.setUserName(updatedUserInfoDTO.getEmailAddress());
		if(!updatedUserInfoDTO.getNewPassword().equals("")){
			user.setPassword(updatedUserInfoDTO.getNewPassword());	
		}
		user.setEmailAddress(updatedUserInfoDTO.getEmailAddress());
		user.setFirstName(updatedUserInfoDTO.getFirstName());
		user.setLastName(updatedUserInfoDTO.getLastName());
		user.setCity(updatedUserInfoDTO.getCity());
		user.setState(updatedUserInfoDTO.getState());
		user.setCity(updatedUserInfoDTO.getCity());
		return userRepository.update(user);
	}
	
	
	
	
	public boolean validatePassword(String userId,String password){
		User user = userRepository.findById(userId);
		return user != null && user.getPassword().equals(password);
	}
	
		
	
	@SuppressWarnings("unused")
	private void checkVerified(User user) throws ValidationException {
		if(user!=null && !user.isVerified())
		{
			throw new ValidationException(
					"Please verify your email address.");
		}

	}
		
}
