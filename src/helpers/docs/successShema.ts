import { ApiResponseOptions } from '@nestjs/swagger';

export const SuccessResponseDocs: ApiResponseOptions = {
  schema: {
    properties: {
      status: { type: 'string', example: 'success' },
    },
  },
};
