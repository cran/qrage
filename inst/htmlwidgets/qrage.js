HTMLWidgets.widget({

  name: 'qrage',

  type: 'output',

  initialize: function(el, width, height) {
    return {
    };

  },

  renderValue: function(el, x, instance) {
    $.getScript("http://code.jquery.com/ui/1.10.3/jquery-ui.min.js");
    $('.qrage').children().remove();
    $('#tooltip').remove();
    var ele = document.createElement("div");
    $(ele).attr("id","tooltip")
      .css({position: 'absolute', backgroundColor: "#111",color:'#fff',fontSize:'12px',borderRadius:25,padding:15})
      .appendTo('body');
    $('#tooltip').hide();


    var links = HTMLWidgets.dataframeToD3(x.df);
    var nodeValue = HTMLWidgets.dataframeToD3(x.tr);
    var nodeValue2 = HTMLWidgets.dataframeToD3(x.r);
    var nodeColor = HTMLWidgets.dataframeToD3(x.nodeColor);
    var nodes = {};
    
    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] || 
            (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] || 
            (nodes[link.target] = {name: link.target});
        link.value = +link.value;
    });
    
    
    var width = x.width;
    var height = x.height;
    var baseLinkDistance = x.distance;
    var nodeTextSize = x.textSize;

    // Set the range
    var  v = d3.scale.linear().range([0, 100]);
    v.domain([0, d3.max(links, function(d) { return d.value; })]);

    // Set the range for path color
    var  v2 = d3.scale.linear().range([100, 255]);
    v2.domain([d3.min(links, function(d) { return d.value; }), d3.max(links, function(d) { return d.value; })]);

    // Set the range for path opacity
    var  v3 = d3.scale.linear().range([x.linkOpacity[0], x.linkOpacity[1]]);
    v3.domain([d3.min(links, function(d) { return d.value; }), d3.max(links, function(d) { return d.value; })]);

    // Set the range for path stroke-width
    var  v4 = d3.scale.linear().range([x.linkWidth[0], x.linkWidth[1]]);
    v4.domain([d3.min(links, function(d) { return d.value; }), d3.max(links, function(d) { return d.value; })]);

    function max(arr){
      var result = arr[0] ;
      for(var i = 1; i<arr.length; i++){
          if(arr[i] > result){
              result = arr[i];
          }
      }
      return result;
    };

    function min(arr){
      var result = arr[0] ;
      for(var i = 1; i<arr.length; i++){
          if(arr[i] < result){
              result = arr[i];
          }
      }
      return result;
    };

    if(x.r==null){
      
    }else{
      var v5 = d3.scale.linear().range([x.nodeSize[0],x.nodeSize[1]]);
      v5.domain([min(x.r.nodevalue),max(x.r.nodevalue)]);
    }

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(function(d){
          return baseLinkDistance/v(d.value);
        })
        .charge(-300)
        .on("tick", tick)
        .start();

    var svg = d3.select(".qrage").append("svg")
        .attr("width", width)
        .attr("height", height);
 
    var colors = new Array(links.length);
    var colorMax = 256;
    var colorMin = 0;
    var sep = Math.ceil((colorMax - colorMin)/links.length)
    var cArr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
    var myColor = [];
    var cnt = 0;
    for(var i=0;i<cArr.length;i++){
        var c1 = cArr[i];
        for(var j=0;j<cArr.length;j++){
            myColor[cnt] = String(cArr[i])+String(cArr[j]);
            cnt++;
        }
    }
    

    // add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", function(d) { return "link " + d.type; })
        .style("stroke",function(d){ 
          var index=Math.round(v2(d.value));
          return x.linkColor;
          })
        .attr("value",function(d){return d.value})
        .style("opacity",function(d){ return v3(d.value);})
        .style("stroke-width",function(d){return v4(d.value);})
        .attr("marker-end",function(d,i){
          return "url(#end"+i+")";
        })
    
    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
      .enter().append("g")
        .attr("class", "node")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("dblclick",doubleClick)
        .call(force.drag);
    
    
    // add the nodes
    node.append("circle")
        .attr("r", 10);
        
    // add the text 
    node.append("text")
        .attr("x", nodeTextSize)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });


    $('.node').each(function(i){
        if(nodeValue.length>0){
          if($(this).text() in nodeValue[0]){
            $(this).attr("nodevalue",nodeValue[0][$(this).text()]);    
          }else{
            $(this).attr("nodevalue",0);    
          }
          
        }
        if(nodeColor.length>0){
          $(this).attr("setColor",nodeColor[0][$(this).text()]);
        }
    })

    $('.node').each(function(d){
        var pvalue = $(this).attr('nodevalue');
        
        $(this).attr('basecirclesize',function(){
          if(x.r == null){
            return 10;
          }else{
            return v5(pvalue);
          }
        })
        .children('circle')
        .attr('stroke',function(){
          return '#fff';
        })
        .attr('r',function(){
            if(x.r==null){
              return 10;              
            }else{
              return v5(pvalue);  
            }
        })
        .attr('fill',function(){
          if($(this).parent().attr('setColor')==null){
            return '#C9F';
          }else{
            return $(this).parent().attr('setColor');
          }
            return $(this).attr('setColor');
        });
        
    })

    var i = 0;
    var defs = svg.append("svg:defs");
    links.forEach(function(link){
      
        defs
        .append("marker")
        .attr("markerUnits","userSpaceOnUse")
        .attr("id","end"+i)
        .attr("viewBox","0 0 10 10")
        .attr("refX",function(){
          if(x.r==null){
            return 21;  
          }else{
            if(nodeValue[0][link.target.name]!=null){
              return v5(nodeValue[0][link.target.name])+10;  
            }else{
              return v5(0)+10;
            }
            
          }
        })
        .attr("refY",4.5)
        .attr("markerWidth",10)
        .attr("markerHeight",30)
        .attr("orient","auto")
        .append("polygon")
        .attr("points","0,0 0,10, 10,5")
        .attr("fill",x.arrowColor)
        ;
      i++;

    })


    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + 
                d.source.x + "," + 
                d.source.y + "A" + 
                dr + "," + dr + " 0 0,1 " + 
                d.target.x + "," + 
                d.target.y;
        });
    
        node
            .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; });
    }
    
    // action to take on mouse over
    function mouseover() {
        var basecirclesize = d3.select(this).attr('basecirclesize');
        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", basecirclesize*2);
        d3.select(this).select("text").transition()
            .duration(750)
            .attr("x", nodeTextSize*2);
        
        if(x.isSetNodeValue==true){
            var viewText = d3.select(this).select('text').text()+"<br><br>"+d3.select(this).attr("nodevalue");
        }else{
            var viewText = d3.select(this).select('text').text();
        }
        $('#tooltip').html(viewText);
        var top = d3.event.clientY-($('#tooltip').height())*2+$(window).scrollTop();
        var left = d3.event.clientX+$(window).scrollLeft();
        
        $('#tooltip').css({top:top,left:left}).show();
        
    }
    
    // action to take on mouse out
    function mouseout() {
        var basecirclesize = d3.select(this).attr('basecirclesize');
        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", basecirclesize);
        d3.select(this).select("text").transition()
            .duration(750)
            .attr("x", nodeTextSize);
            
        $('#tooltip').hide();
    }
  
    function doubleClick(){
      
      var nodeName = $(this).children("text").text();
      var nodeIdName = 'screen'+nodeName;
      var top = d3.event.clientY+$(window).scrollTop()-$('.qrage').offset().top;
      var left = d3.event.clientX+$(window).scrollLeft()-$('.qrage').offset().left;
      
      if(document.getElementById(nodeIdName)!=null){
          var exelem = document.getElementById(nodeIdName);
          
          $(exelem).animate({backgroundColor:'#bbb'},200,function(){
            $(exelem).animate({backgroundColor:'#ddd'},100);
          });
          
          
      }else{
          var elem = document.createElement("div");
          $(elem).attr("id",nodeIdName).attr("class","linkInfo")
              .css({position: 'absolute', backgroundColor: "#ddd",color:'#111',fontSize:'12px',padding:15,cursor:'move',top:top,left:left,borderStyle:'solid',borderWidth:'0px',borderColor:'#ddd',zIndex:9999})
          .appendTo('.qrage')
          .draggable({
              containment:'html',
              scroll:true,
          })
          .hide();
          
          var viewText1 = "";
          var columnText = "<table class='screenTable'><tr class='screenTableColumn'><td>source</td><td>target</td><td>value</td>";
          var cnt = 0;
          for(var i = 0;i<links.length;i++){
            var linksSource = links[i]["source"].name;
            var linksTarget = links[i]["target"].name;
            var linksValue = links[i]["value"];
            if(linksSource==nodeName){
              viewText1 = viewText1 + "<tr><td>"+linksSource+"</td><td>"+linksTarget+"</td><td>"+linksValue+"</td></tr>"
              cnt++;
            }else{
              
            }
          }
          if(cnt==0){
            viewText1 = "<p>"+nodeName+" --> </p>" + "Nan";
          }else{
            viewText1 = "<p>"+nodeName+" --> </p>"+columnText+viewText1 + "</table><br>"
          }
          
          
          
          cnt = 0;
          var viewText2 = "";
          for(var i = 0;i<links.length;i++){
            var linksSource = links[i]["source"].name;
            var linksTarget = links[i]["target"].name;
            var linksValue = links[i]["value"];
            if(linksTarget==nodeName){
              viewText2 = viewText2 + "<tr><td>"+linksSource+"</td><td>"+linksTarget+"</td><td>"+linksValue+"</td></tr>"
              cnt++;
            }else{
              
            }
          }
          if(cnt==0){
            viewText2 = "<p> --> "+nodeName+"</p>" + "Nan";
          }else{
            viewText2 = "<p> --> "+nodeName+"</p>"+columnText+viewText2 + "</table>"
          }
          
          var viewText= viewText1 + viewText2;
          $(elem).html(viewText);
          $('.screenTable').css({borderStyle:'1px solid'});

          $('.screenTable').children('tbody').children('tr').each(function(){
                  $(this).children('td').attr('class','screenTableTd');
                
          })
          $('.screenTableTd').css({border:'1px groove'})
          $('.screenTable').css({borderCollapse: 'collapse',width:$(this).innerWidth()})

          $(elem).fadeIn("slow",function(){
                var closeButton = document.createElement("div");
          
                $(closeButton).attr("id","screenCloseButton").appendTo(elem)
                .css({width:'20px',height:'20px'})
                .html("<text class='closeButtonText'>×</text>")
                .click(function(){
                  $(elem).fadeOut("slow",function(){
                    $(elem).remove();
                  });
                  
                })
                .mouseover(function(){
                  $(closeButton).css({backgroundColor:'#F33'});
                })
                .mouseout(function(){
                  $(closeButton).css({backgroundColor:'#AAA'});
                })
                .css({position: 'absolute', backgroundColor: "#AAA",color:'#111',cursor:'pointer',top:'0px',left:$(elem).innerWidth()-$(closeButton).width(),margin:'5px 0px 0px -5px',fontFamily:'sans-serif',lineHeight: 1.0})  
                ;
                  
                $('.closeButtonText').css({verticalAlign:'middle',position:'absolute',height:'20px',width:'20px',fontSize:'20px'})
          });
      }
    }

    function nodeStop(){
      d3.selectAll(".node").each(function(d){d.fixed=true;});
    }
    
    function nodeMove(){
      d3.selectAll(".node").each(function(d){d.fixed=false;});
    }

    svg.append("text").attr("x",20).attr("y",80).text("FIX")
    
    var f = false;
    var button= svg.append("rect")
          .attr("height", 20)
      .attr("width",20)
      .attr("x",50)
      .attr("y",65)
          .style("fill", "teal")
          .style("opacity", 1)
    	.on("click",function(){
    		if(f == false){
    			f = true;
    			button.style("fill","blue")
    			nodeStop()
    		}else{
    			f = false;
    			button.style("fill","teal")
    			nodeMove()
    
    		}
    	})
    	.on("mouseover",function(){
    			if(f){
    				return false
    			}else{
    				button.style("fill","red")
    			}
    		})
    	.on("mouseout",function(){
    			if(f){
    				return false
    			}else{
    				button.style("fill","teal")
    			}
    	})
    
  },

  resize: function(el, width, height, instance) {

  }

});
