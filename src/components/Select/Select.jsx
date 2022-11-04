import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import {useGetSelectMetadataQuery} from '../../global/services/metadataService';

const Select = ({ options, context }) => {
  const { data, isLoading } = useGetSelectMetadataQuery(context);

  const selectStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? '1px solid #317e2' : '1px solid #edeef3',
      boxShadow: state.isFocused ? '0 0 10px 0 #3171e2' : 'unset',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '12px',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 200,
    })
  }

  return (
    <ReactSelect
      options={[
        ...(options || []),
        ...(data || []),
      ]}
      styles={selectStyles}
      noOptionsMessage={() => {
        if (isLoading) {
          return (
            <div>Loading ...</div>
          )
        }

        return (
          <div>No Options</div>
        )
      }}
      openMenuOnFocus
    />
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})),
};

Select.defaultProps = {
  options: [],
};

export default Select;