											<%@page import="ilu.surveytool.databasemanager.constants.DBConstants"%>
											<%@page import="ilu.surveytool.databasemanager.DataObject.Option"%>
											<%@page import="ilu.surveytool.databasemanager.DataObject.OptionsGroup"%>
											<%@page import="ilu.surveytool.constants.Attribute"%>
											<%@page import="ilu.surveytool.databasemanager.DataObject.Question"%>
											<%@page import="ilu.surveytool.language.Language"%>
											<%@page import="ilu.surveytool.databasemanager.DataObject.Resource"%>
											<%@page import="java.util.List"%>
											<%
											Language lang = new Language(getServletContext().getRealPath("/")); 
											lang.loadLanguage(Language.getLanguageRequest(request));
											%>
											<script>
											accesibilityTextOption = "<%= lang.getContent("accesibility.question.option") %>";
											phOption = "<%= lang.getContent("question.edit.placeholder.option") %>";
							  				</script>
											<%
											Question question = (Question) request.getAttribute(Attribute.s_QUESTION);
										
							  				if(question.getOptionsGroups().size() > 0)
							  				{
							  					for(OptionsGroup optionsGroup : question.getOptionsGroups())
							  					{
							  					%>
							  										  						
							  						<ul class="option-list" id="option-list" ogid="<%= optionsGroup.getId() %>" otype="checkbox">
							  						<%
							  						
							  						for(Option option : optionsGroup.getOptions())
							  						{
							  							int index = option.getIndex();
							  							String text = "";
							  							if(option!=null && option.getContents()!=null && option.getContents().get(DBConstants.s_VALUE_CONTENTTYPE_NAME_TITLE)!=null){
							  								text = option.getContents().get(DBConstants.s_VALUE_CONTENTTYPE_NAME_TITLE).getText();
							  							}
							  						%>
							  							<li class="option-item" id="option-item" oid="<%= option.getId() %>">
						  									<!-- <button class="btn btn-transparent fleft"><i class="fa fa-sort fa-2x" aria-hidden="true"></i></button> -->
						  									<div class="circle-info circle-grey fleft"><%= index %></div>
						  									<label for="option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" class="visuallyhidden"><%= lang.getContent("accesibility.question.option") %> <%= index %></label>														
															<input id="option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" type="text" class="option-title form-control fleft option" index="<%= index %>" oid="<%= option.getId() %>" placeholder="<%= lang.getContent("question.edit.placeholder.option") %> <%= index %>" value="<%= text %>"/>
						  									<div class="option-icons fleft">
							  									<!-- <button class="btn btn-transparent fleft" data-toggle="modal" data-target="#importFile"><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button>
							  									<button class="btn btn-transparent fleft"><i class="fa fa-question-circle fa-2x" aria-hidden="true"></i></button> -->
							  									<% if((boolean)request.getAttribute(Attribute.s_ADD_QUESTIONS)){ %>
							  									<label for="add-file-option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" class="visuallyhidden"><%= lang.getContent("accesibility.question.addfile.option") %> <%= index %></label>														
																<button class="btn btn-transparent fleft add-file-option" id="add-file-option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>"  active="false" ><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button>
							  									<label for="remove-option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" class="visuallyhidden"><%= lang.getContent("accesibility.question.remove.option") %> <%= index %></label>														
																<button class="btn btn-transparent fleft red remove-option" id="remove-option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>"><i class="fa fa-trash fa-2x" aria-hidden="true"></i></button>
																<%} %>
							  								</div>
							  							
							  							<%
							  							request.setAttribute(Attribute.s_OPTION, option);
														%>
														<jsp:include page="../eqComponents/eqFilesOptions.jsp" />
														</li>
							  						<%
							  						}
							  						
							  						int size = optionsGroup.getOptions().size();
							  						if(size < 2)
							  						{
							  							for(int i = size; i < 2; i++)
							  							{
							  								int index = i + 1;
							  						%>
							  							<li class="option-item" id="option-item">
						  									<!-- <button class="btn btn-transparent fleft"><i class="fa fa-sort fa-2x" aria-hidden="true"></i></button> -->
						  									<div class="circle-info circle-grey fleft"><%= index %></div>
						  									<label for="option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" class="visuallyhidden"><%= lang.getContent("accesibility.question.option") %> <%= index %></label>														
															<input id="option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" type="text" class="option-title form-control fleft option" index="<%= index %>" oid="0" placeholder="<%= lang.getContent("question.edit.placeholder.option") %> <%= index %>"/>
						  									<div class="option-icons fleft">
							  									<!-- <button class="btn btn-transparent fleft" data-toggle="modal" data-target="#importFile"><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button>
							  									<button class="btn btn-transparent fleft"><i class="fa fa-question-circle fa-2x" aria-hidden="true"></i></button> -->
							  									<% if((boolean)request.getAttribute(Attribute.s_ADD_QUESTIONS)){ %>
							  									<label for="add-file-option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" class="visuallyhidden"><%= lang.getContent("accesibility.question.addfile.option") %> <%= index %></label>														
																<button class="btn btn-transparent fleft add-file-option" id="add-file-option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" active="false" ><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button>
							  									<label for="remove-option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>" class="visuallyhidden"><%= lang.getContent("accesibility.question.remove.option") %> <%= index %></label>
							  									<button class="btn btn-transparent fleft red remove-option" id="remove-option<%= question.getQuestionId() %>-<%= optionsGroup.getId() %>-<%= index %>"><i class="fa fa-trash fa-2x" aria-hidden="true"></i></button>
							  									<% } %>
							  								</div>
							  								<div class="row margin-top-40 hidden" type="global" id="multimediaFrame">
																		<div id="div_files">
																			<div class="options-files-frame hidden">
																				<label><%= lang.getContent("question.edit.files.option.title") %></label>
																		
																				<ul class="multimedia-list" id="multimediaFilesList">
																				</ul>
																			</div>
																				
																		</div>
															</div>	
							  							</li>
							  							
							  						<%
							  							}
							  						}
							  						%>
							  							<li class="center" id="li-add-option<%= question.getQuestionId() %>">
							  								<% if((boolean)request.getAttribute(Attribute.s_ADD_QUESTIONS)){ %>
							  									<label for="btn-add-option" class="visuallyhidden"><%= lang.getContent("accesibility.question.add.option") %></label>
							  									<button class="btn btn-primary btn-sm active" id="btn-add-option"><i class="fa fa-plus-square" aria-hidden="true"></i><span><%= lang.getContent("button.add_option") %></span></button>
							  								<% } %>
							  							</li>
							  						</ul>
							  					<%
							  					}
							  				}
							  				else
							  				{
							  					%>
							  											  						
							  						<ul class="option-list" id="option-list" ogid="0" otype="checkbox">
							  						
							  							<li class="option-item" id="option-item">
						  									<!-- <button class="btn btn-transparent fleft"><i class="fa fa-sort fa-2x" aria-hidden="true"></i></button> -->
						  									<div class="circle-info circle-grey fleft">1</div>
						  									<label for="option<%= question.getQuestionId() %>-0-1" class="visuallyhidden"><%= lang.getContent("accesibility.question.option") +" 1"%></label>														
															<input id="option<%= question.getQuestionId() %>-0-1" type="text" class="option-title form-control fleft option" index="1" oid="0" placeholder="<%= lang.getContent("question.edit.placeholder.option") %> 1"/>
						  									<div class="option-icons fleft">
							  									<!-- <button class="btn btn-transparent fleft" data-toggle="modal" data-target="#importFile"><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button>
							  									<button class="btn btn-transparent fleft"><i class="fa fa-question-circle fa-2x" aria-hidden="true"></i></button> -->
							  									<% if((boolean)request.getAttribute(Attribute.s_ADD_QUESTIONS)){ %>
							  									<label for="add-file-option<%= question.getQuestionId() %>-0-1" class="visuallyhidden"><%= lang.getContent("accesibility.question.addfile.option") %>: 1</label>														
																<button class="btn btn-transparent fleft add-file-option" id="add-file-option<%= question.getQuestionId() %>-0-1" active="false" ><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button>
							  									<label for="remove-option<%= question.getQuestionId() %>-0-1" class="visuallyhidden"><%= lang.getContent("accesibility.question.remove.option") %>: 1</label>
							  									<button class="btn btn-transparent fleft red remove-option" id="remove-option<%= question.getQuestionId() %>-0-1"><i class="fa fa-trash fa-2x" aria-hidden="true"></i></button>
							  									<% } %>
							  								</div>
							  								<div class="row margin-top-40 hidden" type="global" id="multimediaFrame">
																		<div id="div_files">
																			<div class="options-files-frame hidden">
																			<label><%= lang.getContent("question.edit.files.option.title") %></label>
																		
																				<ul class="multimedia-list" id="multimediaFilesList">
																				</ul>
																			</div>
																				
																		</div>
															</div>	
							  							</li>
							  							
							  							<li class="option-item" id="option-item">
						  									<!-- <button class="btn btn-transparent fleft"><i class="fa fa-sort fa-2x" aria-hidden="true"></i></button> -->
						  									<div class="circle-info circle-grey fleft">2</div>
						  									<label for="option<%= question.getQuestionId() %>-0-2" class="visuallyhidden"><%= lang.getContent("accesibility.question.option") +" 2"%></label>														
															<input id="option<%= question.getQuestionId() %>-0-2" type="text" class="option-title form-control fleft option" index="2" oid="0" placeholder="<%= lang.getContent("question.edit.placeholder.option") %> 2"/>
						  									<div class="option-icons fleft">
							  									<!-- <button class="btn btn-transparent fleft" data-toggle="modal" data-target="#importFile"><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button>
							  									<button class="btn btn-transparent fleft"><i class="fa fa-question-circle fa-2x" aria-hidden="true"></i></button> -->
							  									<% if((boolean)request.getAttribute(Attribute.s_ADD_QUESTIONS)){ %>
							  									<label for="add-file-option<%= question.getQuestionId() %>-0-2" class="visuallyhidden"><%= lang.getContent("accesibility.question.addfile.option") %>: 2</label>														
																<button class="btn btn-transparent fleft add-file-option" id="add-file-option<%= question.getQuestionId() %>-0-2" active="false" ><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button>
							  									<label for="remove-option<%= question.getQuestionId() %>-0-2" class="visuallyhidden"><%= lang.getContent("accesibility.question.remove.option") %>: 2</label>
							  									<button class="btn btn-transparent fleft red remove-option" id="remove-option<%= question.getQuestionId() %>-0-2"><i class="fa fa-trash fa-2x" aria-hidden="true"></i></button>
							  									
							  									<% } %>
							  								</div>
							  								<div class="row margin-top-40 hidden" type="global" id="multimediaFrame">
																		<div id="div_files">
																			<div class="options-files-frame hidden">
																			<label><%= lang.getContent("question.edit.files.option.title") %></label>
																		
																				<ul class="multimedia-list" id="multimediaFilesList">
																				</ul>
																			</div>
																				
																		</div>
															</div>	
							  							</li>
							  							
							  							<li class="center" id="li-add-option<%= question.getQuestionId() %>">
							  								<% if((boolean)request.getAttribute(Attribute.s_ADD_QUESTIONS)){ %>
							  								<label for="btn-add-option" class="visuallyhidden"><%= lang.getContent("accesibility.question.add.option") %></label>
							  								<button class="btn btn-primary btn-sm active" id="btn-add-option" ><i class="fa fa-plus-square" aria-hidden="true"></i><span><%= lang.getContent("button.add_option") %></span></button>
							  								<% } %>
							  							</li>
							  						</ul>
							  					<%
							  				}
							  				
							  			lang.close();							  				
							  			%>