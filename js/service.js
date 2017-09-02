var apiInvoice = API_INVOICE;
	var apiUser = API_USER;
	var start = 0 , end = 10;
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
	var column = table.column( "5" );
	column.visible( !column.visible() );
	//for rowid visibility end
$(document).ready(function() {
		if(localStorage.getItem('userId') == null)
				window.location = 'index.html';
			else{
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
			alert("please select a Service !");	
		else{
				$.post
				( 
						 	apiUser,
						  {
									"action": "deleteproduct",
									"productid": table.row('.selected').data()[5]							
						  },
						  function(data) {
						  
						  var jData = JSON.parse(data);
						  if(jData['status']['message'] != '1')
							 alert("Couldn't Delete Product");
							else{
							  table.row('.selected').remove().draw( false );
							  alert("Service Deleted Successfully")
							}
						  }
				);
		}

    } );

    $('#btnEdit').click(function(){
		if(table.row(".selected")["0"]["length"] == "0")
			alert("please select a Service !");
		table.row('.selected').data()[5]
		$("#txtEditName").val(table.row('.selected').data()[0]);
		$("#txtEditSacCode").val(table.row('.selected').data()[1]);
		$("#txtEditIgst").val(table.row('.selected').data()[2]);
		$("#txtEditCgst").val(table.row('.selected').data()[3]);
		$("#txtEditSgst").val(table.row('.selected').data()[4]);
		$("#txtEditAlias").val(table.row('.selected').data()[6]);
		$('#editProductModal').modal('show');
	})
	
	$('#btnSubmitChanges').click(function(){	
			$.ajax({
			url: apiUser,
			async: false,   // this is the important line that makes the request sincronous
			data: {"action": "editproduct",
					"productid": table.row('.selected').data()[5],
					"code":$("#txtEditSacCode").val(),
					"name":$("#txtEditName").val(),
					"cgst":$("#txtEditCgst").val(),
					"sgst":$("#txtEditSgst").val(),
					"igst":$("#txtEditIgst").val(),
					"userid":localStorage.getItem("userId"),
					"alias":$("#txtEditAlias").val(),
					"rate":"0",
					"unit":""
					},
			type: 'post',
			success: function(output) {						
				var jData = JSON.parse(output);
				if(jData['status']['message'] != '1')
					alert("Unable to edit product. Please try again !");
				else{				
					alert("Changes submitted successfully");
					window.location.reload();
				}
			}
		});
	})

	$("#btnServiceAdd").click(function()
	{	
		console.log('in post');
		$.post
			( 
					  apiUser,
					  {
								"userid": localStorage.getItem('userId'),
								"name": document.getElementById('txtName').value,
								"action": "addproduct",
								"code": document.getElementById('txtSacCode').value,
								"cgst": document.getElementById('txtCgst').value,
								"sgst": document.getElementById('txtSgst').value,
								"igst": document.getElementById('txtIgst').value,
								"alias": document.getElementById('txtAlias').value,
								"flag": "0"
					  },
					  function(data) {
					  var jData = JSON.parse(data);
					  
					  if(jData['status']['message'] == "0")
						 alert(jData['status']['error']);
						else{
						var table = $('#myTable').DataTable();
							alert("Service Added Successfully");	
							window.location.reload();
						}
					  }
			);
					
   });
   
    $('#btnLogout').click( function () {
        localStorage.removeItem('userId');
		localStorage.removeItem('userName');
		window.location = 'index.html';
    } );
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

	function tableGenerate(start,end){
		$.post
					( 
							  apiUser,
							  {
										"action": "fetchproductspag",
										"userid": localStorage.getItem('userId'),
										"start": start,
										"end":end,
										"flag": 0
							  },
							  function(data) {
							  var jData = JSON.parse(data);	
							  if(jData['status']['message'] != '1')
								 alert("Couldn't load Services! Try Reloading the page !");
								else{
									console.log(jData);
									for(i=0;i<jData["record"].length;i++)
									{
										table.row.add( [
											jData["record"][i]["name"],
											jData["record"][i]["code"],
											jData["record"][i]["igst"],
											jData["record"][i]["cgst"],
											jData["record"][i]["sgst"],
											jData["record"][i]["productid"],
											jData["record"][i]["alias"]
										] ).draw();					  
									}
								}
							  }
					);
	}