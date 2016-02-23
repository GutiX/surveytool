							  					
							  					<%@page import="ilu.surveytool.language.Language"%>
												<%@page import="ilu.surveytool.databasemanager.constants.DBConstants"%>
												<%@page import="ilu.surveytool.constants.Attribute"%>
												<%@page import="ilu.surveytool.databasemanager.DataObject.Question"%>
												<%
												Language lang = new Language(getServletContext().getRealPath("/")); 
												lang.loadLanguage("en");

							  					Question question = (Question) request.getAttribute(Attribute.s_QUESTION);
											    String descriptionText = "";
							  					if(question.getContents().containsKey(DBConstants.s_VALUE_CONTENTTYPE_NAME_DESCRIPTION))
							  					{
							  						descriptionText = question.getContents().get(DBConstants.s_VALUE_CONTENTTYPE_NAME_DESCRIPTION).getText(); 
							  					}
							  					%>
							  					<div class="question-frame question-frame-help" id="question-frame-help">
							  						<h4><%= lang.getContent("question.edit.description.title") %></h4>
							  						<textarea class="form-control" id="survey-question-description-text" rows="2" placeholder="<%= lang.getContent("placeholder.type_here") %>" aria-label="<%= lang.getContent("question.edit.description.aria_label") %>"><%= descriptionText %></textarea>
							  					</div>	
							  					
												<%
												lang.close();
												%>
							  					