module.exports = {
  init: (elevators, floors) => {
    // Map through elevators, since there will be more in the future
    elevators.map((elevator) => {
      elevator.on("idle", () => {
        // Check to see if anyone inside wants to go somewhere
        if (elevator.getPressedFloors().length > 0) {
          // Calculate the direction indicator
          // For now, use the first floor in the array
          // TODO: Map through pressed floors to find farthest (or nearest?) floor requesting
          const currentFloor = elevator.currentFloor();
          const farthestFloor = elevator.getPressedFloors()[0];

          elevator.goingUpIndicator(currentFloor < farthestFloor);
          if (elevator.goingUpIndicator()) {
            elevator.goingDownIndicator(false);
          } else {
            elevator.goingDownIndicator(true);
          }
          // Go to the farthest floor requesting
          // TODO: Check every floor for requests going in that direction
          elevator.goToFloor(farthestFloor);
          elevator.on("passing_floor", (floorNum, direction) => {
            floors[floorNum].on("up_button_pressed", () => {
              // TODO: Use destinationDirection instead
              if (direction === "up") {
                console.log("going up, pick them up!");
                console.log(elevator.destinationQueue);
              }
            });
            floors[floorNum].on("down_button_pressed", () => {
              if (direction === "down") {
                console.log("going down, pick them up!");
                console.log(elevator.destinationQueue);
              }
            });
            console.log(`passing ${floorNum} going ${direction}`);
          });
        }

        // When we stop at 0 or top floor, change direction indicator
        elevator.on("stopped_at_floor", (floorNum) => {
          elevator.goingDownIndicator(floorNum === floors.length - 1);
          if (elevator.goingDownIndicator()) {
            elevator.goingUpIndicator(false);
          } else {
            elevator.goingUpIndicator(true);
          }
        });

        // Otherwise, check to see if any floor is calling and go there
        floors.map((floor) => {
          floor.on("down_button_pressed", () => {
            elevator.goToFloor(floor.floorNum());
          });
          floor.on("up_button_pressed", () => {
            elevator.goToFloor(floor.floorNum());
          });
        });
      });
    });
  },
  update: (dt, elevators, floors) => {},
};
