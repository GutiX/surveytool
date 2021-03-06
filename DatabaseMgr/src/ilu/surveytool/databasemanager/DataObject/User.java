package ilu.surveytool.databasemanager.DataObject;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class User {
	
	int userId;
	String username = "";
	String email = "";
	String rol = "";
	Timestamp registerDate;
	boolean anonimous = false;
	List<Response> responses;
	

	public User() {
		super();
		responses = new ArrayList<Response>();
	}

	public User(int userId, String username, String email, String rol, Timestamp registerDate, boolean anonimous, List<Response> responses) {
		super();
		this.userId = userId;
		this.username = username;
		this.email = email;
		this.rol = rol;
		this.registerDate = registerDate;
		this.anonimous = anonimous;
		this.responses = responses;
	}

	
	public int getUserId() {
		return userId;
	}


	public void setUserId(int userId) {
		this.userId = userId;
	}


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public String getEmail() {
		return email;
	}


	public void setEmail(String email) {
		this.email = email;
	}


	public Timestamp getRegisterDate() {
		return registerDate;
	}


	public void setRegisterDate(Timestamp registerDate) {
		this.registerDate = registerDate;
	}


	public boolean isAnonimous() {
		return anonimous;
	}


	public void setAnonimous(boolean anonimous) {
		this.anonimous = anonimous;
	}


	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}


	public List<Response> getResponses() {
		return responses;
	}

	public void setResponses(List<Response> responses) {
		this.responses = responses;
	}

	@Override
	public String toString() {
		return "User [userId=" + userId + ", username=" + username + ", email=" + email + ", registerDate="
				+ registerDate + ", anonimous=" + anonimous + "]";
	}

}
