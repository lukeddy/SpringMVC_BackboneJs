
package com.mwh.vi.projectmanagement.repository;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.inject.Inject;

import org.apache.log4j.Logger;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.mwh.vi.projectmanagement.models.User;



/**
 * This is the DAO for the user functionality
 */

@Repository
public class UserRepository{
	protected static Logger logger = Logger.getLogger("UserRepository");
	
    @Inject
    private MongoTemplate mongoTemplate;
          
    public User create(User log) {
         mongoTemplate.insert(log);
         
         return log;
    }
    
    public boolean update(User user){
    	mongoTemplate.save(user);
    	return true;
    }
    
       
    public User findById(String id) {
        return mongoTemplate.findById(id, User.class);
    }
    
    /**
     * query to get the list of user 
     */
    public List<User> findByIds(List<String> userIds){
    	return mongoTemplate.find(query(where("id").in(userIds)),User.class);
    }

    public User findByUserName(String userName) {
    	return mongoTemplate.findOne(query(where("userName").is(userName)), User.class);
    }
    
    public User findByUserId(String userId) {
    	return mongoTemplate.findOne(query(where("id").is(userId)), User.class);
    }    
    
    public User findByFacebookId(String id){
    	return mongoTemplate.findOne(query(where("facebookId").is(id)),User.class);
    }
    
    public User updateFacebookId(String userName,String id){
    	return mongoTemplate.findAndModify(query(where("userName").is(userName)),Update.update("facebookId", id), User.class);
    }
        
     
      		
 	public List<User> findLoggerByQuery(String userId, String query){
 	    	
 		List<User> serachResult1 = mongoTemplate.find(query(where("firstName").regex("\\b"+query, "i")), User.class);
 		List<User> serachResult2 = mongoTemplate.find(query(where("lastName").regex("\\b"+query, "i")), User.class);
 		List<User> serachResult3 = mongoTemplate.find(query(where("state").regex("\\b"+query, "i")), User.class);
 		List<User> serachResult4 = mongoTemplate.find(query(where("city").regex("\\b"+query, "i")), User.class);
 		 		
 		List<User> result = new ArrayList<User>();
 		Set<String> res = new HashSet<String>();
 		
 		for(User u:serachResult1){
 			if(res.add(u.getId())){
 				result.add(u);
 			}
 		}
 		
 		for(User u:serachResult2){
 			if(res.add(u.getId())){
 				result.add(u);
 			}
 		}
 		
 		for(User u:serachResult3){
 			if(res.add(u.getId())){
 				result.add(u);
 			}
 		}
 		
 		for(User u:serachResult4){
 			if(res.add(u.getId())){
 				result.add(u);
 			}
 		}
 		
 		return result;
  	}
}
