export const map = (value: number, fromMin: number, fromMax: number, ToMin: number, ToMax: number): number =>
  ((value - fromMin) * (ToMax - ToMin)) / (fromMax - fromMin) + ToMin;
