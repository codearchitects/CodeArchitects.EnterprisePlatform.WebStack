import { DateRange, DateTime } from '@ca-webstack/data-structures';

export class CaepComplexTypeList {
  types: Array<Function>;
}

export const CaepComplexType: CaepComplexTypeList = {
  types: [DateTime, DateRange]
};
