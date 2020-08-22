{
  init: function(elevators, floors) {
    elevators.forEach(elevator=>{

      elevator.on("idle", function() {

      });


    })

    floors.forEach(floor=>{
      console.log(floor.floorNum());
    })

  },
  update: function(dt, elevators, floors) {
  }
}