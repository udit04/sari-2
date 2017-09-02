var apiInvoice = API_INVOICE;
var apiUser = API_USER;
var apiProfile = API_PROFILE;

$(document).ready(function() {
	if(localStorage.getItem('userId') == null)
		window.location = 'index.html';
	else	
		$("#btnUser").text(localStorage.getItem('userName'));

    $('#btnLogout').click(function () {
        localStorage.removeItem('userId');
		localStorage.removeItem('userName');
		window.location = 'index.html';
    });

    $("#btnCriteria").click(function(){
		$.ajax({
			url: apiInvoice,
			async: false,   // this is the important line that makes the request sincronous
			data: {"action": "searchwrtnum",
					"userid": localStorage.getItem('userId'),
					"invnum":$("#headerSearchInvoiceNum").val()
					},
			type: 'post',
			success: function(output) {						
				var jData = JSON.parse(output);
				if(jData['status']['message'] != '1')
					alert("Unable To Search. Please try again !")
				else if(jData['record'].length ==0){
					alert("Invalid Invoice Number.");
					window.location.reload();
				}
				else{				
					if(jData["record"][0]["invoicetype"] == "product")
						window.location= "bill.html?invoiceNum="+$("#headerSearchInvoiceNum").val();
					else
						window.location= "servicebill.html?invoiceNum="+$("#headerSearchInvoiceNum").val();
				}
			}
		});
	})
	
	$("#btnBillShow").click(function(){
		$("#invoiceByCriteria").removeClass("hidden")
	})

	$("#myInvoices").click(function(){
		$('#invoiceModal').modal('show');
		myInvoices("1");	
	})	
	$("#myCancelledInvoices").click(function(){
		$('#cancelledInvoiceModal').modal('show');
		myInvoices("2");	
	})

	UserDetails();
});

function UserDetails(){
	$.ajax({
		url: apiProfile,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "getuserdetails",
				"userid": localStorage.getItem('userId')
				},
		type: 'post',
		success: function(output) {						
			var jData = JSON.parse(output);
			if(jData['status']['message'] != '1')
				alert("Some Error Occured. Please try again !")
			else if(!jData['record'])
				alert("No User Details")
			else{
				$("#mainLine").text(jData['record'][0].header)
				$("#mainName").text(localStorage.getItem('userName'))
				$("#totalProd").text(jData['record'][0].totalprod)
				$("#totalBuyer").text(jData['record'][0].totalbuyer)
				$("#mainEmail").text(jData['record'][0].email)
				$("#mainState").text(jData['record'][0].state)
				$("#mainStateCode").text(jData['record'][0].statecode)
				$("#invoiceCount").text(jData['record'][0].invoicecount)
				$("#cancelledCount").text(jData['record'][0].cancelledcount)
				$("#totalSale").text(jData['record'][0].totalsale)
				$("#totalRevenue").text(jData['record'][0].totalrevenue)
				if(jData['record'][0].picturesrc)
					$("#profilePic").attr("src",jData['record'][0].picturesrc);
			}
		}
	});
}

function myInvoices(flag){
	$.ajax({
		type: 'post',
		url: apiProfile,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "getinvoices",
				"userid": localStorage.getItem('userId')
				},
		success: function(output) {	
		console.log(output)					
			var jData = JSON.parse(output);
			if(jData['status']['message'] != '1')
				alert("Some Error Occured. Please try again !")
			else if(!jData['record'])
				alert("No Invoice Details")
			else{
				
				jData["record"].forEach(function(invoice,index){
					if(index == jData["record"].length-1)
						$(".loader-wrapper").hide();
					if(flag=="1"){
						if(invoice.status==1)
							$("#tblMyInvoice").append("<tr><td>"+invoice.sno+"</td><td>"+invoice.buyer+"</td><td>"+invoice.date+"</td><td>"+invoice.total+"</td><td>Yes</td></tr>")
					}
					if(flag=="2"){
						if(invoice.status==2)
							$("#tblMyCancelledInvoice").append("<tr><td>"+invoice.sno+"</td><td>"+invoice.buyer+"</td><td>"+invoice.date+"</td><td>"+invoice.total+"</td><td>No</td></tr>")
					}
				})			
			}
		}
	});
}
