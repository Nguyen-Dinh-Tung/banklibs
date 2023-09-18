import { BadRequestException } from '@nestjs/common';
import { isBefore } from 'date-fns';
export function compareStartAndEndDateWithCurrentDate(
  startTime: Date,
  endTime: Date,
) {
  if (isBefore(new Date(), startTime)) {
    throw new BadRequestException('ERROR_STARTDATE_CAN_NOT_BEFORE_CURRENTTIME');
  }

  if (isBefore(endTime, new Date())) {
    throw new BadRequestException('ERROR_ENDDATE_CAN_NOT_BEFORE_CURRENTTIME');
  }

  if (isBefore(endTime, startTime)) {
    throw new BadRequestException('ERROR_ENDDATE_CAN_NOT_BEFORE_STARTDATE');
  }
}
