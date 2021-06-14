# FrontendBalls

Project BouncingBalls
===================================

Introduction / Project description
-----------------------------------
Create an application that displays interactive bouncing balls and a navigation panel to
control their behavior


Usage (how to set up, run and use the application)
-----------------------------------
This site doesn't require any specific application or tools, the user can just explore it by clicking on the various buttons to interact with the various animations.


Configuration and technical characteristics
-----------------------------------
Create an application that allows users to create and interact with bouncing balls with the following
requirements:

- new balls should be generated when the use clicks and drags the mouse

- the speed of the balls should depend on the speed of the mouse movement

- the direction of the balls should depend on the direction of motion of the mouse

- the balls should bounce at the edges of the container

- scrollbars should not appear when the balls hit the edges of the container

- the ball movement should have some physicality (wight, gravity, speed)

- it should be possible to 'freeze' and 'resume' the animation

- the user should be able to choose the 'skin' of the balls, colors, images, etc

- the user should be able to make the balls bigger or smaller with keyboard shortcuts and onscreen buttons

- the user should be able to remove balls (e.g. by clicking on them or on a button)

- the user should be able to to increase/decrease the speed of balls with keyboard shortcuts and onscreen buttons

- the page should be page responsive, meaning that when the user changes the size of the page, the balls never go out of their container and all page controls are repositioned to fit the viewport

- add an onscreen counter that displays the current number of balls



Performance is critical for an application of this type. Rather than using setTimeout or
setInterval consider methods that produce smoother animations such as the
requestAnimationFrame() documentation.


Files and project structure
-----------------------------------
The project contains html, css and javascript files:

-'FrontendBalls/PaulTest/withGravity.html', in the root folder there are all the .html files
-'FrontendBalls/PaulTest/js/canvasThingsGravity.js', in the 'js' there are all the .js files
-'FrontendBalls/PaulTest/style/test.css', in the 'style' there are all the .css files


Features delivered
-----------------------------------
	First page:
	-----------------------------------
	In the first page we wanted to show a random animation that starts immediately when we join the page. The main feature of this page is "the magnet".
	This function will catch all the balls that the mouse encounters (in a specific range around the pointer) when we click and drag. When we release the click, the magnet animation will stop and the balls will returno slowly on their path.

	Second page:
	-----------------------------------
	This page is more complex than the other, due the multiple animations implemented.
	Here we can find 4 sliders at the top of the page, each one with his specific function.
	The first one controls the gravity of the the balls.
	The second one controls the bouncyness of the ball.
	Those 2 sliders, with the right combination, can offer different animations and with a specific combination of gravity, bouncyness and the way the balls are thrown we can invert the gravity from Y axys to X axys.
	The third slider lets the users choose the size of the radius of the balls between a max and min.
	The fourth and last slider will allow the users to change the color of the balls in 6 different ways:
	- random color
	- pink
	- orange
	- green
	- yellow
	- blue

	On this page, at the start we have a function that spawns a specific amount of balls randomly (50 in our case). The user can also interact with the page with the click and drag action that will allow him to spawn multiple balls depending on how long the drag occurs. The balls spawn is also influenced by the speed that the mouse has when it moves, therefore if we click and drag at a slow speed, the balls will spawn with a minimum speed, else, the balls will inherit a higher speed depending on how quick we move the mouse.

	The pages have an arrow button to navigate through eachother.
	We also added a function to the Gravity page that triggers the music to start and stop by pressing the "m" key. In the other page, we implemented the same "m" key for the music and we also brougth a pause button triggered by the "p" key which will freeze or resume the animation.
	

Bonuses delivered
-----------------------------------
	Bonus 1: - making the application more game like, for example by adding rules:
	-----------------------------------
	We setted a few animations to engage the users and allow them to apply some changes to the animations.

    Bonus 2: - adding sounds or music:
    -----------------------------------
    We added some songs to the game that can be accessed by playing "m" on the keyboard.

    Bonus 3: - generate balls of random sizes and colors:
    -----------------------------------
    We added various sliders to allow the users to personalize the animations.

    Bonus 4: - addling backgrounds and images:
    -----------------------------------
    We added different colors and backgrounds to the game.

    Bonus 5: - Gravity:
    -----------------------------------
    Add a slider to adjust gravity and impact the ball movement.

    Bonus 6: - Increase balls size when they encounter the mouse while moving randomly (when hovered):
    -----------------------------------
    Add a slider to adjust gravity and impact the ball movement.


Browser compatibility
-----------------------------------
	IE11:
	-----------------------------------
	Partially compatible

	Chrome:
	-----------------------------------
	Fully compatible

	Firefox:
	-----------------------------------
	Fully compatible

    Opera:
	-----------------------------------
	Fully compatible

    Edge:
	-----------------------------------
	Fully compatible

    Brave:
	-----------------------------------
	Fully compatible

GitHub link
-----------------------------------
https://github.com/BadNarrators/FrontendBalls.git

Authors:
-----------------------------------
Martinus Paul
Atzei Andrea
Hounaifi Iliass
Basso Brigitta

 
