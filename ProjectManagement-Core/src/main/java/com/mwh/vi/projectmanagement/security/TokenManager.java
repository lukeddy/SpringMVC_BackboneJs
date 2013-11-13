package com.mwh.vi.projectmanagement.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mwh.vi.projectmanagement.models1.User;
import com.mwh.vi.projectmanagement.models1.UserToken;
import com.mwh.vi.projectmanagement.repository.UserTokenRepository;

/**
 * Generates a Token and stores in the database. Also verifies the token against
 * the token stored in the database.
 * 
 * A Token can be generated from user name/password authentication. 
 */
@Service("tokenManager")
public class TokenManager {

	@Autowired
	private UserTokenRepository userTokenRepository;

	/**
	 * Generates and stores token in db
	 * 
	 * @param userName
	 * @param password
	 * @return
	 */
	public String generateToken(User user) {
		UserToken token = userTokenRepository.create(user);
		return token.getToken();
	}

	/**
	 * 
	 * @param token
	 * @return true if the token is stored in the db and a valid token
	 */
	public boolean isValidToken(String token) {
		UserToken userToken = userTokenRepository.findByToken(token);
		if (null != userToken) {
			return true;
		} else {
			return false;
		}
	}

	public String getUserName(String token) {
		String userName = null;
		UserToken userToken = userTokenRepository.findByToken(token);
		if (null != userToken) {
			userName = userToken.getUser().getUserName();
		}
		return userName;
	}

	public String getPassword(String token) {
		String password = null;
		UserToken userToken = userTokenRepository.findByToken(token);
		if (null != userToken) {
			password = userToken.getUser().getPassword();
		}
		return password;

	}

}
