<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%
String footerPath = "jsp/common/masterComponents/footer.jsp";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
	<head>
		<jsp:include page="jsp/common/masterComponents/head.jsp" />
	</head>
  	<body>
  		<div class="main-container">
  			<div class="page-header">
  				<jsp:include page="jsp/common/masterComponents/header.jsp" />
  			</div>
  			
  			<div class="body-content st-styles">
	  			<jsp:include page="jsp/common/bodyPages/bLogin.jsp" />
	  		</div>
	  		
	  		<footer class="footer">
	  			<jsp:include page="<%= footerPath %>" />
	  		</footer>	
 		</div> 
  	</body>
</html>