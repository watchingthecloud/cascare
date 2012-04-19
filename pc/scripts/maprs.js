//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
   GLOBAL_COUNT=0;
   GLOBAL_AREAS= new Array();
   GLOBAL_WIDTH=1;
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
   function scaleXY(elementid,scale){
      // avoid problems with 0 scales and image becoming so small it does not change size 
      // I think something breaks in firefox(1) when you shrink so much that all values in an coords= become 0
      // I think something breaks in iexplore(1) when you shrink so much that all values in an coords= become 0
      myscale=Math.max(0,scale);
      oldwidth=document.getElementById(elementid).width
      oldheight=document.getElementById(elementid).height
      newwidth=Math.round(Math.max(oldwidth*myscale,1));
      newheight=Math.round(Math.max(oldheight*myscale,1));
      if(oldwidth == newwidth) newwidth=+1;
      if(oldheight == newheight) newheight=+1;
      document.getElementById(elementid).width=newwidth;
      document.getElementById(elementid).height=newheight;
      scaleArea();
   }
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//     Assuming one image map in document.
//     Assuming coordinates are comma-delimited in AREA COORDS= string.
//     Assuming the same zoom factor for the height as for the width of the image.
//
   function getglobal(){ // place original AREA coordinate strings into a global array, called at load
        var arrayAreas = document.body.getElementsByTagName("AREA");
        GLOBAL_WIDTH= document.getElementById("myimage").width; // get original width
        for(var i = 0; i < arrayAreas.length; i++) {
              GLOBAL_AREAS[i]= arrayAreas[i].coords;
        }
        GLOBAL_COUNT++;
   }
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  function scaleArea() {   // using values stored at load, recalculate new values for the current size
        var arrayAreas = document.body.getElementsByTagName("AREA");
        for(var i = 0; i < arrayAreas.length; i++) {
           ii=i+1;
           rescale= document.getElementById("myimage").width/GLOBAL_WIDTH ;
           sarray=GLOBAL_AREAS[i].split(",");      // convert coordinates to a numeric array assuming comma-delimited values
           var rarray =new Array();
           for(var j = 0; j < sarray.length; j++) {
              rarray[j]=parseInt(sarray[j])*rescale;  // rescale the values
              rarray[j]=Math.round(rarray[j]);
           }
           //alert( "GLOBAL " + GLOBAL_AREAS[i] + ":" + sarray.length + " SPLIT=" + sarray +rarray.length);  
           arrayAreas[i].coords=rarray.join(",");    // put the values back into a string
       }
        showArea();
   }
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
   function showArea() {
        var arrayAreas = document.body.getElementsByTagName("AREA");
        var string = "<pre>COORDINATES:\n" ;
        for(var i = 0; i < arrayAreas.length; i++) {
           ii=i+1;
           string=string + ii + ")" + arrayAreas[i].alt + " NEW coords=" + arrayAreas[i].coords ;
           string=string + " ORIGINAL coords=" + GLOBAL_AREAS[i] + "\n";
           document.getElementById("desc2").innerHTML= string + "\n</pre>";
        }
        document.getElementById("desc2").innerHTML= string + "\n</pre>";
   }
//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
