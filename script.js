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
  // Filter the lifts that are not moving
  let nonMovingLifts = Lift.filter((lift) => !lift.isMoving);

  if (nonMovingLifts.length === 0) {
    setTimeout(() => {
      getAvailabelLift(Lift, BtnQueue, button);
    }, 1000);

    return;
  }
  // Get the first request from the BtnQueue
  let { targetfloor } = BtnQueue[0];

  // Find the closest lift to the target floor, or the lift on the target floor
  let closestLiftData = nonMovingLifts.reduce((closest, currentLift) => {
    if (currentLift.currentFloor === targetfloor) {
      return currentLift; // Prioritize lift already on the target floor
    }
    let closestDistance = Math.abs(closest.currentFloor - targetfloor);
    let currentDistance = Math.abs(currentLift.currentFloor - targetfloor);

    return currentDistance < closestDistance ? currentLift : closest;
  });

  const closestLiftElement = document.querySelector(
    `.lift[data-lift-id='${closestLiftData.liftId}']`
  );

  if (closestLiftData.currentFloor === targetfloor) {
    DoorAnimation(0, closestLiftElement).then(() => {
      Lift[closestLiftData.liftId - 1].isMoving = false;
      button.disabled = false;
    });
  } else {
    moveLift(closestLiftElement, targetfloor, button);
  }

  // Remove the processed request from the BtnQueue
  BtnQueue.shift();
}

function moveLift(closestLiftElement, targetfloor, button) {
  // Find the corresponding lift data in the Lift array using liftId
  const liftId = closestLiftElement.getAttribute("data-lift-id");
  const liftIndex = Lift.findIndex((lift) => lift.liftId == liftId);

  if (liftIndex === -1) {
    return;
  }

  // Set the selected lift as moving
  Lift[liftIndex].isMoving = true;

  const transformValue = closestLiftElement.style.transform;
  const currentY = transformValue
    ? parseFloat(transformValue.match(/-?\d+\.?\d*/)[0])
    : 0;

  const targetY = -100.8 * (targetfloor - 1);
  const floorsToMove = Math.abs((targetY - currentY) / 100.8);

  // Move the lift in the DOM
  closestLiftElement.style.transform = `translateY(${targetY}px)`;
  closestLiftElement.style.transition = `all ${floorsToMove * 2}s linear`;

  // Update the lift's current floor in the Lift array
  Lift[liftIndex].currentFloor = targetfloor;

  // Add an event listener for when the lift movement is finished
  closestLiftElement.addEventListener(
    "transitionend",
    function onTransitionEnd() {
      // Remove the event listener after it's triggered
      closestLiftElement.removeEventListener("transitionend", onTransitionEnd);

      // Execute the DoorAnimation after the lift has finished moving
      DoorAnimation(floorsToMove, closestLiftElement).then(() => {
        // Set the lift as not moving after the door animation is complete
        Lift[liftIndex].isMoving = false;
        button.disabled = false;
      });
    }
  );
}

function DoorAnimation(floorsToMove, availableLift) {
  return new Promise((resolve) => {
    let leftDoor = availableLift.querySelector(".leftDoor");
    let rightDoor = availableLift.querySelector(".rightDoor");

    setTimeout(() => {
      leftDoor.style.transform = `translateX(-50px)`;
      rightDoor.style.transform = `translateX(50px)`;

      leftDoor.style.transition = `all 2.5s ease-in-out`;
      rightDoor.style.transition = `all 2.5s ease-in-out`;
    }, 1000);

    setTimeout(() => {
      leftDoor.style.transform = `translateX(0px)`;
      rightDoor.style.transform = `translateX(0px)`;

      leftDoor.style.transition = `all 2.5s ease-in-out`;
      rightDoor.style.transition = `all 2.5s ease-in-out`;

      setTimeout(() => {
        resolve();
      }, 2500);
    }, 2500);
  });
}
