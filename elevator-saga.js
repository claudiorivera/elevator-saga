module.exports = {
  init: (elevators, floors) => {
    // Map through elevators, since there will be more in the future
    elevators.map((elevator) => {
      elevator.on("idle", () => {
        // Check to see if anyone inside wants to go somewhere
        if (elevator.getPressedFloors().length > 0) {
          // Calculate the direction we want to go
          const currentFloor = elevator.currentFloor();
          // TODO: Map through pressed floors to find farthest floor requesting
          // For now, use the first element in the array
          const farthestFloor = elevator.getPressedFloors()[0];
          elevator.goingUpIndicator(currentFloor < farthestFloor);
          if (elevator.goingUpIndicator()) {
            elevator.goingDownIndicator(false);
          } else {
            elevator.goingDownIndicator(true);
          }
          // Go to the farthest floor requesting, checking every floor for requests
          // going in the same direction
          elevator.goToFloor(farthestFloor);
        }

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
