function handleSubmit() {
  const simulation = document.getElementById("simulation");
  const noOfLifts = document.getElementById("liftValue").value;
  const noOfFloors = document.getElementById("floorsValue").value;
  simulation.innerHTML = "";
  if (
    isNaN(noOfFloors) ||
    isNaN(noOfLifts) ||
    noOfLifts <= 0 ||
    noOfFloors <= 0
  ) {
    alert("Please enter a valid number of lifts and floors.");
    return;
  }
  const liftContainer = document.createElement("div");
  liftContainer.classList.add("liftContainer");
  for (let i = 1; i <= noOfLifts; i++) {
    const lift = document.createElement("div");
    lift.classList.add("lift");
    lift.setAttribute("isMoving", "false");

    const doors = document.createElement("div");
    doors.classList.add("doors");
    const leftDoor = document.createElement("div");
    leftDoor.classList.add("leftDoor");
    const rightDoor = document.createElement("div");
    rightDoor.classList.add("rightDoor");
    doors.appendChild(leftDoor);
    doors.appendChild(rightDoor);
    const liftLabel = document.createElement("span");
    liftLabel.textContent = `Lift ${i}`;
    lift.appendChild(doors);
    lift.appendChild(liftLabel);
    liftContainer.appendChild(lift);
  }

  for (let j = noOfFloors; j > 0; j--) {
    const floor = document.createElement("div");
    const floorcontrollers = document.createElement("div");
    const upBtn = document.createElement("button");
    upBtn.classList.add("upBtn");
    const downBtn = document.createElement("button");
    downBtn.classList.add("downBtn");
    upBtn.innerText = "UP";
    downBtn.innerText = "DOWN";
    if (j == noOfFloors) {
      upBtn.style.display = "none";
    }
    if (j == 1) {
      downBtn.style.display = "none";
    }
    upBtn.onclick = function () {
      moveLift(j);
    };
    downBtn.onclick = function () {
      moveLift(j);
    };
    const buttons = document.createElement("div");
    const line = document.createElement("hr");
    buttons.appendChild(upBtn);
    buttons.appendChild(downBtn);
    floorcontrollers.appendChild(buttons);
    floorcontrollers.classList.add("floorcontrollers");
    floor.appendChild(floorcontrollers);
    floor.appendChild(line);
    simulation.appendChild(floor);
  }
  const GetFloor = document.querySelectorAll(".floorcontrollers");
  const Lifts = GetFloor[GetFloor.length - 1];
  Lifts.appendChild(liftContainer);
}

function moveLift(targetFloor) {
  const allLifts = document.querySelectorAll(".lift");
  const availableLift = Array.from(allLifts).find(
    (lift) => lift.getAttribute("isMoving") === "false"
  );
  console.log(availableLift);
  const currentY =
    parseFloat(availableLift.style.transform.match(/-?\d+\.?\d*/)) || 0;
  const targetY = -126.6 * (targetFloor - 1);
  const floorsToMove = Math.abs((targetY - currentY) / 126.6);
  availableLift.style.transform = `translateY(${targetY}px)`;
  availableLift.style.transitionDuration = `${floorsToMove * 2}s`;
  availableLift.setAttribute("isMoving", "true");
  DoorAnimation(floorsToMove, availableLift);
}

function DoorAnimation(floorsToMove, availableLift) {
  let doors = availableLift.querySelector(".doors");
  let leftDoor = doors.querySelector(".leftDoor");
  let rightDoor = doors.querySelector(".rightDoor");

  setTimeout(() => {
    leftDoor.style.transform = `translateX(-50px)`;
    rightDoor.style.transform = `translateX(50px)`;

    leftDoor.style.transition = `all 2.5s ease-in-out`;
    rightDoor.style.transition = `all 2.5s ease-in-out`;
  }, 2500 * floorsToMove);

  setTimeout(() => {
    leftDoor.style.transform = `translateX(0px)`;
    rightDoor.style.transform = `translateX(0px)`;

    leftDoor.style.transition = `all 2.5s ease-in-out`;
    rightDoor.style.transition = `all 2.5s ease-in-out`;
    setTimeout(() => {
      availableLift.setAttribute("isMoving", "false");
    }, 1500);
  }, 2500 * floorsToMove + 2500);
}
