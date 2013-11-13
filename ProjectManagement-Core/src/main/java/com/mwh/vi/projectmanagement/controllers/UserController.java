/**
 * 
 */
package com.mwh.vi.projectmanagement.controllers;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mwh.vi.projectmanagement.dtos.UserDTO;
import com.mwh.vi.projectmanagement.dtos.UserTokenDTO;
import com.mwh.vi.projectmanagement.models1.Result;
import com.mwh.vi.projectmanagement.models1.User;
import com.mwh.vi.projectmanagement.services.UserService;

/**
 * The main entry point for the User functionality which exposes user related web services
 * under /services/user
 */

@Controller
@RequestMapping("/services/user")
public class UserController {
	protected static Logger logger = Logger.getLogger(UserController.class);

	@Resource(name = "userService")
	private UserService userService;

	
	
	@RequestMapping(value="/register",method = RequestMethod.PUT, headers = "Accept=application/json")
	public @ResponseBody
	Result addUser(@RequestBody User user) {
		logger.debug("Received request to add new user");

		Result result = new Result();
		User addedUser= null;
		try {
		    addedUser = userService.add(user);
			result.setSuccess(true);
			result.setData(addedUser);
		} catch (Exception e) {
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		
		return result;
	}
	
	/**
	 * Accepts the login credentials and validates the user for login
	 * 
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST, headers = "Accept=application/json")
	public @ResponseBody
	Result login(@RequestParam("userName") String userName,@RequestParam("password") String password) {

		logger.debug("Request to login userName " + userName + " and password "
				+ password);
		Result result = new Result();
		User user = new User();
		Map<String, Object> data = new HashMap<String, Object>();

		try {
			if (userService.isValidUser(userName, password)) {
				user = userService.getUserTokenDTO(userName);
				UserTokenDTO userTokenDTO = new UserTokenDTO(new UserDTO(user),
						userService.generateToken(userName, password));

				data.put("userTokenDTO", userTokenDTO);
				result.setSuccess(true);
				result.setData(data);
			}

		} catch (Exception e) {
			result.setSuccess(false);
			result.setErrorString(e.getMessage());

		}
		return result;
		
	}
	
	
	
	/*@RequestMapping(value="/facebook",method=RequestMethod.POST,headers="Accept=application/xml, application/json")
	public @ResponseBody
	Result doAuthentication(@RequestParam("fbAccessToken") String fbAccessToken,
			@RequestParam("userID") String userID){
		logger.debug("Request to do facebook authentication received ");
		Result result=new Result();
		User addedUser=null,user=null;
		boolean facebookRegisterFlag = false;
		int flag = 0; 
		try{
			try{
			addedUser = userService.authenticate(fbAccessToken,userID);
			user=userService.getByUserName(addedUser.getUserName());
			
				if(user!=null){
					addedUser.setPassword(user.getPassword());
					userService.saveFacebookId(addedUser.getUserName(), addedUser.getFacebookId());
					result=login(addedUser.getUserName(),addedUser.getPassword(),flag);
					}
				else{
				flag = 1;
				facebookRegisterFlag=true;
				userService.add(addedUser,facebookRegisterFlag);
				emailService.sendRegistrationEmail(addedUser);
				result=login(addedUser.getUserName(),addedUser.getPassword(),flag);
				}
			}
			catch(DuplicateEntityException e){
			user=userService.getByFacebookId(addedUser.getFacebookId());
			result=login(user.getUserName(),user.getPassword(),flag);
			}
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}*/
	
	
	
	
	/*@RequestMapping(value = "/me/loggers", method = RequestMethod.GET, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result viewLoggers(@RequestParam("userId") String userId,@RequestParam ("end") long end) {
		logger.debug("Received request to get all loggers");

		Result result = new Result();
		try {
			Date endDate = null;
			if (end == 0L) {
				endDate = new Date();
			}
			else {
				endDate = new Date(end);
			}
			Map<String,Object> data=userService.getAllMiniProfile(endDate, userId);
			result.setSuccess(true);
			result.setData(data);

		} catch (Exception e) {
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}
	
	*/
	
	/*@RequestMapping(value = "/miniprofile/{userId}", method = RequestMethod.GET, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result getLogger(@PathVariable ("userId") String userId ){
		logger.debug("Received request to get mini profile for user with id:"+userId);

		Result result = new Result();
		try {
			User user=userService.getUserByUserId(userId);
			long logCount=logService.getUserLogCount(userId);
			long logResultCount=logResultService.getUserLogResultCount(userId);
			long participatedLogCount= logService.getLogParticipated(userId);
			UserProfileDTO userProfileDTO=new UserProfileDTO(user,logCount,logResultCount, participatedLogCount);
			result.setSuccess(true);
			result.setData(userProfileDTO);
						
		} catch (Exception e) {
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}*/
	
	/*
	
	@RequestMapping(value = "/getInfo/{userId}", method = RequestMethod.GET, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result getInfo(@PathVariable("userId") String userId)
	{
		Result result=new Result();

		try
		{   User user=userService.getUserByUserId(userId);
			long logCount=logService.getUserLogCount(userId);
			long logResultCount=logResultService.getUserLogResultCount(userId);
			long participatedLogCount= logService.getLogParticipated(userId);
			UserInfoDTO userInfo=new UserInfoDTO(user,logCount,logResultCount,participatedLogCount);
			List <StateDTO> states=userService.getStates();
			Map<String ,Object> data=new HashMap<String,Object>();
			data.put("userInfo", userInfo);
			data.put("states", states);
			data.put("favoriteLogCount",logService.getUserFavoriteLogCount(userId));
			data.put("favoriteLoggerCount", userService.getFavoriteLoggerCountForUser(userId));
			data.put("statesCount", states.size());
			data.put("userLogs",logService.getUserLogsForPofile(userId));
			userInfo.setLogMostProudOf(user.getLogMostProudOf());
			data.put("logMostProudOf",userInfo.getLogMostProudOf());
			result.setData(data);
			result.setSuccess(true);
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}*/
	
	/*@RequestMapping(value = "/updateInfo", method = RequestMethod.PUT, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result updateInfo(@RequestBody UpdatedUserInfoDTO updatedUserInfoDTO)
	{
		Result result=new Result();

		try
		{   userService.updateUserInfo(updatedUserInfoDTO);
			result.setSuccess(true);
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}*/
	
	/*@RequestMapping(value = "/validatePassword", method = RequestMethod.POST, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result validate(@RequestParam("userId") String userId, @RequestParam("password") String password){

		Result result=new Result();

		try
		{   boolean isvalid=userService.validatePassword(userId,password);
			result.setSuccess(isvalid);
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}*/
	
	/*@RequestMapping(value = "/forgotPassword", method = RequestMethod.POST, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result forgotPassword(@RequestParam("userName") String userName){

		Result result=new Result();

		try
		{  
			userService.sendPassword(userName);
			result.setSuccess(true);
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/setUserImage", method = RequestMethod.PUT, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result setUserImage(@RequestParam("userId") String userId, @RequestParam ("imageURL") String imageURL,@RequestParam ("x") int x,@RequestParam ("y") int y,
			@RequestParam ("height") int height , @RequestParam ("width") int width){

		Result result=new Result();

		try
		{  
			String newImageURL = userService.updateProfileImage(userId, imageURL,x,y,height,width);
			result.setSuccess(true);
			result.setData(newImageURL);
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}*/
	
	
	/*@RequestMapping(value = "/verify", method = RequestMethod.GET, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result verifyMail(HttpServletResponse response, @RequestParam("userId") String userId, @RequestParam("token") String token){

		Result result = new Result();
		try
		{  
			User user = userService.verifyEmailAddress(userId,token);
			result = login(user.getUserName(), user.getPassword(),1);
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		
		return result;
	}
	
	@RequestMapping(value="/search", method=RequestMethod.GET,headers="Accept=application/xml, application/json")
	public @ResponseBody
	Result search(@RequestParam ("query") String query, @RequestParam ("userId") String userId){
		logger.debug("received request to search query string "+query);

		Result result = new Result();
		try {
			Map<String,Object> data = userService.getLoggerByQuery(query,userId);
			result.setSuccess(true);
			result.setData(data);
		} catch (Exception e) {
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}*/

	
	
	/*@RequestMapping(value = "/{userId}", method = RequestMethod.GET, headers = "Accept=application/xml, application/json")
	public @ResponseBody
	Result getUserInfo(@PathVariable("userId") String userId){

		Result result=new Result();

		try
		{  
			UserDTO user = new UserDTO(userService.getUserByUserId(userId));
			result.setSuccess(true);
			result.setData(user);
		}
		catch(Exception e){
			result.setSuccess(false);
			result.setErrorString(e.getMessage());
		}
		return result;
	}*/
	
	
	
	
}
