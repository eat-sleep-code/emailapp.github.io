$(document).ready(function () { 
	// Set initial state of form...
	$('#InvalidThreadIDAlert').hide();
	$('#ThreadRetrievalForm').show();
	
	// Toggle already unsubscribed message based on user's email address...
	$('#ThreadID').blur(function() {
		//console.log('Datasource: ' + messageDatasourceRead);
		$('#dataPlaceholder').sheetrock({
  			url: messageDatasourceRead,
  			sql: "select B where B = '" + $("#ThreadID").val() + "'",
			formatting: false,
  			dataHandler: isThreadIDValid
		});
	
		function isThreadIDValid(data)
		{
			//$('#dataPlaceholder').html('<pre>' + JSON.stringify(data) + '</pre>');
			if (data.table.rows[0] === undefined) {
				$('#InvalidThreadIDAlert').show();
			}
			else {
				$('#InvalidThreadIDAlert').hide();
			}
		}
	});
	
	// Toggle visibility of "CAPTCHA" row...
	if ($.cookie('ClearedCaptcha') !== undefined)
	{
		$('#CaptchaRow').hide();	
	}
	var securityCode = GenerateCaptcha('CaptchaCanvas');
	
	// Setup form field validation...
	var validator = $('#ThreadRetrievalForm').validate({
		errorElement: 'div',
		rules: {
			ThreadID: {required: true}
		},
		messages: {
			ThreadID: {required: 'Please enter your message access code.'},
		},
		errorPlacement: function (error, element) {
			$(error).insertBefore($(element));
		},
		highlight: function(element, errorClass) {				
			$(element).parent('div').addClass('has-error');
		},			
		unhighlight: function(element, errorClass, validClass) {
			$(element).parent('div').removeClass('has-error');
		},
		onfocusout: false,
		invalidHandler: function(event, validator){
			setTimeout(function(){
				$('input:text').blur();
				$('textarea').blur();
				// Pseudo of input:email is not recognized by jQuery yet, so have to target the email fields individually.
				$('#EmailAddress').blur();
			}, 10);
		}
	});
});

/* Assign an OnClick function to items in the "Retrieve" button */
$('#ThreadRetrievalButton').click(function(e) {
	$(document).ready(function () {
		var form = $('#ThreadRetrievalForm');
		form.validate();
		if (form.valid() === true) {
			var threadID = $.trim($('#ThreadID').val());
			
			$('#Thread').sheetrock({
	  			url: messageDatasourceRead,
	  			sql: "select A,B,C,D,E,F,G where B = '" + $("#ThreadID").val() + "'",
				formatting: false,
	  			dataHandler: getThread
			});
		
			function getThread(data)
			{
				$('#dataPlaceholder').html('<pre>' + JSON.stringify(data) + '</pre>');
			}
		}	
		$(window).scrollTop(0);
		
	});
});