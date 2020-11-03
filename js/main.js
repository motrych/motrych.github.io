$(document).ready(function() {
	$(".box").fancybox({
		helpers : {
			overlay : {
				css : {
					'background' : 'rgba(238,238,238,0.85)'
				}
			},
		},
	});
	// Change this number if you your navigation highlighted earlier
	var buffer = 100;
	
	// this figures the top of the navigation bar
	var navTop = $('#navigation').position().top ;
	

	$(document).scroll(function() {

		// this is the part that changes the background for the navigation. If you add to the navigation, you need to change this.
/*
		if ($(document).scrollTop() > $('#three').offset().top - buffer ) {
			$('li', '#nav').removeClass('active');
			$('li:eq(2)', '#nav').addClass('active');
		} else if ($(document).scrollTop() > $('#two').offset().top - buffer ) {
			$('li', '#nav').removeClass('active');
			$('li:eq(1)', '#nav').addClass('active');
		} else if ($(document).scrollTop() > $('#one').offset().top - buffer ) {
			$('li', '#nav').removeClass('active');
			$('li:eq(0)', '#nav').addClass('active');
		} else {
			$('li', '#nav').removeClass('active');
		}
*/
		// This is what changes the navigation back and forth between fixed and unfixed. It automatically figures the height of the navigation.
		
	  if ($(document).scrollTop() >= navTop ) {
		$('#navigation').addClass('fix');
	    }
	    else {
		$('#navigation').removeClass('fix');
	    }
  	});

	// This part will animate a scroll to the section chosen in the naviation.

	$('#navigation li>a').click(function() {
		var block = $(this).data('section'),
			blockRoof = $('#' + block).position().top - 50;
			
		$('html, body').animate({scrollTop : blockRoof }, 600, 'swing');
    	return false;
  	});

});

function load_content(data) {
    var sentData = new Object();
    sentData['fcategory_id'] =  cur_conf['fcategory_id'];
    filterdata = activeFilters.find("div.filter-item.use");

    $.each(filterdata,function(index,data){
	dataName = $(data).data('name');
	dataValue = $(data).data('value');
	
	if(dataName == "fattributes"){
	    attrId = $(data).data('id');	    
	    if(typeof(sentData[dataName])=="undefined"){
	   		sentData[dataName] = new Object(); 
		}
	    var attrFound = false;
	    for(var prop in sentData[dataName])
		if(prop == attrId){
		  attrFound = true;
		  break;
	        }
	    if(!attrFound){
	      sentData[dataName][attrId] = new Array();
	    }
	    
	    sentData[dataName][attrId].push(dataValue);
	
	}else
	{
		if(!isArray(sentData[dataName])){
	    		sentData[dataName] = new Array();
		}
	

	    sentData[dataName].push(dataValue);
	}
    });
    if((typeof data != "undefined")&&(typeof data['page']!="undefined"))
	sentData['page'] = data['page'];

    if(typeof cur_conf['sort']!="undefined")
	sentData['sort'] = cur_conf['sort'];
    if(typeof cur_conf['order']!="undefined")
	sentData['order'] = cur_conf['order'];
    if(typeof cur_conf['limit']!="undefined")
	sentData['limit'] = cur_conf['limit'];

    var productFrame = $('div.product-list,div.product-grid');


    $.ajax({
        type :  'POST',
        data : sentData,
        dataType : 'json',
        url  : 'index.php?route=module/filter/getIndex',
        
        error : function(req,stat,err) {
            console.log(req + "\n\n" + stat + "\n\n" + err );
        },      
        
        beforeSend : function() {
            productFrame.html('<img src="/catalog/view/theme/default/image/ajax-loader.gif" />');
            $('.pagination').html('');
        },
        
        success : function(data) {
            json = data ;
	    result= data;
	    products = json.products;
	    if( products == undefined || products.length < 1 ) {
                productFrame.html(json.text_empty);
            } else {
                productFrame.html('');
		$('html, body').stop().animate({ scrollTop: 200},{queue:false});
                $.each( products, function( index , data )  {
                    var productDiv = 
			'<div>'
                        +'<div class="right">'
                          +'<div class="cart"><a onclick="addToCart(\''+data.product_id+'\');" class="btn_buy"><span>'+json.button_cart+'</span></a></div>'
                          +'<div class="wishlist"><a onclick="addToWishList(\''+data.product_id+'\');"><span>'+json.button_wishlist+'</span></a></div>'
                          +'<div class="compare"><a onclick="addToCompare(\''+data.product_id+'\');"><span>'+json.button_compare+'</span></a></div>'
                        +'</div>'
                        +'<div class="left">'
                          +'<div class="image">'
                          +'<a href="'+data.href+'">'
                          +'<img src="'+data.thumb+'" title="'+data.name+'"/>'
                          +'</a>'
                        +'</div>';
		       if(data.special){
			    productDiv+='<div class="price">'
			    +'<div class="pprice"><span class="price-old">'+data.price+'</span></div>'
			    +'<div class="pprice"><span class="price-new">'+data.special+'</span></div>'
			
			    +'</div>';
		    }
		    else
		    {
			productDiv+='<div class="price"><div class="pprice"><span>'+data.price+'</span></div></div>';
		    }
                    
		    productDiv+=
                         '<div class="name"><a href="'+data.href+'">'+data.name+'</a></div>'
                        +'<div class="description">'+data.description+'</div>'
                        +'</div>'
                        +'</div>';
                    productFrame.append(productDiv);
                });
		$('.pagination').html(json.pagination);
		$('div.pagination').on('click','a',function(e){
		    e.preventDefault();
		    var cur_url = $(this).attr('href');
		    var regexpstr = /.*page=([0-9]+).*/ig;
		    var page  = cur_url.replace(regexpstr,'$1');
		    if (page!=null)
		    {
			var data = new Array();
			data['page']=page;
			load_content(data);
		    }
		});
            }
        }        
    }); 
}