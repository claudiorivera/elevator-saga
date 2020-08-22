{
  init: function(elevators, floors) {
      // Map through elevators, since there will be more in the future
      elevators.map(elevator=>{
          elevator.on("idle", function() {
              // Check to see if anyone inside wants to go somewhere
              if(elevator.getPressedFloors().length > 0) {
                  // For now, go to each of the called floors
                  // TODO: Add logic to sort floors more smart-like
                  elevator.getPressedFloors().map(floor=>{
                      elevator.goToFloor(floor);
                  })
              }

              // Otherwise, check to see if any floor is calling and go there
              floors.map(floor=>{
                  floor.on("down_button_pressed", ()=> {
                      elevator.goToFloor(floor.floorNum())
                  })
                  floor.on("up_button_pressed", ()=> {
                      elevator.goToFloor(floor.floorNum())
                  })
              })
          });

      })
  },
      update: function(dt, elevators, floors) {
      }
}