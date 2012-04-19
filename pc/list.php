<?PHP 

$folder = "kit/"; 
$handle = opendir($folder); 

# Making an array containing the files in the current directory: 
while ($file = readdir($handle)) 
{ 
    $files[] = $file; 
} 
closedir($handle); 

#echo the files 
foreach ($files as $file) { 
    echo "<a href=$folder$file>$file</a>"."<br />"; 
} 
?>