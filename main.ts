input.onButtonPressed(Button.A, function () {
    basic.pause(1000)
    Wake()
})
function Sleep () {
    for (let index = 0; index <= 10; index++) {
        DFRobotMaqueenPluss.servoRun(Servos.S1, (LowerLimit - HeadAngle) / 10 * index + HeadAngle)
        basic.pause(50)
    }
    HeadAngle = LowerLimit
    WakeOn = false
    basic.showIcon(IconNames.SmallHeart)
}
function Wake () {
    for (let index = 0; index <= 10; index++) {
        DFRobotMaqueenPluss.servoRun(Servos.S1, (WakeAngle - HeadAngle) / 10 * index + HeadAngle)
        basic.pause(50)
    }
    HeadAngle = WakeAngle
    WakeOn = true
    basic.showIcon(IconNames.Heart)
}
input.onButtonPressed(Button.B, function () {
    Sleep()
})
let Width = 0
let CoordinateY = 0
let Height = 0
let CoordinateX = 0
let WakeOn = false
let WakeAngle = 0
let HeadAngle = 0
let LowerLimit = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_FACE_RECOGNITION)
LowerLimit = 80
let UpperLimit = 180
HeadAngle = LowerLimit
WakeAngle = (LowerLimit + UpperLimit) * 0.5
let UPAction = "none"
let LRAction = "none"
Sleep()
basic.forever(function () {
    if (WakeOn) {
        if (UPAction == "upper") {
            HeadAngle += 2
            if (HeadAngle > UpperLimit) {
                HeadAngle = UpperLimit
            }
            DFRobotMaqueenPluss.servoRun(Servos.S1, HeadAngle)
        } else if (UPAction == "lower") {
            HeadAngle += -2
            if (HeadAngle < LowerLimit) {
                HeadAngle = LowerLimit
            }
            DFRobotMaqueenPluss.servoRun(Servos.S1, HeadAngle)
        }
        if (LRAction == "left") {
            DFRobotMaqueenPluss.mototRun(Motors.M1, Dir.CCW, 40)
            DFRobotMaqueenPluss.mototRun(Motors.M2, Dir.CW, 40)
            basic.pause(160 - CoordinateX)
        } else if (LRAction == "right") {
            DFRobotMaqueenPluss.mototRun(Motors.M1, Dir.CW, 40)
            DFRobotMaqueenPluss.mototRun(Motors.M2, Dir.CCW, 40)
            basic.pause(CoordinateX - 160)
        }
        if (UPAction == "middle" && LRAction == "center") {
            DFRobotMaqueenPluss.setRGBLight(RGBLight.RGBA, Color.GREEN)
            if (Height < 160) {
                DFRobotMaqueenPluss.mototRun(Motors.ALL, Dir.CW, 60)
                basic.pause(240 - Height)
            } else {
                DFRobotMaqueenPluss.mototStop(Motors.ALL)
                Sleep()
            }
        } else if (UPAction == "none" && LRAction == "none") {
            DFRobotMaqueenPluss.setRGBLight(RGBLight.RGBA, Color.RED)
        } else {
            DFRobotMaqueenPluss.setRGBLight(RGBLight.RGBA, Color.YELLOW)
        }
        DFRobotMaqueenPluss.mototStop(Motors.ALL)
        basic.pause(240 / Height * 10)
    } else {
        DFRobotMaqueenPluss.setRGBLight(RGBLight.RGBA, Color.OFF)
    }
})
control.inBackground(function () {
    while (true) {
        huskylens.request()
        if (huskylens.isAppear(1, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            CoordinateX = huskylens.readeBox(1, Content1.xCenter)
            CoordinateY = huskylens.readeBox(1, Content1.yCenter)
            Width = huskylens.readeBox(1, Content1.width)
            Height = huskylens.readeBox(1, Content1.height)
            if (CoordinateY < 100) {
                UPAction = "upper"
            } else if (CoordinateY > 139) {
                UPAction = "lower"
            } else {
                UPAction = "middle"
            }
            if (CoordinateX < 140) {
                LRAction = "left"
            } else if (CoordinateX > 179) {
                LRAction = "right"
            } else {
                LRAction = "center"
            }
        } else {
            UPAction = "none"
            LRAction = "none"
        }
        basic.pause(10)
    }
})
