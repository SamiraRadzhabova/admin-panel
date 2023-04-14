import { ApiResponseOptions } from '@nestjs/swagger';

const ErrorSchema: ApiResponseOptions = {
  schema: {
    properties: {
      message: { type: 'string' },
      error: { type: 'string' },
      errors: {
        properties: {
          fieldName: {
            properties: {
              constraints: { type: 'array', items: { type: 'string' } },
              children: {
                properties: {
                  fieldIndex: {
                    properties: {
                      constraints: { type: 'array', items: { type: 'string' } },
                      children: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      status: { type: 'number' },
      timestamp: { type: 'string' },
      path: { type: 'string' },
    },
  },
};
export const UnprocessableEntityResponse = (
  field = 'name',
  message = 'Name is required',
): ApiResponseOptions => ({
  schema: {
    ...ErrorSchema,
    example: {
      status: 422,
      message: 'Unprocessable entity',
      error: 'Invalid data',
      errors: {
        [field]: {
          constraints: [message],
          children: {},
        },
      },
      timestamp: '2022-09-09T07:53:01.147Z',
      path: '/example/path/from/request',
    },
  },
});
export const ForbiddenResponse = (
  message = 'You cannot do this',
): ApiResponseOptions => ({
  schema: {
    ...ErrorSchema,
    example: {
      message,
      error: 'Forbidden',
      status: 403,
      timestamp: '2022-09-09T07:35:53.654Z',
      path: '/example/path/from/request',
    },
  },
});

export const ForbiddenUserNotActive: ApiResponseOptions = {
  schema: {
    ...ErrorSchema,
    example: {
      message: 'User is not active',
      error: 'Forbidden',
      status: 403,
      timestamp: '2022-09-09T07:35:53.654Z',
      path: '/auth/login',
    },
  },
};
export const NotFoundResponse: ApiResponseOptions = {
  schema: {
    ...ErrorSchema,
    example: {
      message: 'Company not found',
      error: 'Not Found',
      status: 404,
      timestamp: '2022-09-09T07:19:13.422Z',
      path: '/companies/13562/departments/1',
    },
  },
};
export const UnauthorizedResponse: ApiResponseOptions = {
  schema: {
    ...ErrorSchema,
    example: {
      message: 'Unauthorized',
      error: 'Unauthorized',
      status: 401,
      timestamp: '2022-09-09T07:30:38.089Z',
      path: '/companies/13562/departments/1',
    },
  },
};
