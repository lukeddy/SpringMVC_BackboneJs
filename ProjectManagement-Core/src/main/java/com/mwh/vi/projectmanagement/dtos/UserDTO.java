package com.mwh.vi.projectmanagement.dtos;

import java.util.Comparator;

import javax.xml.bind.annotation.XmlRootElement;

import com.mwh.vi.projectmanagement.models1.User;

/**
 * The data transfer object to be passed over the net generally.
 * This does not have password field, and hence it's safe to use
 * as opposed to the User object.
 * 
 * @see com.mwh.vi.projectmanagement.models1.User
 */
@XmlRootElement
public class UserDTO implements Comparator<UserDTO>{

	private String id;
	private String userName;
	private String firstName;
	private String lastName;
	private String profileImageUrl;
	private String gender;
	private String facebookId;
	
	public UserDTO(){
		
	}
	
	public UserDTO(User user) {
		super();
		this.id = user.getId();
		this.userName = user.getUserName();
		this.firstName = user.getFirstName();
		this.lastName = user.getLastName();
		this.profileImageUrl = user.getProfileImageUrl();
		this.gender=user.getGender().name();
	}
	public UserDTO(String id, String userName, String firstName,
		String lastName, String profileImageUrl, String gender) {
		super();
		this.id = id;
		this.userName = userName;
		this.firstName = firstName;
		this.lastName = lastName;
		this.profileImageUrl = profileImageUrl;
		this.gender=gender.toUpperCase();
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the userName
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * @param userName the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * @param firstName the firstName to set
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**
	 * @return the lastName
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * @param lastName the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**
	 * @return the profileImageUrl
	 */
	public String getProfileImageUrl() {
		return profileImageUrl;
	}

	/**
	 * @param profileImageUrl the profileImageUrl to set
	 */
	public void setProfileImageUrl(String profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}
	/**
	 * 
	 * @return gender
	 */
	
	public String getGender() {
		return gender;
	}
	/**
	 * @param gender
	 *        user Gender to set
	 */
	public void setGender(String gender) {
		this.gender = gender;
	}

	
	public String getFacebookId() {
		return facebookId;
	}

	public void setFacebookId(String facebookId) {
		this.facebookId = facebookId;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "UserDTO [id=" + id + ", userName=" + userName + ", firstName="
				+ firstName + ", lastName=" + lastName + ", profileImageUrl="
				+ profileImageUrl + "]";
	}

	@Override
	public int compare(UserDTO u1, UserDTO u2) {
		String u1FirstName = u1.getFirstName().toUpperCase();
		String u2FirstName = u2.getFirstName().toUpperCase();
		return u1FirstName.compareTo(u2FirstName);
	}
	
	
}
