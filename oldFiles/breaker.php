<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>Breakout</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
	<link rel="stylesheet" href="style/sidebar.css">
	<link rel="stylesheet" href="style/pageStyle.css">
	<div id="login">
		
		<form method="post">
			<div style="width: 30%; float: left; padding: 30px, 30px; padding-left: 100px;" id="loginText">
				Username:&nbsp<input type="text" name="loginName"></input><br>
				Password:&nbsp&nbsp<input type="password" name="loginPassword"></input>
			</div>
			<div style="width: 30%; float: left; padding 30px, 30px;">
				<div class="login"><input type="submit" name="loginBtn" value="Login" class="button"><br>
				<a href="./register.php" class="button">Register</a></div> 
			</div>
		</form>	</div>
</head>
<body bgcolor=mediumslateblue>

	<div>
		<div class="logo"><img src="breaker_logo.png" width="480"></div>
	</div>
	
	
	<svg style="display:none;">
	  <defs>

		<g id="home">
		  <path fill="#e1cbf5" d="M42,48H6c-3.3,0-6-2.7-6-6V6c0-3.3,2.7-6,6-6h36c3.3,0,6,2.7,6,6v36C48,45.3,45.3,48,42,48z"/>
		  <path fill="#212121" d="M20.8,35.5v-9.6h6.4v9.6h8V22.7H40L24,8.3L8,22.7h4.8v12.8H20.8z"/>
		</g>

		<!--<g id="search">
		  <path fill="#e1cbf5" d="M22.9,20.1h-1.5l-0.5-0.5c1.8-2.1,2.9-4.8,2.9-7.7C23.8,5.3,18.5,0,11.9,0S0,5.3,0,11.9s5.3,11.9,11.9,11.9
			c3,0,5.7-1.1,7.7-2.9l0.5,0.5v1.4l9.1,9.1l2.7-2.7L22.9,20.1z M11.9,20.1c-4.5,0-8.2-3.7-8.2-8.2s3.7-8.2,8.2-8.2s8.2,3.7,8.2,8.2
			S16.4,20.1,11.9,20.1z"/>
		</g>-->

		<g id="map">
		  <path fill="#e1cbf5" d="M16,14.2c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8c1,0,1.8-0.8,1.8-1.8S17,14.2,16,14.2z M16,0
			C7.2,0,0,7.2,0,16c0,8.8,7.2,16,16,16s16-7.2,16-16C32,7.2,24.8,0,16,0z M19.5,19.5L6.4,25.6l6.1-13.1l13.1-6.1L19.5,19.5z"/>
		</g>

		<g id="planner">
		  <path fill="#e1cbf5" d="M28.4,3.6h-1.8V0h-3.6v3.6H8.9V0H5.3v3.6H3.6C1.6,3.6,0,5.1,0,7.1L0,32c0,2,1.6,3.6,3.6,3.6h24.9c2,0,3.6-1.6,3.6-3.6V7.1C32,5.1,30.4,3.6,28.4,3.6z M28.4,32H3.6V12.4h24.9V32z M7.1,16H16v8.9H7.1V16z"/>
		</g>

	  </defs>
	</svg>

	<nav class="nav__cont">
	  <ul class="nav">
		<li class="nav__items ">
		  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
			<use xlink:href="#home"></use>
		  </svg>
		  <a href="breaker.php">Home</a>
		</li>
		
		<!--<li class="nav__items ">
		  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
			<use xlink:href="#search"></use>
		  </svg>
		  <a href="">Search</a>
		</li>-->
		  
		<li class="nav__items ">
		  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
			<use xlink:href="#map"></use>
		  </svg>
		 <a href="changelog.php">Changelog</a>
		</li>
		  
		<li class="nav__items ">
		  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 35.6">
			<use xlink:href="#planner"></use></svg>
		  <a href="contact.php">Contact Us</a>
		</li>
			
	  </ul>
	</nav>
	<div>
		<canvas id="cnvs" width="800" height="600"></canvas>
		<input id="hiddenInput" type="text" name="hiddenInput" style="display:none" autofocus />
		<!--<div class="Istruzioni">
			ISTRUZIONI:<br>
			Per giocare, utilizzare il mouse, le freccette direzionali<br>
			o il touchscreen del proprio dispositivo.<br>
			L'obiettivo è abbattere quanti più mattoncini possibile,<br>
			prima di perdere tutte le palle.<br>
			Nota bene: colpendo la palla muovendoti, puoi variarne la<br>
			traiettoria, in modo da controllarla.
		</div>-->
	</div>
	<h1 style="text-align: center; font-family: 'Impact';">
			<br><font color='#151A3B'>HIGHSCORES<br>
	</h1>
	<h2>
						<table cellspacing=10 align=center>
							<tr>
				  <td><font color='#663399'>IGOR |</td><td><font color='#ffffff'>100000000000000000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>SOFCHEATY |</td><td><font color='#ffffff'>10006999</td>
				</tr>
							<tr>
				  <td><font color='#663399'>SENJOR99 |</td><td><font color='#ffffff'>765500</td>
				</tr>
							<tr>
				  <td><font color='#663399'>SORRY NICOLA |</td><td><font color='#ffffff'>245000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>SENJOR 99 |</td><td><font color='#ffffff'>187000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>XOXONOOB |</td><td><font color='#ffffff'>139500</td>
				</tr>
							<tr>
				  <td><font color='#663399'>127500 |</td><td><font color='#ffffff'>127500</td>
				</tr>
							<tr>
				  <td><font color='#663399'>TYRISS DETTO NICOLA |</td><td><font color='#ffffff'>107000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>PROCODOI |</td><td><font color='#ffffff'>83000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>DESTROYER002 |</td><td><font color='#ffffff'>41000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>ABC |</td><td><font color='#ffffff'>39000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>NOPE |</td><td><font color='#ffffff'>33000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>TAKEO |</td><td><font color='#ffffff'>28500</td>
				</tr>
							<tr>
				  <td><font color='#663399'>NOP |</td><td><font color='#ffffff'>20000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>NOP |</td><td><font color='#ffffff'>18000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>JAW |</td><td><font color='#ffffff'>18000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>PUSSYDESTROYER9000 |</td><td><font color='#ffffff'>14000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>DWDWA |</td><td><font color='#ffffff'>13000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>NABO |</td><td><font color='#ffffff'>12000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>GODDAM |</td><td><font color='#ffffff'>12000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>TOMAS |</td><td><font color='#ffffff'>11000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>SAS |</td><td><font color='#ffffff'>7000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>SASA |</td><td><font color='#ffffff'>7000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>GONZO |</td><td><font color='#ffffff'>7000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>TAKEO |</td><td><font color='#ffffff'>7000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>LOL |</td><td><font color='#ffffff'>5000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>SAS |</td><td><font color='#ffffff'>5000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>FORTNITE69 |</td><td><font color='#ffffff'>5000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>ASFCSEVG |</td><td><font color='#ffffff'>5000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>UTENTE |</td><td><font color='#ffffff'>4000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>XOXO2 |</td><td><font color='#ffffff'>4000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>XOXO |</td><td><font color='#ffffff'>3000</td>
				</tr>
							<tr>
				  <td><font color='#663399'>DONTBANSOF |</td><td><font color='#ffffff'>1</td>
				</tr>
							<tr>
				  <td><font color='#663399'>SAS |</td><td><font color='#ffffff'>0</td>
				</tr>
							<tr>
				  <td><font color='#663399'>NOTSOF |</td><td><font color='#ffffff'>0</td>
				</tr>
						  </tbody>
			</table>
						
	</h2>
	<script data-main="scripts/main" src="scripts/require.js"></script>

</body>
</html>