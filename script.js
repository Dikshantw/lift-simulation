let BtnQueue = [];
let Lift = [];

function handleSubmission() {
  BtnQueue = [];
  Lift = [];

  const floorValue = document.getElementById("number-of-floors").value;
  const liftValue = document.getElementById("number-of-lifts").value;
  const simulation = document.getElementById("simulation");
  simulation.innerHTML = "";

  if (
    isNaN(floorValue) ||
    isNaN(liftValue) ||
    liftValue < 1 ||
    floorValue < 2
  ) {
    alert("Please make sure that floors > 1 and lifts > 0.");
    return;
  }

  addFloors(floorValue, liftValue, simulation);
}

function addFloors(floorValue, liftValue, simulation) {
  for (let i = floorValue; i > 0; i--) {
    const floor = document.createElement("div");
    floor.classList.add("floor");
    floor.setAttribute("data-floor-id", i);

    const buttons = document.createElement("div");
    buttons.classList.add("buttonContainer");

    const floorLabel = document.createElement("span");
    floorLabel.textContent = "floor" + " " + floor.dataset.floorId;
    buttons.appendChild(floorLabel);

    const upButton = document.createElement("button");
    upButton.textContent = "UP";
    upButton.classList.add("upButton");
    upButton.setAttribute("data-is-pressed", false);
    buttons.appendChild(upButton);
    upButton.onclick = () => handleLiftRequest(i, upButton);

    const downButton = document.createElement("button");
    downButton.textContent = "DOWN";
    downButton.classList.add("downButton");
    downButton.setAttribute("data-is-pressed", false);
    downButton.onclick = () => handleLiftRequest(i, downButton);

    buttons.appendChild(downButton);

    floor.appendChild(buttons);

    if (i == floorValue) {
      upButton.style.display = "none";
    }
    if (i == 1) {
      downButton.style.display = "none";
      addLifts(liftValue, floor);
    }
    simulation.appendChild(floor);
  }
}

function addLifts(liftValue, floor) {
  const liftContainer = document.createElement("div");
  liftContainer.classList.add("liftContainer");

  for (let i = 1; i <= liftValue; i++) {
    const lift = document.createElement("div");
    lift.classList.add("lift");
    lift.setAttribute("data-lift-id", i);
    const leftDoor = document.createElement("div");
    leftDoor.classList.add("leftDoor");
    lift.appendChild(leftDoor);

    const rightDoor = document.createElement("div");
    rightDoor.classList.add("rightDoor");
    lift.appendChild(rightDoor);

    Lift.push({
      liftId: i,
      isMoving: false,
      currentFloor: 1,
      queue: [],
      element: lift,
    });

    liftContainer.appendChild(lift);
  }
  floor.appendChild(liftContainer);
}

function handleLiftRequest(targetfloor, button) {
  BtnQueue.push({ targetfloor });
  button.disabled = true;
  getAvailabelLift(Lift, BtnQueue, button);
}

function getAvailabelLift(Lift, BtnQueue, button) {
  let nonMovingLifts = Lift.filter((lift) => !lift.isMoving);

  if (nonMovingLifts.length === 0) {
    setTimeout(() => {
      getAvailabelLift(Lift, BtnQueue, button);
    }, 1000);
    return;
  }

  let { targetfloor } = BtnQueue[0];

  let closestLift = nonMovingLifts.reduce((closest, currentLift) => {
    if (currentLift.currentFloor === targetfloor) {
      return currentLift;
    }
    let closestDistance = Math.abs(closest.currentFloor - targetfloor);
    let currentDistance = Math.abs(currentLift.currentFloor - targetfloor);
    return currentDistance < closestDistance ? currentLift : closest;
  });
  console.log(closestLift);

  closestLift.queue.push({ targetfloor, button });
  console.log("nearest lift", closestLift);
  processQueue(closestLift);

  BtnQueue.shift();
}

function processQueue(lift) {
  console.log("thus is qure", lift.queue);
  if (lift.isMoving || lift.queue.length === 0) return;

  const request = lift.queue[0];
  moveLift(lift, request.targetfloor, request.button);
}

function moveLift(lift, targetFloor, button) {
  lift.isMoving = true;
  console.log("moveLift=", lift);

  const transformValue = lift.element.style.transform;
  const currentY = transformValue
    ? parseFloat(transformValue.match(/-?\d+\.?\d*/)[0])
    : 0;

  const targetY = -100.8 * (targetFloor - 1);
  const floorsToMove = Math.abs((targetY - currentY) / 100.8);

  // Move the lift in the DOM
  lift.element.style.transform = `translateY(${targetY}px)`;
  lift.element.style.transition = `all ${floorsToMove * 2}s linear`;

  // Update the lift's current floor in the Lift array
  lift.currentFloor = targetFloor;
  let time = floorsToMove * 2000;
  setTimeout(() => {
    openDoors(lift);

    setTimeout(() => {
      closeDoors(lift);

      setTimeout(() => {
        button.style.backgroundColor = "";
        button.disabled = false;
        lift.queue.shift();
        lift.isMoving = false;
        processQueue(lift);
      }, 2500); // Door closing time
    }, 2500); // Door open time
  }, time);
}

function updatePosition(lift, nextFloor) {
  lift.element.style.transform = `translateY(${-(nextFloor - 1) * 100.8}px)`; // assuming floor height is 140px
  lift.element.style.transition = `transform 2s linear`; // assuming 2 seconds per floor
  console.log("updating position");
}

function openDoors(lift) {
  lift.element.querySelector(".leftDoor").style.transform = `translateX(-30px)`;
  lift.element.querySelector(".rightDoor").style.transform = `translateX(30px)`;
  lift.element.querySelector(
    ".leftDoor"
  ).style.transition = `all 2.5s ease-in-out`;
  lift.element.querySelector(
    ".rightDoor"
  ).style.transition = `all 2.5s ease-in-out`;
}

function closeDoors(lift) {
  lift.element.querySelector(".leftDoor").style.transform = `translateX(0px)`;
  lift.element.querySelector(".rightDoor").style.transform = `translateX(0px)`;
  lift.element.querySelector(
    ".leftDoor"
  ).style.transition = `all 2.5s ease-in-out`;
  lift.element.querySelector(
    ".rightDoor"
  ).style.transition = `all 2.5s ease-in-out`;
}
