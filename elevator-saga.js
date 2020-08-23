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
          const destinationFloor = elevator.getPressedFloors()[0];
          console.log(
            `current floor: ${currentFloor}, dest floor: ${destinationFloor}`
          );
          currentFloor < destinationFloor
            ? elevator.goingUpIndicator(true)
            : elevator.goingUpIndicator(false);
          elevator.goingUpIndicator(!elevator.goingDownIndicator());

          // Go to the farthest floor requesting
          // TODO: Check every floor for requests going in that direction
          elevator.goToFloor(destinationFloor);
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
            console.log(`down button pressed on floor ${floor.floorNum()}`);
            elevator.goToFloor(floor.floorNum());
          });
          floor.on("up_button_pressed", () => {
            console.log(`up button pressed on floor ${floor.floorNum()}`);
            elevator.goToFloor(floor.floorNum());
          });
        });
      });
    });
  },
  update: (dt, elevators, floors) => {},
};
