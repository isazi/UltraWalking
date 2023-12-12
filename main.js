var coldStart;
var isPaused;
var isStanding;
var previousDuration;
var previousDistance;
var thresholdLow = 10;
var thresholdHigh = 75;

function evaluate(input, output) {
  if ( isPaused ) {
    return;
  }
  
  var cadence = Math.round(input.cadence * 60.0);

  // This check is present to avoid counting a standing start as a stop
  if ( coldStart && cadence < thresholdLow ) {
    return;
  }
  else {
    coldStart = false;
  }
  
  // First version, we use the current cadence to take decisions
  // without keeping a long term state
  if ( cadence < thresholdLow ) {
    // Stationary
    if (!isStanding) {
      isStanding = true;
    }
    output.duration_stand += (input.duration - previousDuration);
    output.distance_stand += (input.distance - previousDistance);
  }
  else if ( cadence >= thresholdLow && cadence < thresholdHigh ) {
    // Walk
    if (isStanding) {
      isStanding = false;
      output.stand_counter++;
    }
    output.duration_walk += (input.duration - previousDuration);
    output.distance_walk += (input.distance - previousDistance);
  }
  else {
    // Run
    if (isStanding) {
      isStanding = false;
      output.stand_counter++;
    }
    output.duration_run += (input.duration - previousDuration);
    output.distance_run += (input.distance - previousDistance);
  }
  previousDuration = input.duration;
  previousDistance = input.distance;
}

function onLoad(input, output) {
  coldStart = true;
  isPaused = true;
  isStanding = false;
  previousDuration = 0;
  previousDistance = 0;

  output.stand_counter = 0;
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
    tl1: { input: 'output/duration_walk', format: 'Duration_Accurate', title: 'Walk' },
    tr1: { input: 'output/duration_stand', format: 'Duration_Accurate', title: 'Stationary' },
    bottom1: { input: 'output/duration_run', format: 'Duration_Accurate', title: 'Run' },
    tl2: { input: 'output/distance_walk', format: 'Distance_Accurate', title: 'Walk' },
    tr2: { input: 'output/distance_stand', format: 'Distance_Accurate', title: 'Stationary' },
    bottom2: { input: 'output/distance_run', format: 'Distance_Accurate', title: 'Run' }
  };
}

function getSummaryOutputs(input, output) {
  var mode = Number(localStorage.getItem("OutputMode"));
  if (mode == 0) {
    return [
      {
        id: "0",
        name: "Stops",
        format: "Count_Threedigits",
        value: output.stand_counter
      },
      {
        id: "1",
        name: "Walk",
        format: "Duration_Accurate",
        value: output.duration_walk
      },
      {
        id: "2",
        name: "Run",
        format: "Duration_Accurate",
        value: output.duration_run
      },
      {
        id: "3",
        name: "Stationary",
        format: "Duration_Accurate",
        value: output.duration_stand
      }
    ];
  }
  else {
    return [
      {
        id: "0",
        name: "Stops",
        format: "Count_Threedigits",
        value: output.stand_counter
      },
      {
        id: "1",
        name: "Walk",
        format: "Distance_Accurate",
        value: output.distance_walk
      },
      {
        id: "2",
        name: "Run",
        format: "Distance_Accurate",
        value: output.distance_run
      },
      {
        id: "3",
        name: "Stationary",
        format: "Distance_Accurate",
        value: output.distance_stand
      }
    ];
  }
}
