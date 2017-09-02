	var buyerDetails = [];
	var productDetails = [];
	var availableBuyers = [];
	var availableProducts = [];
	var billDetails = [];
	var counter = 1;
	var tax ;
	var buyerid="",consigneeid="",table,tableservice;
	var totalQty = 0,totalAmount = "0.0",amtBeforeTax="0.0",amountAfterTax="0.0",taxableValue="0.0",totalCgst="0.0",totalSgst="0.0",totalIgst="0.0",
		cgstRate0="0.0",cgstRate5="0.0",cgstRate12="0.0",cgstRate18="0.0",cgstRate28="0.0",
		sgstRate0="0.0",sgstRate5="0.0",sgstRate12="0.0",sgstRate18="0.0",sgstRate28="0.0",
		igstRate0="0.0",igstRate5="0.0",igstRate12="0.0",igstRate18="0.0",igstRate28="0.0",
		totalSale0="0.0",totalSale5="0.0",totalSale12="0.0",totalSale18="0.0",totalSale28="0.0",freightValue="0.0",strReverseCharge;

	var apiInvoice = API_INVOICE;
	var apiUser = API_USER;
	$(document.body).addClass("hidden");
$(document).ready(function() {
	if(window.location.href.includes("?")){
		var str = window.location.href.split("?");
		str = str[1].split("=");
		searchWithBillNumber(str[1]);
		$("#headerSearchInvoiceNum").val(str[1]);
	}
	else{
		headerFooterFetch();	
	}
	$(document.body).removeClass("hidden");
	$(".panel1 :input").prop('readonly', true);
	
	if(localStorage.getItem('userId') == null)
				window.location = 'index.html';
	else
		$("#btnUser").text(localStorage.getItem('userName'));
	if(localStorage.getItem('state') == "undefined")
		$("#sellerState").text("-");
	else
		$("#sellerState").text(localStorage.getItem('state'));

	$("#sellerStateCode").text(localStorage.getItem('sellerStateCode'));

	table = $('#myProdTable').DataTable({
		"bSort" : false
	});
	for(var i=5;i<=15;i++){
					var column = table.column(i);
					column.visible(!column.visible());
				}
	tableservice = $('#myServiceTable').DataTable({
		"bSort" : false
	});
	for(var i=5;i<=12;i++){
					var column = tableservice.column(i);
					column.visible(!column.visible());
				} 

	$('#myProdTable_filter').addClass("hidden");
	$('#myServiceTable_filter').addClass("hidden");

			   
    $( "#txtBuyerName" ).autocomplete({
      source: function (request, response){
      	fetchBuyers(request,response)
      }
    });
	
	$( "#txtConsigneeName" ).autocomplete({
       source: function (request, response){
      	fetchBuyers(request,response)
       }
    });
	
	$( "#txtProductName" ).autocomplete({
      //source: availableProducts,
      source: function (request, response) {
      	if(window.location.href.includes("servicebill"))
      		fetchProducts(0,request,response)
      	else
      		fetchProducts(1,request,response)
      }
   });

    $( "#headerSearch" ).autocomplete({
      source: availableProducts
    });
	
	 $('#btnLogout').click( function () 
	 {
		localStorage.removeItem('userId');
		localStorage.removeItem('userName');
		window.location = 'index.html';
    });
	
	 $('#btnBuyerAdd').click( function () 
	 {	
		var strName = $("#txtBuyerName").val().split(":");
		buyerDetails.forEach(function(element) {
			if(element["gstin"] == strName[1])
			{
				$("#txtBName").val(strName[0]);
				$("#txtGstin").val(strName[1]);
				$("#txtAddress").val(element["address"].toUpperCase());
				$("#txtState").val(element["state"]);
				$("#txtStateCode").val(element["statecode"]);
				buyerid = element["buyerid"];			
			}
		});		
		$('#rname').text($("#txtBName").val());
		$('#raddress').text($("#txtAddress").val());
		$('#rgstin').text($("#txtGstin").val());
		$('#rstate').text($("#txtState").val());
		$('#rstatecode').text($("#txtStateCode").val());
		$("#txtPOS").val($("#txtState").val());
    });
	
	$('#btnConsigneeAdd').click( function () 
	 {	
		var strName = $("#txtConsigneeName").val().split(":");
		buyerDetails.forEach(function(element) {
			if(element["gstin"] == strName[1])
			{
				$("#txtConName").val(strName[0]);
				$("#txtConGstin").val(strName[1]);
				$("#txtConAddress").val(element["address"].toUpperCase());
				$("#txtConState").val(element["state"].toUpperCase());
				$("#txtConStateCode").val(element["statecode"]);
				consigneeid = element["buyerid"];
			}
		});		
		$('#cnsname').text($("#txtConName").val());
		$('#cnsaddress').text($("#txtConAddress").val());
		$('#cnsgstin').text($("#txtConGstin").val());
		$('#cnsstate').text($("#txtConState").val());
		$('#cnsstatecode').text($("#txtConStateCode").val());
    });
		
	$('#btnProductFind').click( function (event) 
	 {
		var strPName = $("#txtProductName").val();
		productDetails.forEach(function(element) {
			if(element["name"].toUpperCase() == strPName)
			{
				$("#txtRate").val(element["rate"]);
				if(localStorage.getItem("sellerStateCode") == $("#txtStateCode").val())
				{
					$("#txtCgst").val(element["cgst"]);
					$("#txtSgst").val(element["sgst"]);
					$(".igst").hide();
					$(".igstAmount").hide();
				}
				else
					{
					$(".cgst").hide();
					$(".sgst").hide();
					$(".cgstAmount").hide();
					$(".sgstAmount").hide();
					$("#txtIgst").val(element["igst"]);				
					}
				$("#id-1 #txtPName").val(strPName);
				$("#txtHSNCode").val(element["code"]);
				$("#txtUnit").val(element["unit"]);	
				$("#txtProductId").val(element["productid"]);				
			}
		});
    });
	
/*	$('#btnProductPriceShow').click( function (event){
		productPriceShow();
	});*/

	$("#txtRate").focusout(function(){
		productPriceShow();
	})

	$("#txtAmount").focusout(function(){
		servicePriceShow();
	})

	$('#btnServicePriceShow').click( function (event){
		servicePriceShow();
	});

	
	$('#btnBillAdd').click( function (e){
		if($("#txtBName").val() == "")
			alert("Buyer Cannot Be Empty !");
		else if($("#txtPName").val()=="")
			alert("Product Cannot Be Empty !");
		else
		{
			productPriceShow();
			e.preventDefault();
			billDetails.push({
				"sno": ''+counter+'',
				"code": $("#txtHSNCode").val(),
				"qty": $("#txtQty").val(),
				"rate": $("#txtRate").val(),
				"amount": $("#txtAmount").val(),
				"discrate": $("#txtDiscount").val(),
				"discamt": ''+tax+'',
				"taxablevalue": $("#txtTax").val(),			
				"cgstrate": $("#txtCgst").val(),
				"cgstamt": $("#txtCgstAmount").val(),
				"sgstrate": $("#txtSgst").val(),
				"sgstamt": $("#txtSgstAmount").val(),
				"igstrate": $("#txtIgst").val(),
				"igstamt": $("#txtIgstAmount").val(),
				"total": $("#txtFinalAmount").val(),
				"productname":$("#txtPName").val(),
				"unit": $("#txtUnit").val(),
				"productid": $("#txtProductId").val()

			});
			table.row.add( [
					$("#txtPName").val(),
					$("#txtHSNCode").val(),
					$("#txtUnit").val(),
					$("#txtQty").val(),
					$("#txtFinalAmount").val(),
					$("#txtRate").val(),
					$("#txtDiscount").val(),
					$("#txtCgst").val(),
					$("#txtSgst").val(),
					$("#txtIgst").val(),
					$("#txtAmount").val(),
					$("#txtTax").val(),
					$("#txtCgstAmount").val(),
					$("#txtSgstAmount").val(),
					$("#txtIgstAmount").val(),
					$("#txtProductId").val()
				] ).draw();
			if($("#reverseCharge").text() == "YES" || $("#reverseCharge").text() == "Yes"){
				$(".invoiceTable").find('tbody tr:last').before("<tr style='height:25px'><td>"+counter+"</td><td style='word-break:break-word;'>"+$('#txtPName').val()+"</td><td>"+$('#txtHSNCode').val()+"</td><td>"+$('#txtUnit').val()+"</td><td>"+$('#txtQty').val()+"</td><td>"+$('#txtRate').val()+"</td><td>"+$('#txtAmount').val()+"</td><td>"+$('#txtDiscount').val()+"</td><td>"+$('#txtTax').val()+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td style='background-color:#dce6f1;color:black'>"+$('#txtFinalAmount').val()+"</td></tr>");	
			}
			else{
				if($("#txtIgst").val() == "0" && $("#txtIgstAmount").val() == "0"){
					$("#txtIgst").val("-");
					$("#txtIgstAmount").val("-");
				}
				if($("#txtCgst").val() == "0" && $("#txtCgstAmount").val() == "0"){
					$("#txtCgst").val("-");
					$("#txtCgstAmount").val("-");
				}
				if($("#txtSgst").val() == "0" && $("#txtSgstAmount").val() == "0"){
					$("#txtSgst").val("-");
					$("#txtSgstAmount").val("-");
				}
				$(".invoiceTable").find('tbody tr:last').before("<tr style='height:25px'><td>"+counter+"</td><td style='word-break:break-word;'>"+$('#txtPName').val()+"</td><td>"+$('#txtHSNCode').val()+"</td><td>"+$('#txtUnit').val()+"</td><td>"+$('#txtQty').val()+"</td><td>"+$('#txtRate').val()+"</td><td>"+$('#txtAmount').val()+"</td><td>"+$('#txtDiscount').val()+"</td><td style='background-color:#dce6f1;color:black'>"+$('#txtTax').val()+"</td><td >"+$('#txtCgst').val()+"</td><td >"+$('#txtCgstAmount').val()+"</td><td >"+$('#txtSgst').val()+"</td><td >"+$('#txtSgstAmount').val()+"</td><td >"+$('#txtIgst').val()+"</td><td >"+$('#txtIgstAmount').val()+"</td><td style='background-color:#dce6f1;color:black'>"+$('#txtFinalAmount').val()+"</td></tr>");				
			}
			counter++;
			$('.prods').find(':input').not(':submit').val("0");			
		}
	});

	$('#btnBillServiceAdd').click( function (e){		
		if($("#txtBName").val() == "")
			alert("Buyer Cannot Be Empty !");
		else if($("#txtPName").val()=="")
			alert("Product Cannot Be Empty !");
		else
		{
			servicePriceShow();
			e.preventDefault();
			billDetails.push({
				"sno": ''+counter+'',
				"code": $("#txtHSNCode").val(),
				"qty": "",
				"rate": "",
				"amount": $("#txtAmount").val(),
				"discrate": $("#txtDiscount").val(),
				"discamt": ''+tax+'',
				"taxablevalue": $("#txtTax").val(),			
				"cgstrate": $("#txtCgst").val(),
				"cgstamt": $("#txtCgstAmount").val(),
				"sgstrate": $("#txtSgst").val(),
				"sgstamt": $("#txtSgstAmount").val(),
				"igstrate": $("#txtIgst").val(),
				"igstamt": $("#txtIgstAmount").val(),
				"total": $("#txtFinalAmount").val(),
				"productname":$("#txtPName").val(),
				"unit": "",
				"productid":$("#txtProductId").val()
			});
			tableservice.row.add( [
					$("#txtPName").val(),
					$("#txtHSNCode").val(),
					$("#txtAmount").val(),
					$("#txtDiscount").val(),
					$("#txtFinalAmount").val(),
					$("#txtCgst").val(),
					$("#txtSgst").val(),
					$("#txtIgst").val(),
					$("#txtTax").val(),
					$("#txtCgstAmount").val(),
					$("#txtSgstAmount").val(),
					$("#txtIgstAmount").val(),
					$("#txtProductId").val()
				] ).draw();

			if($("#reverseCharge").text() == "YES" || $("#reverseCharge").text() == "Yes"){
				$(".invoiceTable").find('tbody tr:last').before("<tr style='height:25px'><td>"+counter+"</td><td style='word-break:break-word;'>"+$('#txtPName').val()+"</td><td>"+$('#txtHSNCode').val()+"</td><td>"+$('#txtAmount').val()+"</td><td>"+$('#txtDiscount').val()+"</td><td style='background-color:#dce6f1;color:black'>"+$('#txtTax').val()+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td >"+"-"+"</td><td style='background-color:#dce6f1;color:black'>"+$('#txtFinalAmount').val()+"</td></tr>");	
			}
			else{
				if($("#txtIgst").val() == "0" && $("#txtIgstAmount").val() == "0"){
					$("#txtIgst").val("-");
					$("#txtIgstAmount").val("-");
				}
				if($("#txtCgst").val() == "0" && $("#txtCgstAmount").val() == "0"){
					$("#txtCgst").val("-");
					$("#txtCgstAmount").val("-");
				}
				if($("#txtSgst").val() == "0" && $("#txtSgstAmount").val() == "0"){
					$("#txtSgst").val("-");
					$("#txtSgstAmount").val("-");
				}
				$(".invoiceTable").find('tbody tr:last').before("<tr style='height:25px'><td>"+counter+"</td><td style='word-break:break-word;'>"+$('#txtPName').val()+"</td><td>"+$('#txtHSNCode').val()+"</td><td>"+$('#txtAmount').val()+"</td><td>"+$('#txtDiscount').val()+"</td><td style='background-color:#dce6f1;color:black'>"+$('#txtTax').val()+"</td><td >"+$('#txtCgst').val()+"</td><td >"+$('#txtCgstAmount').val()+"</td><td >"+$('#txtSgst').val()+"</td><td >"+$('#txtSgstAmount').val()+"</td><td >"+$('#txtIgst').val()+"</td><td >"+$('#txtIgstAmount').val()+"</td><td style='background-color:#dce6f1;color:black'>"+$('#txtFinalAmount').val()+"</td></tr>");				
			}
			counter++;
			$('.prods').find(':input').not(':submit').val("0");
		}
	});
	$("#reverseCharge").text("No");
	$('.switch-input').on('change', function() {
      var isChecked = $(this).is(':checked');
      var selectedData;
      var $switchLabel = $('.switch-label');
      console.log('isChecked: ' + isChecked); 
      
      if(isChecked) {
        selectedData = $switchLabel.attr('data-on');
      } else {
        selectedData = $switchLabel.attr('data-off');
      }     
	  $("#reverseCharge").text(selectedData);
      console.log('Selected data: ' + selectedData);    
    });
	

	$('#btnProductBillGenerate').on('click',function(){
		ProductBillGenerate("ORIGINAL")
	});
	$('#btnProductBillGenerateDuplicate').on('click',function(){
		ProductBillGenerate("DUPLICATE")
	});
	$('#btnProductBillGenerateTriplicate').on('click',function(){
		ProductBillGenerate("TRIPLICATE")
	});

	function ProductBillGenerate(billType){
		if(billDetails.length == 0)
			alert("Please add a product to generate invoice !")
		else if(!$("#txtDate").val()){
			alert("Please enter invoice date !")
			$("#txtDate").focus();
			$("#txtDate").css("border-color","red")	
		}
		else{
			if(confirm("Confirm BIll Generation ?")){
				if($("#headerSearchInvoiceNum").hasClass("disabled"))
					getProductInvoiceDetails($("#headerSearchInvoiceNum").val(),billType)
				else
					getProductInvoiceDetails(null,billType);
				$(this).addClass("disabled")
			}
		}	
	}

	$('#btnServiceBillGenerate').on('click',function(){
			ServiceBillGenerate("ORIGINAL")
	});
	$('#btnServiceBillGenerateDuplicate').on('click',function(){
		ServiceBillGenerate("DUPLICATE")
	});
	$('#btnServiceBillGenerateTriplicate').on('click',function(){
		ServiceBillGenerate("TRIPLICATE")
	});

	function ServiceBillGenerate(billType){
		if(billDetails.length == 0)
			alert("Please add a service to generate invoice !")
		else if(!$("#txtDate").val()){
			alert("Please enter invoice date !")
			$("#txtDate").focus();
			$("#txtDate").css("border-color","red")	
		}
		else{
			if(confirm("Confirm BIll Generation ?")){
				if($("#headerSearchInvoiceNum").hasClass("disabled"))
					getServiceInvoiceDetails($("#headerSearchInvoiceNum").val(),billType)
				else
					getServiceInvoiceDetails(null,billType);
				$(this).addClass("disabled")
			}
		}	
	}

    $('#myProdTable tbody').on( 'click', 'tr', function () {
    	if ( $(this).hasClass('selected') ) {
        	$(this).removeClass('selected');
    	}
        else{
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#myServiceTable tbody').on( 'click', 'tr', function(){
		if($(this).hasClass('selected')){
	    	$(this).removeClass('selected');
		}
        else{
            tableservice.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#btnEdit').click(function(){
		if(table.row(".selected")["0"]["length"] == "0")
			alert("please select a product !");
		else{
		var index = parseInt(table.row('.selected').index()) + parseInt('1');
		$("#txtPName").val(table.row('.selected').data()[0]);
		$("#txtHSNCode").val(table.row('.selected').data()[1]);
		$("#txtUnit").val(table.row('.selected').data()[2]);
		$("#txtQty").val(table.row('.selected').data()[3]);
		$("#txtFinalAmount").val(table.row('.selected').data()[4]);

		$("#txtRate").val(table.row('.selected').data()[5]);
		$("#txtDiscount").val(table.row('.selected').data()[6]);

		$("#txtCgst").val(table.row('.selected').data()[7]);
		$("#txtSgst").val(table.row('.selected').data()[8]);
		$("#txtIgst").val(table.row('.selected').data()[9]);
		$("#txtAmount").val(table.row('.selected').data()[10]);
		$("#txtTax").val(table.row('.selected').data()[11]);
		$("#txtCgstAmount").val(table.row('.selected').data()[12]);
		$("#txtSgstAmount").val(table.row('.selected').data()[13]);
		$("#txtIgstAmount").val(table.row('.selected').data()[14]);
		$("#txtProductId").val(table.row('.selected').data()[15]);
		table.row('.selected').remove().draw( false );
		$(".invoiceTable tr").find("td:first:contains('"+index+"')").closest('tr').remove();
		counter--;
		 $(".invoiceTable").find('tr').each(function (i, el) {
        	var $tds = $(this).find('td');
            if($tds.eq(0).text() != "Total")
            	$tds.eq(0).text(i);
    		});
		 setTimeout(function(){
		 	removeByAttr(billDetails, 'productid', $('#txtProductId').val());
		 },200)
		
		}
	})

	$('#btnDeleteProduct').click(function(){
		if(table.row(".selected")["0"]["length"] == "0")
			alert("please select a product !");
		else{
		$("#txtPName").val(table.row('.selected').data()[0]);
		table.row('.selected').remove().draw( false );
		$(".invoiceTable").find("td:contains('"+$('#txtPName').val()+"')").closest('tr').remove();
		counter--;
		 $(".invoiceTable").find('tr').each(function (i, el) {
        	var $tds = $(this).find('td');
            if($tds.eq(0).text() != "Total")
            	$tds.eq(0).text(i);
    		});
		billDetails.splice(billDetails.indexOf($('#txtPName').val()),1);
		$("#txtPName").val("");
		}
	})

	$('#btnServiceEdit').click(function(){
		if(tableservice.row(".selected")["0"]["length"] == "0")
			alert("please select a service !");
		else{
		var index = parseInt(tableservice.row('.selected').index()) + parseInt('1');
		$("#txtPName").val(tableservice.row('.selected').data()[0]);
		$("#txtHSNCode").val(tableservice.row('.selected').data()[1]);
		$("#txtAmount").val(tableservice.row('.selected').data()[2]);
		$("#txtDiscount").val(tableservice.row('.selected').data()[3]);
		$("#txtFinalAmount").val(tableservice.row('.selected').data()[4]);

		$("#txtCgst").val(tableservice.row('.selected').data()[5]);
		$("#txtSgst").val(tableservice.row('.selected').data()[6]);
		$("#txtIgst").val(tableservice.row('.selected').data()[7]);
		$("#txtTax").val(tableservice.row('.selected').data()[8]);
		$("#txtCgstAmount").val(tableservice.row('.selected').data()[9]);
		$("#txtSgstAmount").val(tableservice.row('.selected').data()[10]);
		$("#txtIgstAmount").val(tableservice.row('.selected').data()[11]);
		$("#txtProductId").val(tableservice.row('.selected').data()[12]);
		tableservice.row('.selected').remove().draw( false );
		$(".invoiceTable tr").find("td:first:contains('"+index+"')").closest('tr').remove();
		counter--;
		 $(".invoiceTable").find('tr').each(function (i, el) {
        	var $tds = $(this).find('td');
        	if($tds.eq(0).text() != "Total")
            	$tds.eq(0).text(i);
    		});
		 setTimeout(function(){
		 	removeByAttr(billDetails, 'productname', $('#txtPName').val());
		 },200)
		//billDetails.splice(billDetails.indexOf($('#txtHSNCode').val()),1);
		}
	})

	$('#btnDeleteService').click(function(){
		if(tableservice.row(".selected")["0"]["length"] == "0")
			alert("please select a service !");
		else{
		$("#txtPName").val(tableservice.row('.selected').data()[0]);
		tableservice.row('.selected').remove().draw( false );
		$(".invoiceTable").find("td:contains('"+$('#txtPName').val()+"')").closest('tr').remove();
		counter--;
		 $(".invoiceTable").find('tr').each(function (i, el) {
        	var $tds = $(this).find('td');
        	if($tds.eq(0).text() != "Total")
            	$tds.eq(0).text(i);
    		});
		billDetails.splice(billDetails.indexOf($('#txtPName').val()),1);
		$("#txtPName").val("");
		}
	})

	$("#criteria").on("change",function(){
		if($("#criteria").val() == "date"){
			$("#headerSearchStartDate").removeClass("hidden");
			$("#headerSearchEndDate").removeClass("hidden");
			$("#headerSearchInvoiceNum").addClass("hidden");
			$("#lblHeaderSearchStartDate").removeClass("hidden");
			$("#lblHeaderSearchEndDate").removeClass("hidden");
			$("#drpCriteria").css("margin-top","-24px")
			$("#btnUser").css("margin-top","-24px")
			$("#btnLogout").css("margin-top","-24px")
		}
		else{
			$("#headerSearchStartDate").addClass("hidden");
			$("#headerSearchEndDate").addClass("hidden");
			$("#headerSearchInvoiceNum").removeClass("hidden");
			$("#lblHeaderSearchStartDate").addClass("hidden");
			$("#lblHeaderSearchEndDate").addClass("hidden");
			$("#drpCriteria").css("margin-top","0px")
			$("#btnUser").css("margin-top","0px")
			$("#btnLogout").css("margin-top","0px")
		}	
	})
	
	$("#btnCriteria").click(function(){
		if($("#criteria").val() == "num"){
				checkInvoiceType($("#headerSearchInvoiceNum").val());
				searchWithBillNumber($("#headerSearchInvoiceNum").val());
		}
		else{
			$.ajax({
					url: apiInvoice,
					async: false,   // this is the important line that makes the request sincronous
					data: {"action": "searchwrtdate",
							"userid": localStorage.getItem('userId'),
							"start": $("#headerSearchStartDate").val(),
							"end": $("#headerSearchEndDate").val()
							},
					type: 'post',
					success: function(output) {						
						var jData = JSON.parse(output);
						if(jData['status']['message'] != '1')
							alert("Unable to Search. Please try again !")
						else{
							getAllBills(jData["record"]);
						}
					}
				});
		}
	})
	
	$("#btnBillShow").click(function(){
		$("#invoiceByCriteria").removeClass("hidden")
	})

	$("#btnBillPrint").click(function(){
		$("#invoiceByCriteria").removeClass("hidden")
		document.body.innerHTML=document.getElementById('divInvoice').innerHTML;
		$("#mainBody").css("margin-top","-20px");
		window.print();
		window.location.reload();
	})

	$("#btnProductBillEdit").click(function(){
		$("#headerSearchInvoiceNum").addClass("disabled");
		$("#headerSearchInvoiceNum").attr("disabled",true);
		$.ajax({
			url: apiInvoice,
			async: false,   // this is the important line that makes the request sincronous
			data: {"action": "fetchinvoicecontents",
					"userid": localStorage.getItem('userId'),
					"number":$("#headerSearchInvoiceNum").val()
					},
			type: 'post',
			success: function(output) {						
				var jData = JSON.parse(output);
				if(jData['status']['message'] != '1')
					alert("Unable to Edit. Please try again !")
				else{				
					$("#contentDiv").removeClass("hidden");
					$("#criteriaDetails").addClass("hidden");
					$("#invoiceByCriteria").removeClass("hidden");		
					PopulateDetailsOnEdit(jData["record"][jData["record"].length-1]["invoicetype"],jData);
				}
			}
		});
	})

	$("#btnServiceBillEdit").click(function(){
		$("#headerSearchInvoiceNum").addClass("disabled");
		$("#headerSearchInvoiceNum").attr("disabled",true);
		$.ajax({
			url: apiInvoice,
			async: false,   // this is the important line that makes the request sincronous
			data: {"action": "fetchinvoicecontents",
					"userid": localStorage.getItem('userId'),
					"number":$("#headerSearchInvoiceNum").val()
					},
			type: 'post',
			success: function(output) {						
				var jData = JSON.parse(output);
				if(jData['status']['message'] != '1')
					alert("Unable to Edit. Please try again !")
				else{				
					$("#contentDiv").removeClass("hidden");
					$("#criteriaDetails").addClass("hidden");
					$("#invoiceByCriteria").removeClass("hidden");				
					PopulateDetailsOnEdit(jData["record"][jData["record"].length-1]["invoicetype"],jData);
				}
			}
		});
	})

	$("#btnBillCancel").click(function(){
		cancelBill();
	})	
});

var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}

function fetchBuyers(request,response){
	$.ajax({
		url: apiUser,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "suggestbuyer","name":request.term,"userid": localStorage.getItem('userId')},
		type: 'post',
		success: function(output) {						
		var jData = JSON.parse(output);
		if(jData['status']['message'] != '1')
				 alert("Couldn't Fetch Buyers. Try Reloading the page !");
		else{		
			var array=[];				
			buyerDetails = jData["record"];
			jData["record"].forEach(function(element){
				array.push(element.name.toUpperCase()+":"+element.gstin);
			})
			response(array);
		}
	 }
  });
}

function fetchProducts(flag,request,response){
	$.ajax({
		url: apiUser,
		async: false,   // this is the important line that makes the request asyncronous
		data: {"action": "suggestproduct","userid": localStorage.getItem('userId'),"flag":flag,"name":request.term},
		type: 'post',
		success: function(output) {						
		var jData = JSON.parse(output);
		if(jData['status']['message'] != '1')
				 alert("Couldn't Fetch Buyers/Products! Try Reloading the page !");
				else{						
				productDetails = jData["record"];
					var array = [];
					 jData["record"].forEach(function(element){
					 	array.push(element.name.toUpperCase())
					 })
					 response(array);
			}
		}
	});
}

function PopulateDetailsOnEdit(invoicetype,jData){
	billDetails = []; //since it might already contain somethings if search is clicked after add some products initially
	if(invoicetype=="service"){
		for(i=0;i<jData["record"].length-1;i++)
		{
			billDetails.push(jData["record"][i]);
			tableservice.row.add( [
				jData["record"][i]["productname"],
				jData["record"][i]["code"],
				jData["record"][i]["amount"],
				jData["record"][i]["discrate"],
				jData["record"][i]["total"],
				jData["record"][i]["cgstrate"],
				jData["record"][i]["sgstrate"],
				jData["record"][i]["igstrate"],
				jData["record"][i]["discamt"],
				jData["record"][i]["cgstamt"],
				jData["record"][i]["sgstamt"],
				jData["record"][i]["igstamt"],
				jData["record"][i]["productid"]
			] ).draw();				  
		}
		$("#txtTMode").attr("disabled",true);
		$("#txtVehicleNumber").attr("disabled",true);
	}
	else{
		for(i=0;i<jData["record"].length-1;i++)
		{
			billDetails.push(jData["record"][i]);
			table.row.add( [
				jData["record"][i]["productname"],
				jData["record"][i]["code"],
				jData["record"][i]["unit"],
				jData["record"][i]["qty"],
				jData["record"][i]["total"],
				jData["record"][i]["rate"],
				jData["record"][i]["discrate"],
				jData["record"][i]["cgstrate"],
				jData["record"][i]["sgstrate"],
				jData["record"][i]["igstrate"],
				jData["record"][i]["amount"],
				jData["record"][i]["discamt"],
				jData["record"][i]["cgstamt"],
				jData["record"][i]["sgstamt"],
				jData["record"][i]["igstamt"],
				jData["record"][i]["productid"]
			] ).draw();					  
		}
	}
	buyerid = jData["record"][jData["record"].length-1]["buyeridbilled"];
	$("#txtGstin").val(jData["record"][jData["record"].length-1]["gstinbilled"]);
	$("#txtBName").val(jData["record"][jData["record"].length-1]["namebilled"]);
	$("#txtAddress").val(jData["record"][jData["record"].length-1]["addressbilled"]);
	$("#txtState").val(jData["record"][jData["record"].length-1]["statebilled"]);
	$("#txtStateCode").val(jData["record"][jData["record"].length-1]["statecodebilled"]);
	consigneeid = jData["record"][jData["record"].length-1]["buyeridshipped"];
	$("#txtConGstin").val(jData["record"][jData["record"].length-1]["gstinshipped"]);
	$("#txtConName").val(jData["record"][jData["record"].length-1]["nameshipped"]);
	$("#txtConAddress").val(jData["record"][jData["record"].length-1]["addressshipped"]);
	$("#txtConState").val(jData["record"][jData["record"].length-1]["stateshipped"]);
	$("#txtConStateCode").val(jData["record"][jData["record"].length-1]["statecodeshipped"]);
	$("#txtTPonumber").val(jData["record"][jData["record"].length-1]["ponumber"]);
	if(jData["record"][jData["record"].length-1]["reversecharge"] =="N"){
		$(".switch-input").attr("checked",false);
		$(".switch .switch-label").attr("data-on","Yes")
		$(".switch .switch-label").attr("data-off","No")
		$("#reverseCharge").text("No")
	}
	else{
		$(".switch-input").attr("checked",true);
		$(".switch .switch-label").attr("data-on","Yes")
		$(".switch .switch-label").attr("data-off","No");
		$("#reverseCharge").text("Yes") 
	}
	$("#txtTMode").val(jData["record"][jData["record"].length-1]["transmode"]);
	$("#txtVehicleNumber").val(jData["record"][jData["record"].length-1]["vehicle"]);
	$("#txtDOS").val(jData["record"][jData["record"].length-1]["dos"]);
	$("#txtPOS").val(jData["record"][jData["record"].length-1]["pos"]);
	$("#txtDate").val(toDashDate(jData["record"][jData["record"].length-1]["date"].split(" ")[0]));
	$("#freight").val(jData["record"][jData["record"].length-1]["othercharges"]);
	$("#taxOnFreight").val(jData["record"][jData["record"].length-1]["taxothercharges"]);
	counter = jData["record"].length;
	generateSummary();
}

function productPriceShow(){
	if($("#txtBName").val() == "")
			alert("Buyer Cannot Be Empty !");
		else
		{
			var finalAmount = "";
			var qty = $("#txtQty").val();
			var rate = $("#txtRate").val();
			var discount = $("#txtDiscount").val();
			$("#txtAmount").val(qty*rate);
			var amount = $("#txtAmount").val();
			tax = Math.round(amount*discount)/100;
			$("#txtTax").val(parseFloat(amount - tax).toFixed(2));	
			var taxAmt = $("#txtTax").val();		
			if(localStorage.getItem("sellerStateCode") == $("#txtStateCode").val())
			{
					var cgstRate = $("#txtCgst").val();
					var sgstRate = $("#txtSgst").val();
					var cgstAmount = Math.round(taxAmt*cgstRate)/100;
					var sgstAmount = Math.round(taxAmt*sgstRate)/100;
					$("#txtCgstAmount").val(cgstAmount);
					$("#txtSgstAmount").val(sgstAmount);
					finalAmount = (parseFloat(taxAmt) + parseFloat($("#txtCgstAmount").val()) + parseFloat($("#txtSgstAmount").val())).toFixed(2);
			}
			else{
				var igstRate = $("#txtIgst").val();		
				var igstAmount = Math.round(taxAmt*igstRate)/100;
				$("#txtIgstAmount").val(igstAmount);
				finalAmount = (parseFloat(taxAmt) + parseFloat($("#txtIgstAmount").val())).toFixed(2);
			}		
			$("#txtFinalAmount").val(finalAmount);
		}
}

function servicePriceShow(){
	if($("#txtBName").val() == "")
			alert("Buyer Cannot Be Empty !");
		else
		{
			var finalAmount = "";
			var discount = $("#txtDiscount").val();
			var amount = $("#txtAmount").val();
			tax = Math.round(amount*discount)/100;
			$("#txtTax").val(parseFloat(amount - tax).toFixed(2));	
			var taxAmt = $("#txtTax").val();		
			if(localStorage.getItem("sellerStateCode") == $("#txtStateCode").val())
			{
					var cgstRate = $("#txtCgst").val();
					var sgstRate = $("#txtSgst").val();
					var cgstAmount = Math.round(taxAmt*cgstRate)/100;
					var sgstAmount = Math.round(taxAmt*sgstRate)/100;
					$("#txtCgstAmount").val(cgstAmount);
					$("#txtSgstAmount").val(sgstAmount);
					finalAmount = (parseFloat(taxAmt) + parseFloat($("#txtCgstAmount").val()) + parseFloat($("#txtSgstAmount").val())).toFixed(2);
			}
			else{
				var igstRate = $("#txtIgst").val();		
				var igstAmount = Math.round(taxAmt*igstRate)/100;
				$("#txtIgstAmount").val(igstAmount);
				finalAmount = (parseFloat(taxAmt) + parseFloat($("#txtIgstAmount").val())).toFixed(2);
			}		
			$("#txtFinalAmount").val(finalAmount);
		}
}

function checkInvoiceType(){
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
}

function searchWithBillNumber(invnum){
	$.ajax({
		url: apiInvoice,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "searchwrtnum",
				"userid": localStorage.getItem('userId'),
				"invnum":invnum
				},
		type: 'post',
		success: function(output) {						
			var jData = JSON.parse(output);
			if(jData['status']['message'] != '1')
				alert("Unable to Search. Please try again !")
			else{				
				$("#contentDiv").addClass("hidden");
				$("#criteriaDetails").removeClass("hidden");
				$("#invoiceByCriteria").addClass("hidden");
				$("#lblTMode").text(jData["record"][0]["transmode"]);
				$("#lblTVehicleNo").text(jData["record"][0]["vehicle"])
				$("#lblTDos").text(jData["record"][0]["dos"])
				$("#lblTPos").text(jData["record"][0]["pos"])
				$("#lblBuyerBilledName").text(jData["record"][0]["buyerbilledname"])
				$("#lblBuyerShippedName").text(jData["record"][0]["buyershippedname"])
				$("#lblTaxableValue").text(jData["record"][0]["taxablevalue"])
				$("#lblOtherCharges").text(jData["record"][0]["othercharges"])
				$("#lblCgst").text(jData["record"][0]["cgst"])
				$("#lblSgst").text(jData["record"][0]["sgst"])
				$("#lblIgst").text(jData["record"][0]["igst"])
				$("#lblCgst").text(jData["record"][0]["cgst"])
				$("#lblTotal").text(jData["record"][0]["total"])

				document.getElementById("divInvoice").innerHTML = jData["record"][0]["structure"]
				$("#invoiceNo").text(jData["record"][0]["number"])
				$("#invoiceDate").text(jData["record"][0]["date"].split(' ')[0])
			}
		}
	});
}

function cancelBill(){
	var invoicenum = $("#headerSearchInvoiceNum").val();
	$.ajax({
					url: apiInvoice,
					async: false,   // this is the important line that makes the request sincronous
					data: {"action": "cancelinvoice",
							"userid": localStorage.getItem('userId'),
							"invoicenum":$("#headerSearchInvoiceNum").val()
							},
					type: 'post',
					success: function(output) {						
						var jData = JSON.parse(output);
						if(jData['status']['message'] != '1')
							alert("Unable to Cancel Bill. Please try again !")
						else{
							alert("Bill Number - "+ invoicenum +" has been cancelled.")
							window.location.reload();
						}
					}
				});
}
function getAllBills(records){
	var div = $("#smallBill").clone();
	records.forEach(function(element){
	})
}

function getProductInvoiceDetails(invoicenum,billType){
	invoiceDisplay();
	if($("#reverseCharge").text() == "YES" || $("#reverseCharge").text() == "Yes"){
		strReverseCharge = "Y";
	}
	else{
		strReverseCharge = "N";
	}
	if(invoicenum == null)
		sendMainProductBill(billType);
 	else
		sendEditedProductBill(invoicenum,billType);
}

function getServiceInvoiceDetails(invoicenum,billType){
	invoiceDisplay();
		if($("#reverseCharge").text() == "YES" || $("#reverseCharge").text() == "Yes"){
			strReverseCharge = "Y";
		}
		else{
			strReverseCharge = "N";
		}
		if(invoicenum == null)
			sendMainServiceBill(billType);
	 	else
			sendEditedServiceBill(invoicenum,billType);
}

function invoiceDisplay(){
		var taxOnFreight = $("#taxOnFreight").val();
		var freight = parseFloat($("#freight").val());
		freightValueTax = Math.round(freight*parseFloat(taxOnFreight))/100; ///////////////////////////
		freightValueAfterTax = parseFloat(freight) + parseFloat(freightValueTax);
		console.log(billDetails);
		generateSummary();

		if($("#reverseCharge").text() == "YES" || $("#reverseCharge").text() == "Yes"){
			$("#amtBeforeTax").text(parseFloat(amtBeforeTax).toFixed(2));
			$("#freightCharges").text(freight);
			$("#taxableValue").text((parseFloat(amtBeforeTax) + freight).toFixed(2));	
			taxableValue = $("#taxableValue").text();
			$("#totalCgst").text("-");
			$("#totalSgst").text("-");
			$("#totalIgst").text("-");
			if(!totalIgst){
				totalIgst = "0.0";
				$("#amtAfterTax").text((parseFloat(totalCgst)+parseFloat(totalSgst)+parseFloat(amtBeforeTax) + parseFloat(freight) + parseFloat(freightValueTax)).toFixed(2));
				$("#totalReverse").text((parseFloat(totalCgst)+parseFloat(totalSgst)+parseFloat(freightValueTax)).toFixed(2));
			}
			else{
				totalSgst = "0.0";
				totalCgst = "0.0";
				$("#amtAfterTax").text((parseFloat(totalIgst)+parseFloat(amtBeforeTax) + parseFloat(freight) + parseFloat(freightValueTax)).toFixed(2));
				$("#totalReverse").text((parseFloat(totalIgst)+parseFloat(freightValueTax)).toFixed(2));
			}
		}
		else{
			$("#amtBeforeTax").text(parseFloat(amtBeforeTax).toFixed(2));
			$("#freightCharges").text(freight);
			$("#taxableValue").text((parseFloat(amtBeforeTax) + freight).toFixed(2));
			taxableValue = $("#taxableValue").text();
			if(localStorage.getItem('sellerStateCode') == $("#txtStateCode").val()){
				$("#totalCgst").text((parseFloat(totalCgst) + parseFloat(freightValueTax/2)).toFixed(2));
				$("#totalSgst").text((parseFloat(totalSgst)+ parseFloat(freightValueTax/2)).toFixed(2));
				$("#totalIgst").text("N.A.");
			}
			else{
				$("#totalCgst").text("-");
				$("#totalSgst").text("-");
				$("#totalIgst").text((parseFloat(totalIgst)+ parseFloat(freightValueTax)).toFixed(2));
			}	
			if(!totalIgst){
				totalIgst = "0.0";
				$("#amtAfterTax").text((parseFloat(totalCgst)+parseFloat(totalSgst)+parseFloat(amtBeforeTax) + parseFloat(freight) + parseFloat(freightValueTax)).toFixed(2));
			}
			else{
				totalSgst = "0.0";
				totalCgst = "0.0";
				$("#amtAfterTax").text((parseFloat(totalIgst)+parseFloat(amtBeforeTax) + parseFloat(freight) + parseFloat(freightValueTax)).toFixed(2));
			}
			$("#totalReverse").text("No");
		}
		$("#totalAmount").text(Math.round(parseFloat($("#amtAfterTax").text())));
		$("#cgstRate0").text(parseFloat(cgstRate0).toFixed(2));
		$("#cgstRate5").text(parseFloat(cgstRate5).toFixed(2));
		$("#cgstRate12").text(parseFloat(cgstRate12).toFixed(2));
		$("#cgstRate18").text(parseFloat(cgstRate18).toFixed(2));
		$("#cgstRate28").text(parseFloat(cgstRate28).toFixed(2));
		
		$("#igstRate0").text(parseFloat(igstRate0).toFixed(2));
		$("#igstRate5").text(parseFloat(igstRate5).toFixed(2));
		$("#igstRate12").text(parseFloat(igstRate12).toFixed(2));
		$("#igstRate18").text(parseFloat(igstRate18).toFixed(2));
		$("#igstRate28").text(parseFloat(igstRate28).toFixed(2));
		
		$("#sgstRate0").text(parseFloat(sgstRate0).toFixed(2));
		$("#sgstRate5").text(parseFloat(sgstRate5).toFixed(2));
		$("#sgstRate12").text(parseFloat(sgstRate12).toFixed(2));
		$("#sgstRate18").text(parseFloat(sgstRate18).toFixed(2));
		$("#sgstRate28").text(parseFloat(sgstRate28).toFixed(2));

		if(parseFloat(totalSale0) == 0.0)
			$("#row0").addClass("hidden");
		else{
			$("#row0").removeClass("hidden");
			$("#TotalSale0").text(parseFloat(totalSale0).toFixed(2));
		}
		if(parseFloat(totalSale5) == 0.0)
			$("#row5").addClass("hidden");
		else{
			$("#row5").removeClass("hidden");
			$("#TotalSale5").text(parseFloat(totalSale5).toFixed(2));
		}
		if(parseFloat(totalSale12) == 0.0)
			$("#row12").addClass("hidden");
		else{
			$("#row12").removeClass("hidden");
			$("#TotalSale12").text(parseFloat(totalSale12).toFixed(2));
		}
		if(parseFloat(totalSale18) == 0.0)
			$("#row18").addClass("hidden");
		else{
			$("#row18").removeClass("hidden");
			$("#TotalSale18").text(parseFloat(totalSale18).toFixed(2));
		}
		if(parseFloat(totalSale28) == 0.0)
			$("#row28").addClass("hidden");
		else{
			$("#row28").removeClass("hidden");
			$("#TotalSale28").text(parseFloat(totalSale28).toFixed(2));
		}
		
		$("#lblFreight").text(freight);
		$("#lblFreightTax").text(taxOnFreight+"%, Rupees "+freightValueTax);
	
		$('#tPonumber').text($("#txtTPonumber").val());
		if($("#txtTMode").val() != "-")
			$('#tmode').text($("#txtTMode").val());
		if($("#txtVehicleNumber").val() != "-")
			$('#tvehicle').text($("#txtVehicleNumber").val());
		$('#tdos').text(toDate($("#txtDOS").val()));
		$('#tpos').text($("#txtPOS").val());

		var strRupeesToWords = Math.round(parseFloat($("#amtAfterTax").text()).toFixed(2));
		second = convertNumberToWords(strRupeesToWords);
		$("#amtInWords").text(second+"Rupees Only");
		return true;
}

function generateSummary(){
	totalQty = 0,totalAmount = "0.0",amtBeforeTax="0.0",amountAfterTax="0.0",taxableValue="0.0",totalCgst="0.0",totalSgst="0.0",totalIgst="0.0",
		cgstRate0="0.0",cgstRate5="0.0",cgstRate12="0.0",cgstRate18="0.0",cgstRate28="0.0",
		sgstRate0="0.0",sgstRate5="0.0",sgstRate12="0.0",sgstRate18="0.0",sgstRate28="0.0",
		igstRate0="0.0",igstRate5="0.0",igstRate12="0.0",igstRate18="0.0",igstRate28="0.0",
		totalSale0="0.0",totalSale5="0.0",totalSale12="0.0",totalSale18="0.0",totalSale28="0.0",freightValue="0.0"/*,strReverseCharge*/;
	billDetails.forEach(function(element) {
			totalAmount = parseFloat(totalAmount) + parseFloat(element["total"]);
			//amtBeforeTax = parseFloat(amtBeforeTax) + parseFloat(element["amount"]);
			amtBeforeTax = parseFloat(amtBeforeTax) + parseFloat(element["taxablevalue"]);
			totalCgst = parseFloat(totalCgst) + parseFloat(element["cgstamt"]);
			totalSgst = parseFloat(totalSgst) + parseFloat(element["sgstamt"]);
			totalIgst = parseFloat(totalIgst) + parseFloat(element["igstamt"]);
			if(element["qty"] != null)
				totalQty = totalQty + parseInt(element["qty"]);

			if(element["igstrate"]!="0")
			{
				if(parseInt(element["igstrate"])==0){
					igstRate0 = parseFloat(igstRate0) + parseFloat(element["igstamt"]);
					totalSale0 = parseFloat(totalSale0) + parseFloat(element["taxablevalue"]);
				}
				else if(parseInt(element["igstrate"])==5){
					igstRate5 = parseFloat(igstRate5) + parseFloat(element["igstamt"]);
					totalSale5  = parseFloat(totalSale5) + parseFloat(element["taxablevalue"]);
				}
				else if(parseInt(element["igstrate"])==12){
					igstRate12 = parseFloat(igstRate12) + parseFloat(element["igstamt"]);
					totalSale12  = parseFloat(totalSale12) + parseFloat(element["taxablevalue"]);
				}
				else if(parseInt(element["igstrate"])==18){
					igstRate18 = parseFloat(igstRate18) + parseFloat(element["igstamt"]);
					totalSale18  = parseFloat(totalSale18) + parseFloat(element["taxablevalue"]);
				}
				else if(parseInt(element["igstrate"])==28){
					igstRate28 = parseFloat(igstRate28) + parseFloat(element["igstamt"]);
					totalSale28  = parseFloat(totalSale28) + parseFloat(element["taxablevalue"]);
				}
			}
			
			else{
				if(( parseFloat(element["cgstrate"]) + parseFloat(element["sgstrate"]) ) == 0) {
					cgstRate0 = parseFloat(cgstRate0) + parseFloat(element["cgstamt"]);
					sgstRate0 = parseFloat(sgstRate0) + parseFloat(element["sgstamt"]);
					totalSale0 = parseFloat(totalSale0) + parseFloat(element["taxablevalue"]);
				}
				else if(( parseFloat(element["cgstrate"]) + parseFloat(element["sgstrate"]) ) == 5) {
					cgstRate5 = parseFloat(cgstRate5) + parseFloat(element["cgstamt"]);
					sgstRate5 = parseFloat(sgstRate5) + parseFloat(element["sgstamt"]);
					totalSale5 = parseFloat(totalSale5) + parseFloat(element["taxablevalue"]);
				}
				else if(( parseFloat(element["cgstrate"]) + parseFloat(element["sgstrate"]) ) == 12) {
					cgstRate12 = parseFloat(cgstRate12) + parseFloat(element["cgstamt"]);
					sgstRate12 = parseFloat(sgstRate12) + parseFloat(element["sgstamt"]);
					totalSale12 = parseFloat(totalSale12) + parseFloat(element["taxablevalue"]);
				}
				else if(( parseFloat(element["cgstrate"]) + parseFloat(element["sgstrate"]) ) == 18) {
					cgstRate18 = parseFloat(cgstRate18) + parseFloat(element["cgstamt"]);
					sgstRate18 = parseFloat(sgstRate18) + parseFloat(element["sgstamt"]);
					totalSale18 = parseFloat(totalSale18) + parseFloat(element["taxablevalue"]);
				}
				else if(( parseFloat(element["cgstrate"]) + parseFloat(element["sgstrate"]) ) == 28) {
					cgstRate28 = parseFloat(cgstRate28) + parseFloat(element["cgstamt"]);
					sgstRate28 = parseFloat(sgstRate28) + parseFloat(element["sgstamt"]);
					totalSale28 = parseFloat(totalSale28) + parseFloat(element["taxablevalue"]);
				}
			}
		})
}

function sendMainProductBill(billType){
	var invoiceNum="";
	$.ajax({
		url: apiInvoice,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "generateinvoice",
				"userid": localStorage.getItem('userId'),
				"othercharges":$('#freight').val(),
				"transmode":$('#txtTMode').val(),
				"vehicle":$("#txtVehicleNumber").val(),
				"dos":$("#txtDOS").val(),
				"pos":$("#txtPOS").val(),
				"buyeridbilled":buyerid,
				"buyeridshipped":consigneeid,
				"taxablevalue":taxableValue,
				"cgst":totalCgst,
				"igst":totalIgst,
				"sgst":totalSgst,
				"total":$("#totalAmount").text(),
				"structure":document.getElementById('divInvoice').innerHTML,
				"invoiceprefixtext": localStorage.getItem('invoiceprefixtext'),
				"products": billDetails,
				"taxothercharges": $("#taxOnFreight").val(),
				"reversecharge": strReverseCharge,
				"ponumber": $("#txtTPonumber").val(),
				"date": toDate($("#txtDate").val()),
				"invoicetype": "product"			
				},
		type: 'post',
		success: function(output) {						
			var jData = JSON.parse(output);
			if(jData['status']['message'] != '1')
				alert("Unable to generate invoice. Please try again !")
			else{				
				invoiceNum = jData["record"][0]["invoicenum"];
				$("#lblBillType").text(billType);
				$("#invoiceNo").text(invoiceNum);
				$("#invoiceDate").text(toDate($("#txtDate").val().split(" ")[0]));
				document.title= "SAR Invoice #" + invoiceNum;

				multipleBillGeneration("80px")
			}
		}
	});
}

function sendEditedProductBill(invoicenum,billType){
	$.ajax({
		url: apiInvoice,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "editinvoice",
				"invoicenum": invoicenum,
				"userid": localStorage.getItem('userId'),
				"othercharges":$('#freight').val(),
				"transmode":$('#txtTMode').val(),
				"vehicle":$("#txtVehicleNumber").val(),
				"dos":$("#txtDOS").val(),
				"pos":$("#txtPOS").val(),
				"buyeridbilled":buyerid,
				"buyeridshipped":consigneeid,
				"taxablevalue":taxableValue,
				"cgst":totalCgst,
				"igst":totalIgst,
				"sgst":totalSgst,
				"total":$("#totalAmount").text(),
				"structure":document.getElementById('divInvoice').innerHTML,
				"invoiceprefixtext": localStorage.getItem('invoiceprefixtext'),
				"products": billDetails,
				"taxothercharges": $("#taxOnFreight").val(),
				"reversecharge": strReverseCharge,
				"ponumber": $("#txtTPonumber").val(),
				"date": toDate($("#txtDate").val()),
				"invoicetype": "product"			
				},
		type: 'post',
		success: function(output) {						
			var jData = JSON.parse(output);
			if(jData['status']['message'] != '1')
				alert("Unable to generateinvoice invoice. Please try again !")
			else{				
				$("#lblBillType").text(billType);
				$("#invoiceDate").text(toDate($("#txtDate").val().split(" ")[0]));
				document.title= "SAR Invoice #" + invoicenum;
				// document.body.innerHTML=document.getElementById('divInvoice').innerHTML;
				// $("#mainBody").css("margin-top","-20px");		
				// window.print();	
				// $("#lblBillType").text("DUPLICATE");
				// window.print();
				// $("#lblBillType").text("TRIPLICATE");
				// window.print();
				// window.location.reload();
				multipleBillGeneration("80px")
			}
		}
	});
}

function sendMainServiceBill(billType){
	var invoiceNum="";
	$.ajax({
		url: apiInvoice,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "generateinvoice",
				"userid": localStorage.getItem('userId'),
				"othercharges":$('#freight').val(),
				"transmode":"",
				"vehicle":"",
				"dos":$("#txtDOS").val(),
				"pos":$("#txtPOS").val(),
				"buyeridbilled":buyerid,
				"buyeridshipped":consigneeid,
				"taxablevalue":taxableValue,
				"cgst":totalCgst,
				"igst":totalIgst,
				"sgst":totalSgst,
				"total":$("#totalAmount").text(),
				"structure":document.getElementById('divInvoice').innerHTML,
				"invoiceprefixtext": localStorage.getItem('invoiceprefixtext'),
				"products": billDetails,
				"taxothercharges": $("#taxOnFreight").val(),
				"reversecharge": strReverseCharge,
				"ponumber": $("#txtTPonumber").val(),
				"date": toDate($("#txtDate").val()),
				"invoicetype": "service"	
				},
		type: 'post',
		success: function(output) {						
			var jData = JSON.parse(output);
			if(jData['status']['message'] != '1')
				alert("Unable to generate invoice. Please try again !")
			else{				
				invoiceNum = jData["record"][0]["invoicenum"];
				$("#invoiceNo").text(invoiceNum);
				$("#invoiceDate").text(toDate($("#txtDate").val().split(" ")[0]));
				$("#lblBillType").text(billType);
				document.title= "SAR Invoice #" + invoiceNum;
				// document.body.innerHTML=document.getElementById('divInvoice').innerHTML;
				// $("#mainBody").css("margin-top","-20px");			
				// window.print();
				// $("#lblBillType").text("DUPLICATE");
				// window.print();
				// $("#lblBillType").text("TRIPLICATE");
				// window.print();	
				// window.location.reload();
				multipleBillGeneration("80px")
			}
		}
	});
}

function sendEditedServiceBill(invoicenum,billType){
	var invoiceNum="";
	$.ajax({
		url: apiInvoice,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "editinvoice",
				"invoicenum": invoicenum,
				"userid": localStorage.getItem('userId'),
				"othercharges":$('#freight').val(),
				"transmode":"",
				"vehicle":"",
				"dos":$("#txtDOS").val(),
				"pos":$("#txtPOS").val(),
				"buyeridbilled":buyerid,
				"buyeridshipped":consigneeid,
				"taxablevalue":taxableValue,
				"cgst":totalCgst,
				"igst":totalIgst,
				"sgst":totalSgst,
				"total":$("#totalAmount").text(),
				"structure":document.getElementById('divInvoice').innerHTML,
				"invoiceprefixtext": localStorage.getItem('invoiceprefixtext'),
				"products": billDetails,
				"taxothercharges": $("#taxOnFreight").val(),
				"reversecharge": strReverseCharge,
				"ponumber": $("#txtTPonumber").val(),
				"date": toDate($("#txtDate").val()),
				"invoicetype": "service"	
				},
		type: 'post',
		success: function(output) {						
			var jData = JSON.parse(output);
			if(jData['status']['message'] != '1')
				alert("Unable to generate invoice. Please try again !")
			else{				
				document.title= "SAR Invoice #" + invoicenum;
				$("#lblBillType").text(billType);
				$("#invoiceDate").text(toDate($("#txtDate").val().split(" ")[0]));
				// document.body.innerHTML=document.getElementById('divInvoice').innerHTML;	
				// $("#mainBody").css("margin-top","-20px");		
				// window.print();
				// $("#lblBillType").text("DUPLICATE");
				// window.print();
				// $("#lblBillType").text("TRIPLICATE");
				// window.print();
				// window.location.reload();
				multipleBillGeneration("80px")
			}
		}
	});
}

function multipleBillGeneration(margin){
	var newPage = $('#divInvoice').html();
					 
	var rowcount = counter - 1;
	console.log(rowcount);
	var z = Math.floor(rowcount/ 14);
	if(rowcount==27)
		z = 2;
	if(z==0){
	}
	if(z>=1){
		if(parseInt(rowcount)>13){ //13 is the limit for next apge 26 is limit
			$("#secondDiv").html(newPage);
			$("#secondDiv #invoiceMain").css("margin-top",margin)
			var i=0;
			while(rowcount>0){
				console.log($('#secondDiv #invoiceTable tbody tr').eq(i).html())
				$('#secondDiv #invoiceTable tbody tr').eq(i).remove();
				rowcount--;			
			}
			rowcount = counter -1;
			if(z==2)
				rowcount = 26;
			for(var i=13;i<rowcount;i++){
				var row = $("#divInvoice #invoiceTable tbody tr").eq(i).html(); //this returns innerhtml so tds
				console.log(row);
				$("#secondDiv #invoiceTable tbody tr:last").before("<tr style='height:25px'>"+row+"</tr>");				
			}
			// /rowcount = counter -1;
			i=13;
			if(z!=2){
				while(rowcount>13){
					$('#divInvoice #invoiceTable tbody tr').eq(i).remove();		
					rowcount --;	
				}
			}									
		}
	}
	rowcount = counter - 1;
	if(z==2){
		if(parseInt(rowcount)>26){ //26 is the limit for next apge 26 is limit
			$("#thirdDiv").html(newPage);
			$("#thirdDiv #invoiceMain").css("margin-top",margin)
			var i=0;
			while(rowcount>0){
				console.log($('#thirdDiv #invoiceTable tbody tr').eq(i).html())
				$('#thirdDiv #invoiceTable tbody tr').eq(i).remove();
				rowcount--;			
			}
			rowcount = counter -1;
			for(var i=26;i<rowcount;i++){
				var row = $("#divInvoice #invoiceTable tbody tr").eq(i).html(); //this returns innerhtml so tds
				console.log(row);
				$("#thirdDiv #invoiceTable tbody tr:last").before("<tr style='height:25px'>"+row+"</tr>");				
			}
			rowcount = counter -1;
			i=13;
			while(rowcount>13){
				$('#divInvoice #invoiceTable tbody tr').eq(i).remove();		
				rowcount --;	
			}								
		}
	}
	rowcount = counter -1;
	if(rowcount>39){
		alert("only 39 products allowed at max in a bill")
		window.location.reload();
	}
	else{
		document.body.innerHTML=$('#divInvoice').html();
		$("#mainBody").css("margin-top","-20px");
		window.print();
		$("#lblBillType").text("DUPLICATE");
		window.print();
		$("#lblBillType").text("TRIPLICATE");
		window.print();
		window.location.reload();
	}
}

function headerFooterFetch(){
	var headerArray,footerArray;
	$.ajax({
		url: apiUser,
		async: false,   // this is the important line that makes the request sincronous
		data: {"action": "getheaderfooter",
				"userid": localStorage.getItem('userId')
				},
		type: 'post',
		success: function(output) {						
			var jData = JSON.parse(output);
			if(jData['status']['message'] != '1')
				alert("Some Error Occured. Please try again !")
			else{				
				headerArray = jData["record"][0]["header"].split("----");
				$("#gstinnumber	").text("GSTIN - "+jData["record"][0]["gstin"]);
				$("#headerLogo").text(headerArray[0]);
				var list = [];
				$("#headerAddress").text(headerArray[1]);
				for(var i=2;i<headerArray.length-1;i++){
					list += headerArray[i]+"</br>";
				}
				$("#headerContact").html(list);
				footerArray = jData["record"][0]["footer"].split("----");
				list = [];
				for(var i=0;i<footerArray.length;i++){
					list += "<li>"+footerArray[i]+"</li>";
				}
				$("#footer").html("<ul style='display:table'>"+list+"</ul>");
			}
		}
	});
}

function toDate(dateStr) {
	if(!dateStr)
		return "-";
    var parts = dateStr.split("-");
    return (parts[2]+"/"+ parts[1]+"/"+parts[0]);
}

function toDashDate(dateStr) {
    var parts = dateStr.split("/");
    return (parts[2]+"-"+ parts[1]+"-"+parts[0]);
}

function convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}