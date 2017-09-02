var apiInvoice = API_INVOICE;
	var apiUser = API_USER;
	 var table = $('#myTable').DataTable({
        "pagingType": "simple_numbers",
	     drawCallback: function(){
	     	$('#myTable_next').removeClass("disabled")
	      $('.paginate_button.next', this.api().table().container())          
	         .on('click', function(){
	         	start = end + 1;
				end = end + 11;
				tableGenerate(start,end);
	         });       
	   },
	   "bSort" : false,
	   "searching": false
    });
	 //for rowid visibility
			var column = table.column( "6" );
			column.visible( !column.visible() );
			//for rowid visibility end

	 var start = 0 , end = 10;
$(document).ready(function() {
		if(localStorage.getItem('userId') == null)
			window.location = 'index.html';
		else
		{	
			$("#btnUser").text(localStorage.getItem('userName'));
			tableGenerate(start,end);
		}
		
		
		$('#myTable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }		
    } );
	
    $('#btnDelete').click( function () {
		if(table.row(".selected")["0"]["length"] == "0")
				alert("please select a Buyer !");	
		else{
			$.post
			( 
			  apiUser,
			  {
						"action": "deletebuyer",
						"buyerid": table.row('.selected').data()[6]							
			  },
			  function(data) {
			  var jData = JSON.parse(data);
			  if(jData['status']['message'] != '1')
				 alert("Couldn't Delete Buyer");
				else{
				  table.row('.selected').remove().draw( false );
				  alert("Buyer Deleted Successfully")
				}
			  }
			);
		}
    } );
	
	$('#btnEdit').click(function(){
		if(table.row(".selected")["0"]["length"] == "0")
			alert("please select a Buyer !");
		table.row('.selected').data()[6]
		$("#txtEditName").val(table.row('.selected').data()[0]);
		$("#txtEditAddress").val(table.row('.selected').data()[1]);
		$("#txtEditGstin").val(table.row('.selected').data()[2]);
		$("#editState").val($('#editState option').filter(function () { return $(this).html() == table.row('.selected').data()[3]; }).val());
		$("#txtEditEmail").val(table.row('.selected').data()[4]);
		$("#txtEditPhone").val(table.row('.selected').data()[5]);
		$("#txtEditAlias").val(table.row('.selected').data()[7]);
		$('#editModal').modal('show');
	})
	
	$('#btnSubmitChanges').click(function(){
		if($("#txtEditGstin").val() && document.getElementById('txtEditGstin').value.length < 15)
			alert("GSTIN should be of 15 digits")
		else if($("#txtEditGstin").val() && ValidateGstin(document.getElementById('txtEditGstin').value) == false){
			alert("Gstin invalid as per the format !");
		}
		else if($("#txtEditPhone").val() && document.getElementById('txtEditPhone').value.length <10)
			alert("Phone Number should be of 10 digits")
		else{	
				$.ajax({
				url: apiUser,
				async: false,   // this is the important line that makes the request sincronous
				data: {"action": "editbuyer",
						"buyerid": table.row('.selected').data()[6],
						"gstin":$("#txtEditGstin").val(),
						"name":$("#txtEditName").val(),
						"address":$("#txtEditAddress").val(),
						"email":$("#txtEditEmail").val(),
						"state":$("#editState :selected").text(),
						"phone":$("#txtEditPhone").val(),
						"userid":localStorage.getItem("userId"),
						"statecode":$("#editState").val(),
						"alias":$("#txtEditAlias").val()
						},
				type: 'post',
				success: function(output) {						
					var jData = JSON.parse(output);
					if(jData['status']['message'] != '1')
						alert("Unable to edit buyer. Please try again !");
					else{				
						alert("Changes submitted successfully");
						window.location.reload();
					}
				}
			});
		}
	})

	$("#btnBuyerAdd").click(function(){	
		if($("#txtGstin").val() && document.getElementById('txtGstin').value.length < 15)
			alert("GSTIN should be of 15 digits")
		else if($("#txtGstin").val() && ValidateGstin(document.getElementById('txtGstin').value) == false){
			alert("Gstin invalid as per the format !");
		}
		else if($("#txtPhone").val() && document.getElementById('txtPhone').value.length <10)
			alert("Phone Number should be of 10 digits")
		else{
			console.log('in post');
			$.post( 
			  apiUser,
			  {
						"userid": localStorage.getItem('userId'),
						"name": document.getElementById('txtName').value,
						"action": "addbuyer",
						"address": document.getElementById('txtAddress').value,
						"gstin": document.getElementById('txtGstin').value,
						"email": document.getElementById('txtEmail').value,
						"phone": document.getElementById('txtPhone').value,
						"state": $("#state :selected").text(),
						"statecode": $("#state").val(),
						"alias": $("#txtAlias").val()
			  },
			  function(data) {
			  var jData = JSON.parse(data);
			  console.log(jData);
			  if(jData['status']['message'] == "0")
				 alert(jData['status']['error']);
				else{
					alert("Buyer Added Successfully");
					window.location.reload();
				}
			  }
			);
		}		
   });
   
    $('#btnLogout').click( function () {
        localStorage.removeItem('userId');
		localStorage.removeItem('userName');
		window.location = 'index.html';
    } );

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
});

	function isAlphaNumeric(str) {
	 var code, i, len;
	  for (i = 0, len = str.length; i < len; i++) {
	    code = str.charCodeAt(i);
	    if (!(code > 47 && code < 58) && // numeric (0-9)
	        !(code > 64 && code < 91) && // upper alpha (A-Z)
	        !(code > 96 && code < 123)) { // lower alpha (a-z)
	      return false;
	    }
	  }
	  return true;
	};

	function isAlphabet(str) {
	  var code, i, len;
	  for (i = 0, len = str.length; i < len; i++) {
	    code = str.charCodeAt(i);
	    if (!(code > 64 && code < 91) && // upper alpha (A-Z)
	        !(code > 96 && code < 123)) { // lower alpha (a-z)
	      return false;
	    }
	  }
	  return true;
	};

	function ValidateGstin(value){
		var flag=0;
		if(value.length != 15)
			return false;
		if(isNaN(value.substr(0,2)))
			return false;
		if (!isAlphabet(value.substr(2, 5)))
		{
			return false;	
		}	
		if (isNaN(value.substr(7, 4))) 
		{
			return false;	
		}		
		if(!isAlphabet(value.substr(11, 1)))
		{
			return false;	
		}	
		if(!isAlphaNumeric(value.substr(12,4)))
		{
			return false;	
		}	
		return true;
	}

	function tableGenerate(start,end){
		console.log("hello")
		$.post
			( 
					  apiUser,
					  {
								"action": "fetchbuyerspag",
								"userid": localStorage.getItem('userId'),
								"start": start,
								"end": end							
					  },
					  function(data) {
					  var jData = JSON.parse(data);
					  console.log(jData);
						if(jData['status']['message'] != '1')
							 alert("Couldn't load Buyers! Try Reloading the page !");
							else{
									for(i=0;i<jData["record"].length;i++)
									{
										table.row.add( [
											jData["record"][i]["name"],
											jData["record"][i]["address"],
											jData["record"][i]["gstin"],
											jData["record"][i]["state"],
											jData["record"][i]["email"],
											jData["record"][i]["phone"],
											jData["record"][i]["buyerid"],
											jData["record"][i]["alias"]
										] ).draw(false);					  
									}
						}
					  }
			);
	}