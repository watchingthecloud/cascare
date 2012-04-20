<!DOCTYPE HTML>
<html>
	<head>
		<link rel="stylesheet" type="text/css" href="../../../style.css">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script src="scripts/yui-min.js"></script>
	<!--apple meta-->
		<meta name="viewport" content="width = device-width, initial-scale = 1.0, user-scalable = no" />
		<link rel="apple-touch-icon" href="../../../images/ICON.png">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<link rel="apple-touch-startup-image" href="../../../images/SPLASH.png">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<!--apple meta-->
			<script type="text/javascript">
		var video = document.getElementById('video');
		video.addEventListener('click',function(){
			video.play();
		},false);
	</script>
	<script type="text/javascript">
function supports_video() { // test the availability of video support
  var v = document.createElement('video');
  return v && v.canPlayType;
}
function goHome() {
  top.location.replace("../ALB/ALB-home.html"); // do not want to break the back button
}
window.onload=function() {
  if (supports_video) {
    var video = document.getElementById('myVideo'); // not sure how IE8 gets to this line, but it does
    if (video && video.addEventListener) video.addEventListener('ended', goHome, false);
    else goHome(); // IE8 peculiarity.
  }
}
</script>
<title>Conscious injured</title>
	</head>
	<body>
		<div id="header">
			<img align="left" id="headflag" src="../../../images/sprite.png"/>
			<img align="right" id="logo" src="../../../images/logohead.png"/>
			Conscious injured
		</div>
		<div id="content">
			<!------------------------------------------------------------------------------------------------->
			<div id="viewlink"><a href="javascript:history.go(-1)" data-direction="reverse" class="backbtn">Back</a></div> 
<script type="text/javascript">
if (supports_video) {
  document.write('Here <a href="http://www.parasitesatemybrain.com/m/pa/vid/CI/CI.mp4" target="_blank">this video</a> is supposed to appear:<br /><video src="http://www.parasitesatemybrain.com/m/pa/vid/CI/CI.mp4" id="myVideo" autoplay="true" height="434" width="770" controls="controls">Video not supported anyway</video>');
}
else {
  alert('Sorry, this browser does not support HTML5 video, redirecting...')
  goHome();
}
</script>
			<!------------------------------------------------------------------------------------------------->
		</div>		
		<div id="menu" class="menu">
			<ul>
				<a href="../../../mcq.html"><li id="mcqbutton" class="menubutton" ><img src="../../../images/quizicon_sml.png"/></li></a>
				<a href="../../../triage.html"><li id="triagebutton" class="menubutton"><img src="../../../images/triageicon_sml.png"/></li></a>
				<a href="../../pa-home.html"><li id="patbutton" class="menubutton" ><img src="../../../images/assessmenticon_sml.png"/></li></a>
				<a href="../../../kit/kit-home.html"><li id="kitbutton" class="menubutton" ><img src="../../../images/bagicon_sml.png"/></li></a>
				<a href="../../../numbers.html"><li id="numbersbutton" class="menubutton" ><img src="../../../images/infoicon_sml.png"/></li></a>
			</ul>
		</div>
	</body>
</html>

<!--------------------------------------------------------------------------------------------------------------------------------->
