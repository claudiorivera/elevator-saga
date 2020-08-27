{
  init: (elevators, floors) => {
      // Keep an array of floor requests
      const floorRequests = [];

      // Map through elevators, since there will be more in the future
      elevators.map((elevator) => {
          elevator.on("idle", () => {
              console.log("elevator idle");
              // Check to see if anyone inside wants to go somewhere
              if (elevator.getPressedFloors().length > 0) {
                  elevator.getPressedFloors().forEach((floorNum) => {
                      elevator.goToFloor(floorNum);
                  });
              } else {
                  // No requests inside the elevator, so let's check for floor requests
                  // If there are any, go there and remove from the floor requests
                  if (floorRequests.length > 0) {
                      floorRequests.forEach((request, index) => {
                          elevator.goToFloor(request.floorNum);
                          floorRequests.splice(index, 1);
                      });
                  }
              }
          });

          // Check every floor for requests going in the direction of the elvator as it passes
          elevator.on("passing_floor", (floorNum, direction) => {
              console.log(`passing ${floorNum} going ${direction}`);
              // Check if floorNum is in floorRequests
              if (floorRequests.length > 0 && elevator.loadFactor < 1) {
                  floorRequests.forEach((request, index) => {
                      if (
                          request.floorNum === floorNum &&
                          request.direction === direction
                      ) {
                          // If it is, go there and remove it from the floor requests
                          elevator.goToFloor(floorNum);
                          floorRequests.splice(index, 1);
                      }
                  });
              }
          });

          // Remove floor from the floor requests when the elevator is stopped at that floor
          elevator.on("stopped_at_floor", (floorNum) => {
              console.log(`stopped at ${floorNum}`);
              if (floorRequests.length > 0) {
                  floorRequests.forEach((request, index) => {
                      if (request.floorNum === floorNum) {
                          floorRequests.splice(index, 1);
                      }
                  });
              }
          });
      });

      // Map through floors, pushing requests into the floorRequests array
      // TODO: Sort the requests array based on direction of travel
      floors.map((floor) => {
          floor.on("down_button_pressed", () => {
              floorRequests.push({ floorNum: floor.floorNum(), direction: "down" });
          });
          floor.on("up_button_pressed", () => {
              floorRequests.push({ floorNum: floor.floorNum(), direction: "up" });
          });
      });
  },
  update: (dt, elevators, floors) => {},
}