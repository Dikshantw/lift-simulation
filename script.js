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
    const liftLabel = document.createElement("span");
    liftLabel.textContent = `Lift ${i}`;
    lift.appendChild(liftLabel);
    liftContainer.appendChild(lift);
  }

  for (let j = noOfFloors; j > 0; j--) {
    const floor = document.createElement("div");
    const floorcontrollers = document.createElement("div");
    const upBtn = document.createElement("button");
    const downBtn = document.createElement("button");
    upBtn.innerText = "UP";
    downBtn.innerText = "DOWN";
    const floorLabel = document.createElement("span");
    floorLabel.textContent = `Floor ${j}`;
    upBtn.onclick = function () {
      moveLift(j);
    };
    downBtn.onclick = function () {
      moveLift(j);
    };
    const buttons = document.createElement("div");

    buttons.appendChild(upBtn);
    buttons.appendChild(downBtn);
    buttons.appendChild(floorLabel);
    floorcontrollers.appendChild(buttons);
    floorcontrollers.classList.add("floorcontrollers");
    floor.appendChild(floorcontrollers);
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

  availableLift.style.transform = `translateY(${-120 * (targetFloor - 1)}px)`;
  availableLift.style.transitionDuration = `${2 * Math.abs(targetFloor)}s`;
  availableLift.setAttribute("isMoving", "true");

  setTimeout(() => {
    availableLift.setAttribute("isMoving", "false");
  }, 1500 * targetFloor);
}
