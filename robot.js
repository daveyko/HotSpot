var robot = require('robotjs')

robot.setMouseDelay(100)

const scroll = () => {

	robot.scrollMouse(0, 7000)

	for (let i = 0; i < 5; i++){
		robot.scrollMouse(0, -3000)
		robot.scrollMouse(0, 3000)
	}

	robot.scrollMouse(0, -4000)

}


const AI = () => {
	robot.moveMouse(261,117)
	robot.mouseClick()
	robot.moveMouse(76, 207)
	robot.mouseClick()
	robot.moveMouse(261,117)
	robot.mouseClick()
	robot.moveMouse(76, 296)
	robot.mouseClick()
	robot.moveMouse(45, 477)
	robot.mouseClick()
	robot.moveMouse(54,566)
	robot.mouseClick()
	robot.moveMouse(1258,280)
	robot.mouseClick()
	robot.moveMouse(1208,112)
	robot.mouseClick()
	robot.mouseClick()
	robot.moveMouse(481,121)
	robot.mouseClick()
	robot.moveMouse(240,120)
	robot.mouseClick()
}

let i = 0
while (i< 10){
	AI()
	i ++
}

let j = 0
while(j < 10){
	scroll()
	j++
}



