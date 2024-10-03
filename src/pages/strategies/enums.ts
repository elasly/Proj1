// enums.ts
export enum RuleType {
    Long = "long",
    Short = "short",
    Hold = "hold",
  }
  
  export enum CompareToType {
    Indicator = "indicator",
    Threshold = "threshold",
    Slope = "slope",
    Price = "price",
  }
  
  export enum OperatorType {
    LessThan = "<",
    GreaterThan = ">",
    Equal = "=",
    LessThanOrEqual = "<=",
    GreaterThanOrEqual = ">=",
    CrossOver = "crossOver",
    CrossUnder = "crossUnder",
  }
  
  export enum SlopeType {
    Positive = "positive",
    Negative = "negative",
    Zero = "zero",
    PositiveOrZero = "positiveOrZero",
    NegativeOrZero = "negativeOrZero",
  }
  
  export enum PriceActionType {
    Close = "Close",
    Open = "Open",
    High = "High",
    Low = "Low",
  }