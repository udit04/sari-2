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
	var column = table.column( "6" );
	column.visible( !column.visible() );
	//for rowid visibility end
$(document).ready(function() {
	$('[data-toggle="tooltip"]').tooltip();
	$('.tooltip').css("position","relative");
	var table = $('#myTable').DataTable();
		if(localStorage.getItem('userId') == null)
				window.location = 'index.html';
			else{
				$("#btnUser").text(localStorage.getItem('userName'));
				tableGenerate(start,end)
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
			alert("please select a product !");
			else{
			$.post
				( 
						  apiUser,
						  {
									"action": "deleteproduct",
									"productid": table.row('.selected').data()[6]							
						  },
						  function(data) {
						  
						  var jData = JSON.parse(data);
						  if(jData['status']['message'] != '1')
							 alert("Couldn't Delete Product");
							else{
							  table.row('.selected').remove().draw( false );
							  alert("Product Deleted Successfully")
							}
						  }
				);
			}
		
    } );
	
	$('#btnEdit').click(function(){
		if(table.row(".selected")["0"]["length"] == "0")
			alert("please select a product !");
		table.row('.selected').data()[6]
		$("#txtEditName").val(table.row('.selected').data()[0]);
		$("#txtEditHSNCode").val(table.row('.selected').data()[1]);
		$("#editSelectUnit").val(table.row('.selected').data()[2]);
		$("#txtEditIgst").val(table.row('.selected').data()[3]);
		$("#txtEditCgst").val(table.row('.selected').data()[4]);
		$("#txtEditSgst").val(table.row('.selected').data()[5]);
		$("#txtEditRate").val(table.row('.selected').data()[7]);
		$("#txtEditAlias").val(table.row('.selected').data()[8]);
		$('#editProductModal').modal('show');
	})
	
	$('#btnSubmitChanges').click(function(){
		var flag = false;
		var unit = $("#editSelectUnit").val();
		if($("#txtEditName").val() == "" || $("#txtEditCgst").val() == "" || $("#txtEditSgst").val() == "" || $("#txtEditIgst").val() == ""){
			alert("Please enter required fields !")
			return;	
		}
		if($("#editSelectUnit").val() == "custom"){
			if($("#txtEditCustom").val() == ""){
				alert("Please enter custom unit !")
				return;
			}
			else{
				flag = true;
				unit = $("#txtEditCustom").val()
			}
		}
		$.ajax({
			url: apiUser,
			async: false,   // this is the important line that makes the request sincronous
			data: {"action": "editproduct",
					"productid": table.row('.selected').data()[6],
					"code":$("#txtEditHSNCode").val(),
					"name":$("#txtEditName").val(),
					"cgst":$("#txtEditCgst").val(),
					"sgst":$("#txtEditSgst").val(),
					"igst":$("#txtEditIgst").val(),
					"userid":localStorage.getItem("userId"),
					"rate": $("#txtEditRate").val(),
					"alias": $("#txtEditAlias").val(),
					"unit":unit
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

	$("#btnProductAdd").click(function(){
		var unit = $("#selectUnit").val();
		if($("#selectUnit").val() == "custom"){
			if($("#txtCustom").val() == ""){
				alert("Please enter custom unit !")
				return;
			}			
			else
				unit = $("#txtCustom").val();
		}
		if($("#txtName").val() == "" || $("#txtCgst").val() == "" || $("#txtSgst").val() == "" || $("#txtIgst").val() == "")
			alert("Please enter required fields !")
		else{
			$.post
				( 
				  apiUser,
				  {
							"userid": localStorage.getItem('userId'),
							"name": document.getElementById('txtName').value,
							"action": "addproduct",
							"code": document.getElementById('txtHSNCode').value,
							"cgst": document.getElementById('txtCgst').value,
							"sgst": document.getElementById('txtSgst').value,
							"igst": document.getElementById('txtIgst').value,
							"unit": unit,
							"rate": document.getElementById('txtRate').value,
							"alias": document.getElementById('txtAlias').value,
							"flag": "1"
				  },
				  function(data) {
				  var jData = JSON.parse(data);
				  if(jData['status']['message'] == "0")
					 alert(jData['status']['error']);
					else{
						var table = $('#myTable').DataTable();
						alert("Product Added Successfully");	
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
    });
	
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

	function Custom(){
	if($("#selectUnit").val() == "custom")
		$("#lblCustomUnit").removeClass("hidden");
	else
		$("#lblCustomUnit").addClass("hidden");
	}

	function EditCustom(){
	if($("#editSelectUnit").val() == "custom")
		$("#txtEditCustomUnit").removeClass("hidden");
	else
		$("#txtEditCustomUnit").addClass("hidden");
	}

	function tableGenerate(start,end){
		$.post
					( 
							  apiUser,
							  {
										"action": "fetchproductspag",
										"userid": localStorage.getItem('userId'),
										"flag": "1",
										"start": start,
										"end":end
							  },
							  function(data) {
							  var jData = JSON.parse(data);
							  if(jData['status']['message'] != '1')
								 alert("Couldn't load products! Try Reloading the page !");
								else{
									for(i=0;i<jData["record"].length;i++)
									{
										table.row.add( [
											jData["record"][i]["name"],
											jData["record"][i]["code"],
											jData["record"][i]["unit"],
											jData["record"][i]["igst"],
											jData["record"][i]["cgst"],
											jData["record"][i]["sgst"],
											jData["record"][i]["productid"],
											jData["record"][i]["rate"],
											jData["record"][i]["alias"]
										] ).draw();					  
									}
								}							
							  }
					);
	}