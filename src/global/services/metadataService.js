import { createApi } from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '../axiosBaseQuery';
import { isMockMetadataService} from './isMockEnabled';

const selectMetadataMock = require('../../__mocks__/Magazines/getSelectMetadata.mock.json');

export const metadataService = createApi({
  reducerPath: 'metadataService',
  baseQuery: axiosBaseQuery({
    baseUrl: 'http://localhost:3001/api-v1',
    isMockEnabled: isMockMetadataService,
  }),
  tagTypes: ['metadata'],
  endpoints : (build) => ({
    getSelectMetadata: build.query({
      query: () => ({ url: '', method: 'GET', mockData: selectMetadataMock }),
    }),
  }),
});

export const { useGetSelectMetadataQuery } = metadataService;