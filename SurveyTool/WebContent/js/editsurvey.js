/**
 * 
 */
var qtypeId;
var numQuestions = 0;
var currentElement;
var currentAddNode;
var currentQuestion = 0;
var currentOption = 0;
var currentLanguage = "en";
var addMenuFrameCad = "add-menu-frame-";
var pending;
var jsonquotas;
var quotaid;
$(function() {
	
	var host = "http://" + window.location.host;
	console.log("host: " + host);
	
	/*var clientTarget = new ZeroClipboard( $("#target-to-copy"), {
	    moviePath: "http://www.paulund.co.uk/playground/demo/zeroclipboard-demo/zeroclipboard/ZeroClipboard.swf",
	    debug: false
	} );

	clientTarget.on( "load", function(clientTarget)
	{
	    $('#flash-loaded').fadeIn();

	    clientTarget.on( "complete", function(clientTarget, args) {
	        clientTarget.setText( args.text );
	        $('#target-to-copy-text').fadeIn();
	    });
	});*/

	$('body_').click(function() {
				
    });
	
	//survey-info  #e6e6e6
	$('.btn-qtype button').click(function(){
		console.log("Clicking on type query button");
		$('#frame-basic-Settings').css('display', 'inherit');
		$('#' + qtypeId + " i").css("background-color","#fff");
		qtypeId = $(this).attr('id');
		$('#' + qtypeId + ' i').css("background-color","#e6e6e6");
		$('#qtypevalue').val(qtypeId);
		$('#qstatement').focus();
		
	});
	
	$('#basic-settings-close').click(function(){
		$('#qstatement').val("");
		//$('#main-version').val("none");
		$('#mandatory').val("false");
		$('#askAlways').val("false");
		$('#help-text').val("false");
		$('#frame-basic-Settings').css('display', 'none');
		$('#' + qtypeId + " i").css("background-color","#fff");
	});
	
	$('#create-question').click(function(event) {
		var valid = true;
		//check de name project
		if($('#qstatement').val() == ""){
			valid = false;
			showFieldError($('#qstatement'));
		}else{
			hideFieldError($('#qstatement'));
			
			// Si en vez de por post lo queremos hacer por get, cambiamos el $.post por $.get
			$.post('CreateQuestionServlet', {
				qtype : $('#qtypevalue').val(),
				qstatement: $('#qstatement').val(),
				mandatory: $('#mandatory').val(),
				helpText: $('#help-text').val(),
				surveyid: $('#surveyid').val(),
				pageid: $('#pageid1').val(),
				langsurvey : $("#survey-language-version").val()
			}, function(responseText) {
				var index = responseText.indexOf("<html");
				if(index >= 0) {window.location.replace(host + "/SurveyTool/SurveysServlet");}
				else {currentAddNode.closest('li[id=page]').find('#page-items').append(responseText);}
			});
			$('#qstatement').val("");
			//$('#main-version').val("none");
			$('#mandatory').val("false");
			$('#help-text').val("false");
			$('#' + qtypeId + " i").css("background-color","#fff");
			$('#frame-basic-Settings').css('display', 'none');
			
			//$('#modal').modal('hide');
			//$('#newQuestionModal').hide();
			$('#newQuestionModal').modal('toggle');
		}
	});
	
	var newquota = 1000;
	$('#create-quota').click(function(event) {
			
			$('#newQuotaModal').modal('toggle');
			newquota = $("#selquestionnewquota").val();
			
			//Copy survey-quota-new
			if($("#survey-quota-"+newquota).length > 0){
				alertNotQuota();
			}else{
				var newQuota=$('#survey-quota-new').clone();
				newQuota.css("display","block");
				newQuota.attr("quota",newquota);
				newQuota.attr("sid",newquota);
				newQuota.attr("id","survey-quota-"+newquota);
				var selectQuota = newQuota.find('select');
				selectQuota.attr("id","selquestionforfees"+newquota);
				selectQuota.attr("name","selquestionforfees"+newquota);
				selectQuota.attr("onchange","changeoptionsfees("+newquota+")");
				
				var h5title =  newQuota.find('h5');
				h5title.attr("id","questionquotaname"+newquota);
				
				var divoptions = newQuota.find('#optionsquotanew');
				divoptions.attr("id","optionsquota"+newquota);
				
				
				//newQuota.prependTo("#listcompletequotas");
				newQuota.insertBefore("#survey-quota-new");
				$('#selquestionforfees'+newquota).val(newquota);
				loadvaluequestion(newquota);
				//eliminar opcion del combo
				//$("#selquestionnewquota").find('[value="'+newquota+'"]').remove();
				$('#questionquotaname'+newquota).html($("#selquestionforfees"+newquota +" option:selected").text());
			}
			
	});
	
	$('#page').on("click", '#btn-question', function(){
		currentAddNode = $(this).parent().parent().parent();
		$("#newQuestionModal").modal("show");
	});
	
	$('#listcompletequotas').on("click", '#btn-add-quota', function(){
		currentAddNode = $(this).parent().parent().parent();
		$("#newQuotaModal").modal("show");
	});
	
	$('#page-items').on("click", '#editFile', function(){
		currentElement = JSON.parse($(this).attr("data-image"));
		console.log("editfile opening... " + JSON.stringify(currentElement));
		$("#updateFile").attr("rid", currentElement.rId);
		if(currentElement.rType === 'image')
		{
			console.log("Image");
			$("#previewImage").removeClass("hidden");
			$("#imageFilePreview").attr("src", currentElement.path);
			$("#resourceAltText").removeClass("hidden");
			$("#rAltText").val(currentElement.altText);
			$("#previewVideo").addClass("hidden");
			$("#resDescText").addClass("hidden");
		}
		else if(currentElement.rType === 'video')
		{
			console.log("Video");
			$("#previewVideo").removeClass("hidden");
			$("#resDescText").removeClass("hidden");
			$("#reproductor_preview").attr("src", "https://www.youtube.com/embed/" + currentElement.path + "?enablejsapi=1");
			$("#reproductor_preview").attr("data-title", currentElement.tittle);
			$("#rDescText").val(currentElement.descText);
			$("#previewImage").addClass("hidden");
			$("#resourceAltText").addClass("hidden");
		}		
		$("#rTitle").val(currentElement.tittle);				
		$("#updateFile").modal("show");
	});
	
	$('#page-items').on("keyup", "#option-list #option-item input", function(e){
		e.stopPropagation();
		var index = $(this).attr('index');
		$(this).closest('li[id=panel-question1]').find('label[id=optionRadioLabel' + index + ']').text($(this).val());
		//console.log("Option text field!!!! " + $(this).parent().parent().children("li").size());
	});
	
	$('#page-items').on("keyup", "#optionmatrix-list #optionmatrix-item input", function(e){
		e.stopPropagation();
		var index = $(this).attr('index');
		$(this).closest('li[id=panel-question1]').find('label[id=optionRadioLabel' + index + ']').text($(this).val());
		//console.log("Option text field!!!! " + $(this).parent().parent().children("li").size());
	});
	
	$('#page-items').on("keyup", "#optionsgroupmatrix-list #optionsgroupmatrix-item input", function(e){
		e.stopPropagation();
		var index = $(this).attr('index');
		$(this).closest('li[id=panel-question1]').find('label[id=optionRadioLabel' + index + ']').text($(this).val());
		//console.log("Option text field!!!! " + $(this).parent().parent().children("li").size());
	});
	
	$('#page-items').on("focusout", "#option-list #option-item input", function(e){
		e.stopPropagation();
		//console.log("language: " + $('#survey-language-version').val());
		if($(this).val() != "")
		{
			console.log("TExt: " + $(this).val() + " - qid: " + $(this).attr('index') + " - qid: " + $(this).closest('li[id=panel-question1]').attr('qid') + " - ogid: " + $(this).closest('ul').attr('ogid'));
			var req = {};
			var currentNode = $(this);
			req.text = currentNode.val();
			req.oid = currentNode.attr('oid');
			req.index = currentNode.attr('index');
			req.qid = currentNode.closest('li[id=panel-question1]').attr('qid');
			req.ogid = currentNode.closest('ul').attr('ogid');
			req.lang = $('#survey-language-version').val();
			req.otype = currentNode.closest('ul').attr('otype');
			
			$.ajax({ 
			   type: "POST",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QCService/insertOption",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   if(data != '')
				   {
					   var json = JSON.parse(data);
					   if(json.hasOwnProperty('oid'))
					   {
						   console.log("hello oid: " + json.oid);
						   currentNode.attr('oid', json.oid);
					   }
					   
					   if(json.hasOwnProperty('ogid'))
					   {
						   console.log("hello ogid: " + json.ogid);
						   currentNode.closest('ul').attr('ogid', json.ogid);
					   }
					   
					   currentNode.closest('li').find('#remove-option').attr('aria-label', 'Remove option: ' + req.text);
				   }
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
			});
		}
	});
	
	insertValueQuota();
	
	$("#objetivesurveys").focusout(function() {
		//if($(this).val() != ""){
			
			var req = {};
			var currentNode = $(this);
			req.text = currentNode.val();
			req.sid = currentNode.attr('sid');
			req.objetive = currentNode.val();
			
			console.log("sid: " + req.sid + " - objetive: " + req.objetive);
			
			$.ajax({ 
			   type: "POST",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuotaService/updateObjetive",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   if(data != '')
				   {
					   var jsonresponse = JSON.parse(data);
					   if(jsonresponse.hasOwnProperty('sid'))
					   {
						   
							
						   
					   }
					   
					  
				   }
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
			});
		//}
	});
	
	
	
	$('#page-items').on("focusout", "#optionmatrix-list #optionmatrix-item input", function(e){
		e.stopPropagation();
		//console.log("language: " + $('#survey-language-version').val());
		if($(this).val() != "")
		{
			console.log("TExt: " + $(this).val() + " - qid: " + $(this).attr('index') + " - qid: " + $(this).closest('li[id=panel-question1]').attr('qid') + " - oid: " + $(this).closest('ul').attr('oid'));
			var req = {};
			var currentNode = $(this);
			req.text = currentNode.val();
			req.oid = currentNode.attr('oid');
			req.ogid = 0;
			req.index = currentNode.attr('index');
			req.qid = currentNode.closest('li[id=panel-question1]').attr('qid');
			req.lang = $('#survey-language-version').val();
			req.otype = currentNode.closest('ul').attr('otype');
			
			$.ajax({ 
			   type: "POST",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QCService/insertOptionMatrix",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   if(data != '')
				   {
					   var json = JSON.parse(data);
					   if(json.hasOwnProperty('oid'))
					   {
						   console.log("hello oid: " + json.oid);
						   currentNode.attr('oid', json.oid);
					   }
					   
					   currentNode.closest('li').find('#remove-optionmatrix').attr('aria-label', 'Remove option: ' + req.text);
				   }
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
			});
		}
	});
	

	
	$('#page-items').on("focusout", "#optionsgroupmatrix-list #optionsgroupmatrix-item input", function(e){
		e.stopPropagation();
		//console.log("language: " + $('#survey-language-version').val());
		//console.log("option lalala valor: " + $(this).val());
		if($(this).val() != "")
		{
			console.log("TExt (optionsGroupMatrix): " + $(this).val() + " - qid: " + $(this).attr('index') + " - qid: " + $(this).closest('li[id=panel-question1]').attr('qid') + " - ogid: " + $(this).attr('ogid'));
			var req = {};
			var currentNode = $(this);
			req.text = currentNode.val();
			req.index = currentNode.attr('index');
			req.qid = currentNode.closest('li[id=panel-question1]').attr('qid');
			req.ogid = currentNode.attr('ogid');
			req.oid = 0;
			req.lang = $('#survey-language-version').val();
			req.otype = currentNode.closest('ul').attr('otype');
			
			$.ajax({ 
			   type: "POST",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QCService/insertOptionsGroupMatrix",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log("Dentro del function: "+data);
				   if(data != '')
				   {
					   var json = JSON.parse(data);
					   if(json.hasOwnProperty('ogid'))
					   {
						   console.log("hello ogid: " + json.ogid);
						   currentNode.attr('ogid', json.ogid);						   
					   }
					   
					   currentNode.closest('li').find('#remove-optionsgroupmatrix').attr('aria-label', 'Remove option: ' + req.text);
				   }
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
			});
		}
	});
	
	
	$('#page-items').on("click", "#option-list #btn-add-option", function(e){
		var index = $(this).parent().parent().children("li").size();
		var optionHtml = '<li class="option-item" id="option-item" oid="0">' +
								//'<button class="btn btn-transparent fleft"><i class="fa fa-sort fa-2x"></i></button> ' +		
								'<div class="circle-info circle-grey fleft">' + index + '</div> ' + 
								'<input id="option" type="text" class="option-title form-control fleft" index="' + index + '" oid="0" placeholder="'+textOption+' ' + index + '" autofocus/> ' +
								'<div class="option-icons fleft"> ' +
									//'<button class="btn btn-transparent fleft" id="add-file-option"  active="false" data-toggle="modal" data-target="#importFile"><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button> ' +
									'<button class="btn btn-transparent fleft" id="add-file-option"  active="false"><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></button> ' +
									//'<button class="btn btn-transparent fleft"><i class="fa fa-question-circle fa-2x"></i></button> ' +
									'<button class="btn btn-transparent fleft red" id="remove-option" aria-label="remove option"><i class="fa fa-trash fa-2x"></i></button> ' +
								'</div> ' +
								'<div class="row margin-top-40" type="global" id="multimediaFrame"><label>'+textOptionFile+'</label><div id="div_files"><div class="option-files-frame hidden"><ul class="multimedia-list" id="multimediaFilesList"></ul></div></div></div>' +
							'</li>';
		$(this).parent().before(optionHtml);
		//$(this).closest('ul').find('input[index=' + index + ']').focus();
	});
	
	
	/*$('#add-file-option').click(function(e){
		
	});*/
	
	$('#page-items').on("click", "#optionmatrix-list #btn-add-optionmatrix", function(e){
		var index = $(this).parent().parent().children("li").size();
		var optionHtml = '<li class="option-item" id="optionmatrix-item">' +
								//'<button class="btn btn-transparent fleft"><i class="fa fa-sort fa-2x"></i></button> ' +		
								'<div class="circle-info circle-grey fleft">' + index + '</div> ' + 
								'<input type="text" class="option-title form-control fleft" index="' + index + '" oid="0" placeholder="Option ' + index + '" autofocus/> ' +
								'<div class="option-icons fleft"> ' +
									//'<button class="btn btn-transparent fleft"><i class="fa fa-file-image-o fa-2x"></i></button> ' +
									//'<button class="btn btn-transparent fleft"><i class="fa fa-question-circle fa-2x"></i></button> ' +
									'<button class="btn btn-transparent fleft red" id="remove-optionmatrix" aria-label="remove option"><i class="fa fa-trash fa-2x"></i></button> ' +
								'</div> ' +
							'</li>';
		$(this).parent().before(optionHtml);
		//$(this).closest('ul').find('input[index=' + index + ']').focus();
	});
	
	$('#page-items').on("click", "#optionsgroupmatrix-list #btn-add-optionsgroupmatrix", function(e){
		var index = $(this).parent().parent().children("li").size();
		var optionHtml = '<li class="option-item" id="optionsgroupmatrix-item">' +
								//'<button class="btn btn-transparent fleft"><i class="fa fa-sort fa-2x"></i></button> ' +		
								'<div class="circle-info circle-grey fleft">' + index + '</div> ' + 
								'<input type="text" class="option-title form-control fleft" index="' + index + '" ogid="0" placeholder="Option ' + index + '" autofocus/> ' +
								'<div class="option-icons fleft"> ' +
									//'<button class="btn btn-transparent fleft"><i class="fa fa-file-image-o fa-2x"></i></button> ' +
									//'<button class="btn btn-transparent fleft"><i class="fa fa-question-circle fa-2x"></i></button> ' +
									'<button class="btn btn-transparent fleft red" id="remove-optionsgroupmatrix" aria-label="remove option"><i class="fa fa-trash fa-2x"></i></button> ' +
								'</div> ' +
							'</li>';
		$(this).parent().before(optionHtml);
		//$(this).closest('ul').find('input[index=' + index + ']').focus();
	});
	
	//$('#uploadedFile').change(function(e) {
	$('#selectFile').on("change", "#uploadedFile", function(e){
		console.log( "uploadedFile" );
		console.log($("#uploadedFile").val());
		var fileValue = $('uploadedFile').val();
		var formData = new FormData(document.getElementById("importFileForm"));
        formData.append("uploadedFile", document.getElementById('uploadedFile').files[0]);
         
        
        //check option file or question file
        
        
         //alert($('#optionsFile').hasClass('hidden'));
         if($('#optionsFile').hasClass('hidden') == true){
        	 formData.append("qid", currentQuestion);
        	 formData.append("oid", currentOption);
        	 formData.append("action", "file");
         } else {
        	 formData.append("rid", $('#rid').val());
        	 formData.append("oid", currentOption);
        	 formData.append("action", "fileUpdate");
         }
         
         $.ajax({
             url: "ImportFileServlet",
             type: "post",
             dataType: "html",
             data: formData,
             cache: false,
             contentType: false,
             processData: false
         }).done(function(res){
             console.log("Respuesta: " + res);
             //$('#selectFile').addClass('hidden');
             if($('#optionsFile').hasClass('hidden')){
            	 $('#optionsFile').removeClass('hidden');
                 $('#optionsFile').append(res);
             }
             else
             {
            	 $('#previewFileUploaded').replaceWith(res);
             }
             
         });
	});
	
	$('#importFile').on('hidden.bs.modal', function () {
	    //alert("close");
	})
	
	$('#importFileForm').on("click", "#btnImportFile", function(e){
		$('#importFileForm').on("submit", function(e){
			console.log("en on(click, #btnImportFile");
			e.preventDefault();
			if(pending)
			{
				return;
			}
			pending = true;

			var type = $('#fileType').val();
			//alert("resource: " + type);
			var req = {};
			req.resourceTitle = $('#resourceTitle').val();
			req.mainVersion= currentLanguage;
			req.resourceType = type;
			
			if(type === "image")
			{
				req.action = "options";
				req.resourceAltText = $('#resourceAltText').val();
				req.rid = $('#rid').val();
				req.oid = currentOption;
			}
			else if(type === "video")
			{
				req.action = type;
				req.resourceDescText = $('#resourceDescText').val();
				req.resourceUrl = $('#resourceUrl').val();
				req.qid = currentQuestion;
				req.oid = currentOption;
			}
			
	        $.post('ImportFileServlet', req, function(res) {
	        	 $('#importFileForm')[0].reset();
	             $("#importFile").modal("hide");
	            if(currentQuestion>=0){
		  			  var multimediaFrame = $("li[qid=" + currentQuestion + "]").find("div[id=multimediaFrame]");
		              multimediaFrame.removeClass("hidden");
		              multimediaFrame.find("div.question-files-frame").removeClass("hidden");
		              multimediaFrame.find("ul[id=multimediaFilesList]").append(res);		
		        }else if(currentOption>=0){
		        	  //var multimediaFrame = $("li[oid=" + currentOption + "]").find("div[id=multimediaFrame]");
		        	  var multimediaFrame = $("input[oid=" + currentOption + "]").parent("li").find("div[id=multimediaFrame]");
		              multimediaFrame.removeClass("hidden");
		              multimediaFrame.find("div.option-files-frame").removeClass("hidden");
		              //
		              multimediaFrame.find("ul[id=multimediaFilesList]").empty();
		              multimediaFrame.find("ul[id=multimediaFilesList]").append(res);	
		        }
	            $('#optionsFile').empty();
	              $('#optionsFile').addClass('hidden');
	              $('#selectFile').addClass("hidden");
	              $('#optionsVideoFile').addClass("hidden");
	              pending = false;
	  		});
		});
	});
	
	$('#selectFiteType').on("change", "#fileType", function(e){
		var type = $(this).val();
		if(type === "video")
		{
			$('#selectFile').addClass("hidden");
			$('#optionsVideoFile').removeClass("hidden");
		}
		else
		{
			$('#selectFile').removeClass("hidden");
			$('#optionsVideoFile').addClass("hidden");
		}
	});
	
	$('#updateFilesSection').on("click", "#btnUpdateFile", function(e){
		e.stopPropagation();		
		var req = {};		
		req.contents = [];

		var content = {};
		
		var changedTitle = '';
		if($('#rTitle').val() != currentElement.tittle)
		{
			changedTitle = $('#rTitle').val();
			content.contentType = "title";
			content.text = changedTitle;
			content.lan = currentLanguage;
			currentElement.tittle = content.text;
			req.contents.push(content);
		}
		
		if(currentElement.rType === "image" && $('#rAltText').val() != currentElement.altText)
		{
			content = {};
			content.contentType = "altText";
			content.text = $('#rAltText').val();
			content.lan = currentLanguage;
			currentElement.altText = content.text
			req.contents.push(content);
		}
		else if(currentElement.rType === "video" && $('#rDescText').val() != currentElement.descText)
		{
			content = {};
			content.contentType = "description";
			content.text = $('#rDescText').val();
			content.lan = currentLanguage;
			currentElement.descText = content.text
			req.contents.push(content);
		}
		
		if(req.contents.length > 0)
		{
			req.type = currentElement.rType;
			req.rid = currentElement.rId;
			
			var serviceUrl = host + "/SurveyTool/api/ResourceService/updateContent";
			
			console.log("Resource update content: " + JSON.stringify(req));
			
			updateContent(req, serviceUrl);
			
			var multimediaElem = $('li[rid=' + currentElement.rId + ']').find('#editFile');
			multimediaElem.attr('data-image', JSON.stringify(currentElement));
			
			if(changedTitle != '')
			{
				var fileName = multimediaElem.html().split('-')[1];
				multimediaElem.html(changedTitle + " - " + fileName);
			}
			
			
		}		
		
		$("#previewVideo").addClass("hidden");
		$("#resDescText").addClass("hidden");
		$("#previewImage").addClass("hidden");
		$("#resourceAltText").addClass("hidden");					
		$("#updateFile").modal("hide");
		
	});
	
	$('#updateFilesSection').on("click", "#btnCancelUpdateFile", function(e){
		$("#previewVideo").addClass("hidden");
		$("#resDescText").addClass("hidden");
		$("#previewImage").addClass("hidden");
		$("#resourceAltText").addClass("hidden");					
		$("#updateFile").modal("hide");		
	});
	
	/*$('#updateFilesSection').on("click", "#btnUpdateFile", function(e){
			console.log("en on(click, #btnUpdateFile");
			e.preventDefault();
			if(pending)
			{
				return;
			}
			pending = true;
			console.log( $('#resourceTitle').val());
			console.log($('#resourceAltText').val());
			console.log(currentLanguage);
			console.log($(this).closest('.form-group').attr('id'));
	        $.post('ImportFileServlet', {
	        	action : "options",
	        	resourceTitle: $('#resourceTitle').val(),
	  			resourceAltText: $('#resourceAltText').val(),
	  			mainVersion: currentLanguage,
	  			rid: $(this).attr('rid').val()
	  		}, function(res) {
	  			$('#updateFileForm')[0].reset();
	              $("#updateFile").modal("hide");
	              var multimediaFrame = $("li[qid=" + currentQuestion + "]").find("div[id=multimediaFrame]");
	              multimediaFrame.removeClass("hidden");
	              multimediaFrame.find("div.question-files-frame").removeClass("hidden");
	              multimediaFrame.find("ul[id=multimediaFilesList]").append(res);		
	              $('#updateFilesSection').empty();
	              $('#updateFilesSection').addClass('hidden');
	              pending = false;
	  		});
	});*/
	
	$('#page-items').on("click", "#btn-question-import-file", function(e){
		currentOption = -1;
		currentQuestion = $(this).closest('li[id=panel-question1]').attr('qid');
		currentLanguage = $('#survey-language-version').val();
		console.log("current question: " + currentQuestion + " - language: " + currentLanguage);
	});
	
	
	$('#page-items').on("click", "#add-file-option", function(e){
		
		currentQuestion = -1;
		currentOption = $(this).closest('li').find('input[id=option]').attr('oid');
		
		if(currentOption>0){
			currentLanguage = $('#survey-language-version').val();
			console.log("current question: " + currentQuestion + " - language: " + currentLanguage);
			$('#importFile').modal();
		}else{
			alert("First, complete the option");
			
			
		}
	});
	
		
	$('#page-items').on("change", "#type-matrix", function(e){
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = $(this).val();
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateParameters",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
				   if(data == 'Multiple')
				   {			
					   node.closest('div.question-frame').find('ul').attr('otype', 'checkbox');
					   //node.closest('div.question-frame').find('#optionsgroupmatrix-list').attr('otype', 'checkbox');
				   }
				   else
				   {
					   node.closest('div.question-frame').find('ul').attr('otype', 'radio');
					   //node.closest('div.question-frame').find('#optionsgroupmatrix-list').attr('otype', 'radio');
				   }
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});

	$('#survey-sections').on("click", "#removeSection", function(e){
		var item = $(this).closest('#panel-section1');
		currentQuestion = item.attr('scid');
		$("#elementToRemoveText").html('"Question: ' + item.find('#survey-section-title').val() + '"');
		$("#removeElemId").val(item.attr('scid') + '/' + $('#survey-info').attr('sid'));
		$("#removeElemService").val('SectionService');
		$("#removeElement").modal("show");
	});
	
	$('#page-items').on("click", "#removeQuestion", function(e){
		var item = $(this).closest('#panel-question1');
		currentQuestion = item.attr('qid');
		$("#elementToRemoveText").html('"Question: ' + item.find('#survey-question-title').val() + '"');
		$("#removeElemId").val(item.attr('qid') + '/' + item.closest('li[id=page]').attr('pid'));
		$("#removeElemService").val('QuestionService');
		$("#removeElement").modal("show");
	});
	
	$('#page-items').on("click", "#removeMultimediaFile", function(e){
		var item = $(this).closest('li.multimedia-item');
		$("#elementToRemoveText").html('"' + item.find('a').text() + '"');
		$("#removeElemId").val(item.attr('rid'));
		$("#removeElemService").val('ResourceService');
		$("#removeElement").modal("show");
	});
	
	$('#page-items').on("click", "#remove-option", function(e){
		console.log("Remove option");
		currentQuestion = $(this).closest('#panel-question1').attr('qid');
		
		var item = $(this).closest('li');
		var input = item.find('input');
		$("#elementToRemoveText").html('"Option: ' + input.val() + '"');
		$("#removeElemId").val(input.attr('oid'));
		$("#removeElemService").val('OptionService');
		$("#removeElement").modal("show");
	});
	
	$('#page-items').on("click", "#remove-optionmatrix", function(e){
		console.log("Remove option matrix");
		currentQuestion = $(this).closest('#panel-question1').attr('qid');
		var item = $(this).closest('li');
		var input = item.find('input');
		$("#elementToRemoveText").html('"Option: ' + input.val() + '"');
		$("#removeElemId").val(input.attr('oid'));
		$("#removeElemService").val('OptionMatrixService');
		$("#removeElement").modal("show");
	});
	
	$('#page-items').on("click", "#remove-optionsgroupmatrix", function(e){
		console.log("Remove optionsgroup matrix");
		currentQuestion = $(this).closest('#panel-question1').attr('qid');
		var item = $(this).closest('li');
		var input = item.find('input');
		$("#elementToRemoveText").html('"Option: ' + input.val() + '"');
		$("#removeElemId").val(input.attr('ogid'));
		$("#removeElemService").val('OptionsGroupMatrixService');
		$("#removeElement").modal("show");
	});
	
	
	deleteQuote();
	
	$('#removeElement').on("click", "#acceptRemoveElement", function(e){
		
		var elementId = $('#removeElemId').val(); 
		var service = $("#removeElemService").val();
		console.log("Resource ID: " + elementId);
		
		//console.log("number items: " + $('li[rid=' + resourceId + ']').closest("ul").find("li").size());
		
		$.ajax({ 
		   url: host + "/SurveyTool/api/" + service + "/" + elementId,
		   type: "DELETE",
		   success: function (data) {
			   console.log(data);
			   if(data == 'true')
			   {
				   $("#removeElement").modal("hide");
				   if(service == "ResourceService")
				   {
					   if($('#multimediaFilesList li').length<2){
						   $('li[rid=' + elementId + ']').closest('div.question-files-frame').addClass('hidden'); 
					   }
					   $('li[rid=' + elementId + ']').remove();
					   console.log("Number of elements: "+$('#multimediaFilesList li').length);
					   
				   }
				   else if(service == "QuestionService")
				   {
					   $('li[qid="' + currentQuestion + '"]').remove();
				   }
				   else if(service == "OptionService")
				   {
					   var input = $('input[oid=' + elementId + ']'); 					   
					   var numItems = input.closest("ul").find("li").size();
					   console.log("Items: " + numItems);
					   if(numItems > 3)
					   {
						   input.closest("li").remove();
						   $('li[qid=' + currentQuestion + '] ul[id=option-list] li[id=option-item]').each(function(i, elem)
						   {
							   console.log("li: " + i + " - elem: " + $(elem).find('input').val());
							   var index = i + 1;
							   $(elem).find('input').attr('index', index);
							   $(elem).find('input').attr('placeholder', "Option " + index)
							   $(elem).find('.circle-grey').text(index);
						   });
					   }
					   else
					   {
						   input.val("");
					   }
				   }
				   else if(service == "OptionMatrixService")
				   {
					   var input = $('input[oid=' + elementId + ']'); 					   
					   var numItems = input.closest("ul").find("li").size();
					   console.log("Items: " + numItems);
					   if(numItems > 3)
					   {
						   input.closest("li").remove();
						   $('li[qid=' + currentQuestion + '] ul[id=optionmatrix-list] li[id=optionmatrix-item]').each(function(i, elem)
						   {
							   console.log("li: " + i + " - elem: " + $(elem).find('input').val());
							   var index = i + 1;
							   $(elem).find('input').attr('index', index);
							   $(elem).find('input').attr('placeholder', "Option " + index)
							   $(elem).find('.circle-grey').text(index);
						   });
					   }
					   else
					   {
						   input.val("");
					   }
				   }
				   else if(service == "OptionsGroupMatrixService")
				   {
					   var input = $('input[ogid=' + elementId + ']'); 					   
					   var numItems = input.closest("ul").find("li").size();
					   console.log("Items: " + numItems);
					   if(numItems > 3)
					   {
						   input.closest("li").remove();
						   $('li[qid=' + currentQuestion + '] ul[id=optionsgroupmatrix-list] li[id=optionsgroupmatrix-item]').each(function(i, elem)
						   {
							   console.log("li: " + i + " - elem: " + $(elem).find('input').val());
							   var index = i + 1;
							   $(elem).find('input').attr('index', index);
							   $(elem).find('input').attr('placeholder', "Option " + index)
							   $(elem).find('.circle-grey').text(index);
						   });
					   }
					   else
					   {
						   input.val("");
					   }
				   }
				   else if(service == "SectionService")
				   {
					   var ids = elementId.split('/');
					   $('li[scid=' + ids[0] + ']').find('ul[id=section-pages]').each(function(indice, elemento) {
						   if(indice == 0)
						   {
							   $(elemento).find('ul[id=page-items]').empty();
						   }
						   else
						   {
							   $(elemento).remove();
						   }
					   });
					   $('li[scid=' + ids[0] + ']').find('input[id=survey-section-title]').val('Section 1');
				   }
				   else if(service == "QuotaService")
				   {
					   
					   $('#survey-quota-'+quotaid).remove();
				   }
			   }
			   else
			   {
				   if(service == "SectionService")
				   {
					   var ids = elementId.split('/');
					   $('li[scid=' + ids[0] + ']').remove();
				   }
			   }
			   
		   },
		   error: function (xhr, ajaxOptions, thrownError) {
			   console.log(xhr.status);
			   console.log(thrownError);
			   console.log(xhr.responseText);
			   console.log(xhr);
		   }
		});
	});
	
	$('#survey-info').on("focusout", "#survey-info-title", function(e){
		e.stopPropagation();		
		var req = {};		
		req.text = $(this).val();
		
		req.contentType = "title";
		req.lan = $("#survey-language-version").val();
		req.sid = $(this).closest('#survey-info').attr('sid');		
		var serviceUrl = host + "/SurveyTool/api/SurveyService/updateContent";
		
		//check de title
		var valid = true;
		if(req.text == ""){
			valid = false;
			showFieldError($('#survey-info-title'));
		}else{
			hideFieldError($('#survey-info-title'));
			updateContent(req, serviceUrl);
		}
		
	});
	
	$('#survey-info').on("focusout", "#surveyDescription", function(e){
		e.stopPropagation();		
		var req = {};		
		req.text = $(this).val();
		req.contentType = "description";
		req.lan = $("#survey-language-version").val();
		req.sid = $(this).closest('#survey-info').attr('sid');		
		var serviceUrl = host + "/SurveyTool/api/SurveyService/updateContent";
		
		updateContent(req, serviceUrl);
	});
	
	$('#survey-info').on("focusout", "#surveyProject", function(e){
		e.stopPropagation();		
		var req = {};		
		req.project = $(this).val();
		req.sid = $(this).closest('#survey-info').attr('sid');		
		var serviceUrl = host + "/SurveyTool/api/SurveyService/updateProject";
		
		var valid = true;
		//check de name project
		if(req.project == ""){
			valid = false;
			showFieldError($('#surveyProject'));
		}else{
			hideFieldError($('#surveyProject'));
			updateContent(req, serviceUrl);
		}
		
	});
	
	$('#survey-sections').on("focusout", "#survey-section-title", function(e){
		e.stopPropagation();	
		var req = {};		
		req.text = $(this).val();
		req.contentType = "title";
		req.lan = $("#survey-language-version").val();
		req.scid = $(this).closest('#panel-section1').attr('scid');		
		var serviceUrl = host + "/SurveyTool/api/SectionService/updateContent";
		
		//check de section title
		var valid = true;
		if(req.text == ""){
			valid = false;
			showFieldError($('#survey-section-title'));
		}else{
			hideFieldError($('#survey-section-title'));
			updateContent(req, serviceUrl);
		}
	});
	
	$('#page-items').on("click", "#helpTextButton", function(e){
		currentQuestion = $(this).closest('li[id=panel-question1]').attr('qid');
		currentLanguage = $('#survey-language-version').val();
		console.log("current question: " + currentQuestion + " - language: " + currentLanguage);
	});
	
	$('#setHelpText').on("click", "#btnSendHelpText", function(e){
		e.stopPropagation();		
		var req = {};		
		req.text = $('#helpText').val();
		req.contentType = "helpText";
		req.lan = currentLanguage;
		req.qid = currentQuestion;	
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateContent",
			   data: JSON.stringify(req),
			   success: function (data) {
				   if(data == "true")
				   {
					   var qNode = $('li[qid=' + currentQuestion + ']');
					   qNode.find('#question-frame-help').removeClass("hidden");
					   qNode.find('#question-frame-help-text').html(req.text);
					   $("#setHelpText").modal("hide");
				   }
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("click", "#mandatoryButton", function(e){
		console.log("mandatory");
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateMandatory",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("click", "#askAlwaysButton", function(e){
		console.log("ask always");
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateOptionalAnswer",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("focusout", "#survey-question-max-chars", function(e){
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = $(this).val();
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateTextLength",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("focusout", "#survey-question-decimals", function(e){
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = $(this).val();
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateDecimals",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("change", "#isLimitedChars", function(e){
		e.stopPropagation();
		console.log("isLimitedChars");
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = "";
		console.log("node.checked: "+node.is(":checked"));
		if(node.is(":checked")){
			node.closest('div.question-response-settings').find('#charsId').attr('class','question-response-settings-sub-inherit');
		}else{
			console.log("Está deseleccionado");
			node.closest('div.question-response-settings').find('#charsId').attr('class','question-response-settings-sub-none');
		}
		node.closest('#genericOptions').find('#survey-question-max-chars').val('');
		
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateTextLength",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("change", "#range", function(e){
		e.stopPropagation();
		console.log("range");
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = "";
		console.log("node.checked: "+node.is(":checked"));
		if(node.is(":checked")){
			node.closest('div.question-response-settings').find('#rangeId').attr('class','question-response-settings-sub-inherit');
		}else{
			console.log("Está deseleccionado");
			node.closest('div.question-response-settings').find('#rangeId').attr('class','question-response-settings-sub-none');
		}
		node.closest('#rangeOptions').find('#survey-minValue').val('');
		node.closest('#rangeOptions').find('#survey-maxValue').val('');
		
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateMinValue",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
		
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateMaxValue",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("change", "#allowDecimals", function(e){
		e.stopPropagation();
		console.log("allowDecimals");
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = "";
		console.log("node.checked: "+node.is(":checked"));
		if(node.is(":checked")){
			node.closest('div.question-response-settings').find('#decimalsDiv').attr('class','question-response-settings-sub-inherit');
		}else{
			console.log("Está deseleccionado");
			node.closest('div.question-response-settings').find('#decimalsDiv').attr('class','question-response-settings-sub-none');
		}
		node.closest('#decimalsOptions').find('#survey-question-decimals').val('');
		
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateDecimals",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("change", "#input-type", function(e){
		e.stopPropagation();
		console.log("change in input type");
		var node = $(this);
		var reqF = {};
		reqF.qid = node.closest('li[id=panel-question1]').attr('qid');
		reqF.pid = node.closest('li[id=page]').attr('pid');
		reqF.inputMode = node.closest('div.row').find('#input-mode').val();
		reqF.text = node.val();
		
		if(node.val()==="formFieldTypeNumber"){
			console.log("isNumber");
			node.closest('div.row').find('#rangeOptions').removeClass('hidden');
			node.closest('div.row').find('#decimalsOptions').removeClass('hidden');
			node.closest('div.row').find('#genericOptions').addClass('hidden');
		}else{
			console.log("isNotNumber");
			node.closest('div.row').find('#rangeOptions').addClass('hidden');
			node.closest('div.row').find('#decimalsOptions').addClass('hidden');
			node.closest('div.row').find('#genericOptions').removeClass('hidden');
		}
		
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateInputTypeMode",
			   data: JSON.stringify(reqF),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
		
	});
	
	$('#page-items').on("focusout", "#survey-question-max-lines", function(e){
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = $(this).val();
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateTextLines",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("change", "#adjust-lines-adjust", function(e){
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		console.log("OnClick on adjust-lines-adjust");
		node.closest('div.row').find('#lines').attr('class', 'question-response-settings-sub-none');
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = "";

		node.closest('div.row').find('#survey-question-max-lines').val('');
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateTextLines",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("change", "#adjust-lines-set", function(e){
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		console.log("OnClick on adjust-lines-set");
		node.closest('div.question-response-settings').find('#lines').attr('class','question-response-settings-sub-inherit');
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = "";

		node.closest('div.question-response-settings').find('#survey-question-max-lines').val('');
		
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateTextLines",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("focusout", "#survey-minValue", function(e){
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = $(this).val();
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateMinValue",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("focusout", "#survey-maxValue", function(e){
		e.stopPropagation();
		var node = $(this); 
		var req = {};
		req.qid = node.closest('li[id=panel-question1]').attr('qid');
		req.pid = node.closest('li[id=page]').attr('pid');
		req.text = $(this).val();
		$.ajax({ 
			   type: "PUT",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuestionService/updateMaxValue",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   node.attr('active', data);
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
		});
	});
	
	$('#page-items').on("focusout", "#survey-question-title", function(e){
		
		
		e.stopPropagation();
		var req = {};		
		req.text = $(this).val();
		req.contentType = "title";
		req.lan = $("#survey-language-version").val();
		req.qid = $(this).closest('#panel-question1').attr('qid');		
		var serviceUrl = host + "/SurveyTool/api/QuestionService/updateContent";
		
		//alert("focusout");
		//check de section title
		var valid = true;
		if(req.text == ""){
			valid = false;
			//showFieldError($('#survey-question-title'+req.qid));
			$('#survey-question-title'+req.qid+'-error').removeClass('hidden');
			$('#survey-question-title'+req.qid+"-feedback").removeClass('hidden');
			
			$(this).prop("class", "survey-section-title-selected");
			
			//$(this).css({'border':"2px solid !important"});
			//$(this).css({'border-color':"#23527C !important"});
			
		}else{
			//hideFieldError($('#survey-question-title'+req.qid));
			$('#survey-question-title'+req.qid+'-error').addClass('hidden');
			$('#survey-question-title'+req.qid+"-feedback").addClass('hidden');
			
			$(this).prop("class", "survey-section-title-unselected");
			
			//$(this).css('border','none !important');
			
			
			updateContent(req, serviceUrl);
		}
		
		
	});

	$('#page-items').on("focusout", "#survey-question-description-text", function(e){
		e.stopPropagation();
		var req = {};		
		req.text = $(this).val();
		req.contentType = "description";
		req.lan = $("#survey-language-version").val();
		req.qid = $(this).closest('#panel-question1').attr('qid');		
		var serviceUrl = host + "/SurveyTool/api/QuestionService/updateContent";
		
		updateContent(req, serviceUrl);
	});	
	
	$('#page-items').on("focusout", "#survey-question-other-text", function(e){
		e.stopPropagation();
		var req = {};		
		req.text = $(this).val();
		req.contentType = "other";
		req.lan = "en";
		req.qid = $(this).closest('#panel-question1').attr('qid');		
		var serviceUrl = host + "/SurveyTool/api/QuestionService/updateContent";
		
		updateContent(req, serviceUrl);
	});		
	
	//drag and drop
	$("#page-items").sortable({
		connectWith:".s1",
		start:function(){
			console.log("Estas utilizando Drag and Drop: " + $(this).attr('id'));
		},
		stop:function(event, ui){
			var prevId = '0';
			if($(ui.item).prev().length) prevId = $(ui.item).prev().attr('qid');
	
			var req = {};		
			req.qid = $(ui.item).attr('qid');
			req.prevId = prevId;
			req.pid = $(this).closest('li[id=page]').attr('pid');
			
			$.ajax({ 
				   type: "PUT",
				   dataType: "text",
				   contentType: "text/plain",
				   url: host + "/SurveyTool/api/QuestionService/updateIndex",
				   data: JSON.stringify(req),
				   success: function (data) {
					   if(data == "")
					   {
						   console.log("llega");
						  /* var qNode = $('li[qid=' + currentQuestion + ']');
						   qNode.find('#question-frame-help').removeClass("hidden");
						   qNode.find('#question-frame-help-text').html(req.text);
						   $("#setHelpText").modal("hide");*/
					   }
				   },
				   error: function (xhr, ajaxOptions, thrownError) {
					   console.log(xhr.status);
					   console.log(thrownError);
					   console.log(xhr.responseText);
					   console.log(xhr);
				   }
			});
		}
	});
	
	
	
	
	
});


function loadquotas(json){
	jsonquotas = json;
}

function loadvaluequestion(id){
	$("#selquestionforfees"+id).change(function(){
		var currentNode = $(this);
		currentNode.closest('.widthTitleSurveyCollapsed').attr('qid',$('#selquestionforfees'+id).val());
	});
	
	$('#selquestionforfees'+id).trigger("change");
	$('#selquestionforfees'+id).prop("disabled", true);
	
	
	
	insertValueQuota();
	deleteQuote();
	
}



function changeoptionsfees(id){
	var valuesel = $("#selquestionforfees"+id).val();
	
	$('#optionsquota'+id).empty();
	
	//if(jsonquotas === "undefined"){
		var json = jQuery.parseJSON(jsonquotas);
		for (var i=0;i<json[0].questions.length;++i)
	    {
			if(json[0].questions[i].questionId == valuesel){
				$('#optionsquota'+id).attr("ogid", json[0].questions[i].optionsGroup[0].optionsGroupId);
				for (var j=0;j< json[0].questions[i].optionsGroup[0].options.length;++j){
					var placeholdermax="none";
					var placeholdermin="none";
					var max=json[0].questions[i].optionsGroup[0].options[j].max;
					var min=json[0].questions[i].optionsGroup[0].options[j].min;
					
					if(max>0){
						max = "value='"+json[0].questions[i].optionsGroup[0].options[j].max+"' ";
					}
					
					if(min>0){
						min = "value='"+json[0].questions[i].optionsGroup[0].options[j].min+"' ";
					}
					
					//$('#optionsquota'+id).append("<div class='form-group' style='margin:0px;display: inline-flex;' id='optionquota'><div class='form-group col-md-4'><label class='control-label profileLabel' for='language'>"+json[0].questions[i].optionsGroup[0].options[j].title+"</label></div><div class='form-group col-md-4'><label class='col-md-4 control-label profileLabel' for='language'>Min</label><input id='min"+json[0].questions[i].optionsGroup[0].options[j].optionId+"' name='min' type='number' placeholder='none' class='form-control-small col-md-8' "+min+" index='"+j+"' oid='"+json[0].questions[i].optionsGroup[0].options[j].optionId+"' style='width: 60%;' min='1'></div><div class='form-group col-md-4'><label class='col-md-4 control-label profileLabel' for='language'>Max</label> <input id='max"+json[0].questions[i].optionsGroup[0].options[j].optionId+"' name='max' type='number' placeholder='none' class='form-control-small col-md-8' "+max+" index='"+j+"' oid='"+json[0].questions[i].optionsGroup[0].options[j].optionId+"' style='width: 60%;' min='1'></div></div>");
					$('#optionsquota'+id).prepend("<div class='form-group' style='margin:0px;display: inline-flex;' id='optionquota'><fieldset class='form-group col-md-4' style='width:100%'><legend class='col-md-4' style='border:0px;font-size:16px;'>"+json[0].questions[i].optionsGroup[0].options[j].title+"</legend><div class='form-group col-md-4'><label class='col-md-4 control-label profileLabel'>Min</label><input id='min"+json[0].questions[i].optionsGroup[0].options[j].optionId+"' name='min' type='number' placeholder='none' class='form-control-small col-md-8' "+min+" index='"+j+"' oid='"+json[0].questions[i].optionsGroup[0].options[j].optionId+"' style='width: 60%;' min='1'></div><div class='form-group col-md-4'><label class='col-md-4 control-label profileLabel'>Max</label> <input id='max"+json[0].questions[i].optionsGroup[0].options[j].optionId+"' name='max' type='number' placeholder='none' class='form-control-small col-md-8' "+max+" index='"+j+"' oid='"+json[0].questions[i].optionsGroup[0].options[j].optionId+"' style='width: 60%;' min='1'></fieldset></div>");
				}
				
			}
			
	    }
	//}
		$('#questionquotaname'+id).html($("#selquestionforfees"+id +" option:selected").text());
	
}

function updateContent(req, serviceUrl)
{
	
	$.ajax({ 
	   type: "PUT",
	   dataType: "text",
	   contentType: "text/plain",
	   url: serviceUrl,
	   data: JSON.stringify(req),
	   success: function (data) {
		   console.log(data);		   
	   },
	   error: function (xhr, ajaxOptions, thrownError) {
		   console.log(xhr.status);
		   console.log(thrownError);
		   console.log(xhr.responseText);
		   console.log(xhr);
	   }
	});
}

function limit(element)
{
    var max_chars = 4;

    if(element.value.length >= max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
}

function limitInput(element, max_chars)
{
console.log(max_chars);
    if(element.value.length >= max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
}

function insertValueQuota(){
	$('.widthTitleSurveyCollapsed').on("focusout", "#optionquota input", function(e){
		e.stopPropagation();
		//if($(this).val() != ""){
			
			var req = {};
			var currentNode = $(this);
			req.text = currentNode.val();
			req.oid = currentNode.attr('oid');
			req.index = currentNode.attr('index');
			req.qid = currentNode.closest('.widthTitleSurveyCollapsed').attr('qid');
			req.sid = currentNode.closest('.widthTitleSurveyCollapsed').attr('sid');
			req.ogid = currentNode.closest('.optionsquota').attr('ogid');
			
			var max = $("#max"+req.oid).val();
			var min = $("#min"+req.oid).val();
			
			if(max=="")max=0;
			if(min=="")min=0;
			
			req.max = max;
			req.min = min;
			
			console.log("TExt: " + $(this).val() + " - qid: " + $(this).attr('index') + " - : " + req.qid + " - ogid: " + req.oid);
			//alert("TExt: " + $(this).val() + " - qid: " + $(this).attr('index') + " - qid: " + req.qid + " - ogid: " + req.oid);
			var host = "http://" + window.location.host;
			
			$.ajax({ 
			   type: "POST",
			   dataType: "text",
			   contentType: "text/plain",
			   url: host + "/SurveyTool/api/QuotaService/insertQuota",
			   data: JSON.stringify(req),
			   success: function (data) {
				   console.log(data);
				   if(data != '')
				   {
					   var jsonresponse = JSON.parse(data);
					   if(jsonresponse.hasOwnProperty('oid'))
					   {
						   console.log("hello oid: " + jsonresponse.oid);
						   //update jsonquotas
						   var json = jQuery.parseJSON(jsonquotas);
						   for (var i=0;i<json[0].questions.length;i++)
						    {
							   		if(json[0].questions[i].optionsGroup.length==0 || json[0].questions[i].optionsGroup[0]==='undefined' || json[0].questions[i].optionsGroup[0].options==='undefined'){
							   		}else{
										for (var j=0; j < json[0].questions[i].optionsGroup[0].options.length;j++){
											if(json[0].questions[i].optionsGroup[0].options[j].optionId == jsonresponse.oid){
												json[0].questions[i].optionsGroup[0].options[j].max = jsonresponse.max;
												json[0].questions[i].optionsGroup[0].options[j].min = jsonresponse.min;
												jsonquotas = JSON.stringify(json);
											}
										}
							   		}
						   }
							
						   
					   }
					   
					  
				   }
			   },
			   error: function (xhr, ajaxOptions, thrownError) {
				   console.log(xhr.status);
				   console.log(thrownError);
				   console.log(xhr.responseText);
				   console.log(xhr);
			   }
			});
		//}
	});
}

function deleteQuote(){
	$('.survey-sections').on("click", "#removeQuota", function(e){
		var item = $(this).parents(".survey-info");
		quotaid = item.attr('quota');
		currentQuestion = item.find(".widthTitleSurveyCollapsed");
		sid = currentQuestion.attr('sid');
		qid = currentQuestion.attr('qid');
		$("#elementToRemoveText").html('"Quota for Question: ' + item.find('.selquestionforfees option:selected').text() + '"');
		$("#removeElemId").val(sid + '/' +qid +"/111");
		$("#removeElemService").val('QuotaService');
		$("#removeElement").modal("show");
	});
	
}


function alertNotQuota(){
    bootbox.dialog({
		message: textQuotaAlert,
		title: textQuotaTitleAlert,
		buttons: {
			success: {
			label: textQuotaAlertBtn,
			className: "btn-success",
				callback: function() {
				   
				
				}
			}
		}
    });
}

