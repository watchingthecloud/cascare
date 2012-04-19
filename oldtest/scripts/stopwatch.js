var t=[0, 0, 0, 0, 0, 0, 0, 1];

setInterval ( "changecolor()", 30000 );

function changecolor ()
{
myObj = document.getElementById("disp");
myObj.style.color = "#FF0000";
}


function ss() 
{
	t[t[2]]=(new Date()).valueOf();
	t[2]=1-t[2];

	if (0==t[2]) 
	{
		clearInterval(t[4]);
		t[3]+=t[1]-t[0];
		var ttt = document.getElementById("lap");
		var a = document.createElement("div");
                a.id="div1";
                a.innerHTML+="<table><tr><td width=65 align=center>"+
		'Q '+(t[7]++)+"</td><td width=116 align=center>"+
		format(t[3])+"</td><td width=110 align=center>"+
		format(t[1]-t[0])+"</td></tr></table>";
		ttt.appendChild(a);
		t[4]=t[1]=t[0]=0;
		disp();
	} 
	else
	{
		t[4]=setInterval(disp, 43);
	}
}

function r() 
{
	t[4]=t[3]=t[2]=t[1]=t[0]=0;
	document.getElementById('lap').innerHTML='';
     ss();
	disp();
	t[5]=1;
}

function disp() 
{
	if (t[2]) t[1]=(new Date()).valueOf();
	t[6].value=format(t[3]+t[1]-t[0]);
}

function format(ms) 
{
	var d=new Date(ms+t[5]).toString()
		.replace(/.*([0-9][0-9]:[0-9][0-9]).*/, '$1');
	var x=String(ms%1000);
	while (x.length<3) x='0'+x;
	d+='.'+x;
	return d;
}

function stopwatch() 
{
	t[5]=new Date(1970, 1, 1, 0, 0, 0, 0).valueOf();
	t[6]=document.getElementById('disp');
	disp();
}
