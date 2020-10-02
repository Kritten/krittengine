class TimeServiceClass {
  timeElapsed = 0.0;

  timeDelta = 0.0;

  timeDeltaInSeconds = 0.0;

  init() {
    this.timeDelta = 0;
    this.timeDeltaInSeconds = this.timeDelta * 0.001;
    this.timeElapsed += this.timeDelta;
  }

  update(timestamp: DOMHighResTimeStamp) {
    this.timeDelta = timestamp - this.timeElapsed;
    this.timeDeltaInSeconds = this.timeDelta * 0.001;
    this.timeElapsed = timestamp;
  }
}

export const TimeService = new TimeServiceClass();
