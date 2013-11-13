package com.mwh.vi.projectmanagement.repository;

import java.util.List;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mwh.vi.projectmanagement.models1.User;
import com.mwh.vi.projectmanagement.models1.UserToken;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

import org.apache.commons.codec.binary.Base64;


/**
 * DAO for UserTokens, where the session information (user tokens) for
 * the logged-in user are maintained into the database.
 */

@Repository
public class UserTokenRepository {

	protected static Logger logger = Logger.getLogger("UserTokenRepository");

	@Inject
	private MongoTemplate mongoTemplate;
	
	@Autowired
	private UserRepository userRepository;

	public UserToken create(User user) {
		UserToken token = new UserToken();
		token.setToken(generateToken(user.getUserName(), user.getPassword()));
		token.setUser(user);
		mongoTemplate.insert(token);
		return token;
	}

	public UserToken update(UserToken token) {
		mongoTemplate.save(token);
		return token;
	}

	public UserToken findById(String id) {
		return mongoTemplate.findById(id, UserToken.class);
	}

	public UserToken findByToken(String token) {
		return mongoTemplate.findOne(query(where("token").is(token)),
				UserToken.class);
	}

	public List<UserToken> findAll() {
		return mongoTemplate.findAll(UserToken.class);
	}

	public void remove(String token) {
		mongoTemplate.remove(query(where("token").is(token)), UserToken.class);
	}

	public void removeAll() {

		if (mongoTemplate.collectionExists(UserToken.class)) {
			mongoTemplate.dropCollection(UserToken.class);
			mongoTemplate.createCollection(UserToken.class);
		}

	}

	/**
	 * 
	 * @param userName
	 * @param password
	 * @return Base 64 Encoded token
	 */
	public String generateToken(String userName, String password) {

		String token = new String(
				Base64.encodeBase64((userName + ":" + password).getBytes()));
		return token;
	}

	public User getUser(String userToken) {
		String userPasswordSplit = new String(Base64.decodeBase64(userToken
				.getBytes()));
		System.out.println("user password split "+userPasswordSplit);
		//FIXME Handle edge cases, check for nulls and out of index 
		String userName = userPasswordSplit.substring(0, userPasswordSplit.indexOf(":"));
		//FIXME check for null checks
		return userRepository.findByUserName(userName);

	}

}
