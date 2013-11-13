package com.mwh.vi.projectmanagement.models1;

import java.util.Comparator;
import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mwh.vi.projectmanagement.enums.UserGender;

/**
 * Model Object representing an PM User
 * 
 */

@XmlRootElement(name = "user")
@Document(collection="PMUsers")
public class User implements Comparator<User> {
	
	@Id
	private String id;
	private String userName;
	private String password;
	private String emailAddress;
	private Date dateOfBirth;
	private String firstName;
	private String lastName;
	private UserGender gender;
	private String profileImageUrl;
	private Date lastActivity;
	
	private String city;
	private String state;
	private Date registrationDate;
	
	/* Only used when user changes his/her password. Based on the new password provided
	 * the password field is changed accordingly
	 * */
	private String newPassword;
	private boolean verified;
	
		
	public User(){
		
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
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
	 * @param userName
	 *            the userName to set
	 */
	public void setUserName(String userName) {
		this.userName = userName;
	}

	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password
	 *            the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}

	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * @param firstName
	 *            the firstName to set
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
	 * @param lastName
	 *            the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	/**
	 * @return the profileImageUrl
	 */
	public String getProfileImageUrl() {
		return profileImageUrl;
	}

	/**
	 * @param profileImageUrl
	 *            the profileImageUrl to set
	 */
	public void setProfileImageUrl(String profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}
	
	
	/**
	 * 
	 * @return gender
	 */

	public UserGender getGender() {
		return gender;
	}
	/**
	 * @param gender
	 *            the gender to set
	 */
	public void setGender(UserGender gender) {
		this.gender = gender;
	}
	
	
	/**
	 * 
	 * @return dateOfBirth
	 */
	public Date getDateOfBirth() {
		return dateOfBirth;
	}
	/**
	 * 
	 * @param dateOfBirth
	 * 				dateOfBirth to set
	 */		
	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	
	/**
	 * 
	 * @return lastActivity
	 */
	public Date getLastActivity() {
		return lastActivity;
	}
	/**
	 * 
	 * @param lastActivity
	 * 				lastActivity to set
	 */		
	public void setLastActivity(Date lastActivity) {
		this.lastActivity = lastActivity;
	}

	
	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	/**
	 * 
	 * @return registrationDate
	 */
	public Date getRegistrationDate() {
		return registrationDate;
	}
	/**
	 * 
	 * @param registrationDate
	 * 	               registrationDate to set
	 */
	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
	}
	
	/**
	 * 	
	 * @return verified
	 */
	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "User [id=" + id + ", userName=" + userName + ", password="
				+ password + ", firstName=" + firstName
				+ ", lastName=" + lastName + ", profileImageUrl="
				+ profileImageUrl + "]";
	}

	public int compare(User o1, User o2) {
		Date d1=o1.getLastActivity();
		Date d2=o2.getLastActivity();
		return d2.compareTo(d1);
	}

}
