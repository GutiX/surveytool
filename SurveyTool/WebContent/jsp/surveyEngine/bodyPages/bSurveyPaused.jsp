<%@page import="ilu.surveytool.constants.Attribute"%>
<%@page import="ilu.surveytool.language.Language"%>
				<%
				Language lang = (Language) request.getSession().getAttribute(Attribute.s_SURVEY_LANGUAGE);
				%>
				
  						<div class="survey-state-content content" >
  							<h1><%= lang.getContent("survey.process.page.state.paused.title") %></h1>
  							<p><%= lang.getContent("survey.process.page.state.paused.body") %></p>  							
  						</div>
	  			
	  			
<%
lang.close();
%>