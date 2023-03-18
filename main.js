var isPaused;
var previousDuration;
var previousDistance;

function evaluate(input, output) {
  if ( isPaused ) {
    return;
  }
  
  var cadence = Math.round(input.cadence * 60.0);

  // First version, we use the current cadence to take decisions
  // without keeping a long term state
  if ( cadence < 10 ) {
    output.duration_stand += input.duration - previousDuration;
    output.distance_stand += input.distance - previousDistance;
  }
  else if ( cadence >= 10 && cadence < 70 ) {
    output.duration_walk += input.duration - previousDuration;
    output.distance_walk += input.distance - previousDistance;
  }
  else {
    output.duration_run += input.duration - previousDuration;
    output.distance_run += input.distance - previousDistance;
  }
  previousDuration = input.duration;
  previousDistance = input.distance;
}

function onLoad(input, output) {
  isPaused = true;
  previousDuration = 0;
  previousDistance = 0;

  output.duration_stand = 0;
  output.distance_stand = 0;
  output.duration_walk = 0;
  output.distance_walk = 0;
  output.duration_run = 0;
  output.distance_run = 0;
}

function onExerciseStart() {
  isPaused = false;
}

function onExercisePause() {
  isPaused = true;
}

function onExerciseContinue() {
  isPaused = false;
}

function getUserInterface() {
  return {
    template: 't',
    tl: { input: 'Output/duration_walk', format: 'Duration_Approximate', title: 'Walking' },
    tr: { input: 'Output/duration_stand', format: 'Duration_Approximate', title: 'Stationary' },
    bottom: { input: 'Output/duration_run', format: 'Duration_Approximate', title: 'Running' }
  };
}

function getSummaryOutputs(input, output) {
  return [
    {
      id: "myzapp01.time_walk",
      name: "Walking",
      format: "Duration_Accurate",
      value: output.duration_walk
    },
    {
      id: "myzapp01.time_stand",
      name: "Stationary",
      format: "Duration_Accurate",
      value: output.duration_stand
    },
    {
      id: "myzapp01.time_run",
      name: "Running",
      format: "Duration_Accurate",
      value: output.duration_run
    },
    {
      id: "myzapp01.distance_walk",
      name: "Walking",
      format: "Distance_Accurate",
      value: output.distance_walk
    },
    {
      id: "myzapp01.distance_stand",
      name: "Stationary",
      format: "Distance_Accurate",
      value: output.distance_stand
    },
    {
      id: "myzapp01.distance_run",
      name: "Running",
      format: "Distance_Accurate",
      value: output.distance_run
    }
  ];
}
