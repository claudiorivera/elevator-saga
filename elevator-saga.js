{
  init: (elevators, floors) => {
      // Map through elevators, since there will be more in the future
      elevators.map((elevator) => {
          // Start by indicating up, since we're on the 0th floor
          elevator.goingUpIndicator(true);
          elevator.goingDownIndicator(false);

          elevator.on("idle", () => {
              // Check to see if anyone inside wants to go somewhere
              if (elevator.getPressedFloors().length > 0) {
                  // Calculate the direction indicator
                  const currentFloor = elevator.currentFloor();
                  const destinationFloor = elevator.getPressedFloors()[0];
                  currentFloor < destinationFloor
                      ? elevator.goingUpIndicator(true)
                  : elevator.goingUpIndicator(false);
                  elevator.goingDownIndicator(!elevator.goingUpIndicator());
                  elevator.goToFloor(destinationFloor);
                  // TODO: If there are no more requests in that direction, flip direction indicator
              } else {
                  // No requests inside the elevator, so let's check for floor requests
                  // TODO: Update direction indicator
                  floors.map((floor) => {
                      floor.on("down_button_pressed", () => {
                          elevator.goToFloor(floor.floorNum());
                      });
                      floor.on("up_button_pressed", () => {
                          elevator.goToFloor(floor.floorNum());
                      });
                  });
              }
          });

          // Any time we stop at 0 or the top floor, change direction indicator
          elevator.on("stopped_at_floor", (floorNum) => {
              if (floorNum === 0 || floorNum === floors.length - 1) {
                  if (floorNum === 0) {
                      elevator.goingUpIndicator(true);
                      elevator.goingDownIndicator(false);
                  } else {
                      elevator.goingDownIndicator(true);
                      elevator.goingUpIndicator(false);
                  }
              }
          });

          // TODO: Check every floor for requests going in the direction of the elvator as it passes
          elevator.on("passing_floor", (floorNum, direction) => {
              console.log(`elevator passing floor ${floorNum} going ${direction}`);
              console.log(
                  `destination direction is ${elevator.destinationDirection()}`
              );
              if (direction === elevator.destinationDirection()) {
                  elevator.destinationQueue.unshift(floorNum);
                  elevator.checkDestinationQueue();
              } else {
                  elevator.destinationQueue.pop(floorNum);
                  elevator.checkDestinationQueue();
              }
          });
      });
  },
  update: (dt, elevators, floors) => {},
}