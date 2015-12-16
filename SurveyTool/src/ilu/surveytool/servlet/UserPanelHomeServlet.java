package ilu.surveytool.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import ilu.surveytool.commoncode.CommonCode;
import ilu.surveytool.constants.Address;
import ilu.surveytool.constants.Attribute;
import ilu.surveytool.constants.FormParameter;
import ilu.surveytool.databasemanager.DataObject.LoginResponse;
import ilu.surveytool.orchestrator.UserPanelHomeOrch;
import ilu.surveytool.properties.BodyPages;

/**
 * Servlet implementation class UserPanelHomeServlet
 */
@WebServlet("/UserPanelHomeServlet")
public class UserPanelHomeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	String language = "en";
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UserPanelHomeServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ProcessRequest(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		ProcessRequest(request, response);
	}
	
	protected void ProcessRequest(HttpServletRequest request, HttpServletResponse response)
	{
		LoginResponse userSessionInfo = (LoginResponse) request.getSession().getAttribute(Attribute.s_USER_SESSION_INFO);
		BodyPages bodyPages = new BodyPages(getServletContext().getRealPath("/"));
		
		if(userSessionInfo != null && userSessionInfo.isValid())
		{
			String bodyPage = request.getParameter(FormParameter.s_UPOPTION);
			if(bodyPage != null && !bodyPage.isEmpty())
			{
				if(bodyPage.equals(Address.s_BODY_SURVEYS))
				{
					UserPanelHomeOrch uphOrch = new UserPanelHomeOrch();
					request.setAttribute(Attribute.s_SURVEYS, uphOrch.getSurveysTableInfoByAuthor(userSessionInfo.getUserId(), this.language));
				}
				request.setAttribute(Attribute.s_BODY_PAGE, bodyPages.getBudyPagePath(bodyPage));
			}			
		}
		else
		{
			userSessionInfo = new LoginResponse();
			userSessionInfo.setErrorMsg("Session is expired or not exist.");
			request.setAttribute(Attribute.s_BODY_PAGE, bodyPages.getBudyPagePath(Address.s_BODY_LOGIN));
			request.setAttribute(Attribute.s_LOGIN_RESPONSE, userSessionInfo);
		}
		
		CommonCode.redirect(request, response, Address.s_MASTER_PAGE);
	}

}