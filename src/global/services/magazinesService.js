import { createApi } from '@reduxjs/toolkit/query/react'
import {axiosBaseQuery} from '../axiosBaseQuery';
import { isMockMagazinesService } from './isMockEnabled';

const magazinesListMock = require('../../__mocks__/Magazines/getMagazinesList.mock.json');
const magazineByIdMock = require('../../__mocks__/Magazines/getMagazineById.mock.json');

export const magazinesService = createApi({
  reducerPath: 'magazinesService',
  baseQuery: axiosBaseQuery({
    baseUrl: 'http://localhost:3001/api-v1',
    isMockEnabled: isMockMagazinesService,
  }),
  tagTypes: ['magazines'],
  endpoints: (build) => ({
    getMagazinesList: build.query({
      query: () => ({ url: '', method: 'GET', mockData: magazinesListMock }),
    }),
    getMagazine: build.query({
      query: (id) => ({ url: `${id}`, method: 'GET', mockData: magazineByIdMock }),
    }),
  }),
});

export const { useGetMagazinesListQuery, useGetMagazineQuery } = magazinesService;
