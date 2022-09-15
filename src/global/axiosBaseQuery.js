import axios from 'axios';

export const axiosBaseQuery = ({ isMockEnabled, onErrorAction, ...args }) => async (
  { url, method, body: data, params, mockData, onSuccess },
  { dispatch },
) => {
  try {

    if (isMockEnabled) {
      return { data: mockData.data };
    }

    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };

    const result = await axios({
      url: `${args.baseUrl}${url}`,
      method,
      data,
      params,
      headers,
    });

    if (onSuccess) {
      onSuccess({ dispatch });
    }

    return { data: result.data };
  } catch (error) {
    if (onErrorAction) {
      onErrorAction({ dispatch, error });
    }

    return { error };
  }
}
