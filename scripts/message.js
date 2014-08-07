/* Assign an OnClick function to items in the "Send" button */
$('#MessageSendButton').click(function(e) {
	$(document).ready(function () {
		var form = $('#MessageForm');
		form.validate();
		if (form.valid() === true) {
			if ($.trim($('#Message').val()).length >= 1) {
			/* Send mail only if there is a message (basically prevent empty submissions if validation goes haywire)... */
				var postID = $.trim($('#PostIDHidden').val());
				var sender = $.trim($('#FromEmailAddress').val());;
				var recipient = $.trim($('#ToEmailAddress').val());
				var subject = $.trim($('#Subject').val());
				var message = $.trim($('#Message').val()).replace(/\n/g, '<br />') + '<br />';
				var messageHeader = 'This message was sent to you anonymously.   If you would like to send a reply, <a href="'+serviceRootUrl+'/reply/'+postID+'" target="_blank" title="Click here to reply to this message">click here</a>.';
				var messageFooter = 'If you would like to block all ' + serviceName + ' users from sending you a message, <a href="'+serviceRootUrl+'/unsubscribe/'+postID+'" target="_blank" title="Click here to block users from sending you future messages.">click here</a>.';
			
				// Check To Make Sure Recipient Hasn't Blocked Service
				var recipientCleared = true;
				
				if (recipientCleared == true) {
					// Save To Database
					$.ajax({
						url: messageDatasourceWrite,
						data: { 
							"entry_1063432399": postID, 
							"entry_274482486": sender, 
							"entry_692194785": recipient, 
							"entry_848437565": subject, 
							"entry_1901043579": message
						},
						type: "POST",
						dataType: "xml",
						statusCode: {
							0: function () {
								// Send Mail 
						    		sendMail(serviceEmail, serviceName, recipient, subject, messageHeader + '<hr />' + message + '<hr />' + messageFooter);
							},
							200: function () {
								// Send Mail 
						    		sendMail(serviceEmail, serviceName, recipient, subject, messageHeader + '<hr />' + message + '<hr />' + messageFooter);
							}
						}
					});
	
					$('#MessageSentAlert').show();
					$('#MessageForm').hide();
					$.cookie('ClearedCaptcha', 'true', { expires: 7, path: '/' });
				}
			}	
			$(window).scrollTop(0);
		}
	});
});  