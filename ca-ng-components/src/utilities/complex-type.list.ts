import { DateTime, DateRange } from '@ca-webstack/data-structures';

export class ComplexTypeList {
  types: Array<Function>;
}

export const ShComplexType: ComplexTypeList = {
  types: [
    DateTime,
    DateRange
  ]
};
