import React from 'react';
import _get from 'lodash.get';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import './style.css';
import { checkAccess } from '../../../../common/Can';
import { keyCode } from '../../../../../constants/keyCode';
import { getUserGroup } from '../../../../../utils/userInfo';
import { updateFilter } from '../../../../../actions/filter';
import { DROP_DOWN_ARROW } from '../../../../../constants/images';
import { lossMitigationRoute } from '../../../../../constants/routes';
import lossMitigationLabels from '../../../../lossMitigation/constants/label';

const _getDashboardMode = props => {
  const url = _get(props, 'match.url', '');
  const urlBreadcrumbs = url.split('/');
  const dashboardMode = _get(urlBreadcrumbs, '[2]', '');

  switch (dashboardMode) {
    case lossMitigationRoute.REPO:
      return lossMitigationLabels.REPO_ON_HOLD;
    case lossMitigationRoute.SKIP:
      return lossMitigationLabels.SKIP_ON_HOLD;
    case lossMitigationRoute.RE_MARKETING:
      return lossMitigationLabels.REMARKETING_ON_HOLD;
  }
};

const customStyles = {
  control: (style, state) => ({
    ...style,
    border: 0,
    minHeight: '20px',
    height: '20px',
    backgroundColor: 'transparent',
    boxShadow: state.isFocused ? '0 0 0 1px black' : 'none',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menuList: () => ({
    boxSizing: 'border-box',
    maxHeight: '280px',
    overflow: 'auto',
  }),
};

const DropdownIndicator = () => {
  return <img className="dropdown-arrow" src={DROP_DOWN_ARROW} alt="arrow" />;
};

const _getAccessibleOptions = (hasAccessControl, options) => {
  if (hasAccessControl) {
    const filteredOptions = [];

    options.forEach(item => {
      if (checkAccess(getUserGroup(), item.accessAction)) {
        filteredOptions.push(item);
      }
    });

    return filteredOptions;
  }

  return options;
};

const Dropdown = React.memo(props => {
  /* eslint-disable no-unused-vars*/
  const {
    id,
    label,
    options,
    errorMessage,
    onChange,
    placeholder,
    styles,
    className,
    isMulti,
    hasAccessControl,
    refreshState,
    resetFilters,
    resetFilterValue,
    ...otherProps
  } = props;

  /* enable-eslint no-unused-vars*/

  // Add empty option for clearing selected value
  let addedOptions = [];
  const formSpecialClass = props.formSpecialClass ? props.formSpecialClass : '';

  addedOptions = addedOptions.concat(_getAccessibleOptions(hasAccessControl, options));

  const _onChange = selectedOption => {
    const { fieldName, redirect } = props;

    // Check for empty selection
    if (!_get(selectedOption, 'label', null)) {
      props.onChange(fieldName, null);

      return;
    }
    props.onChange(fieldName, selectedOption);

    if (resetFilters) {
      resetFilters.forEach(item => {
        resetFilterValue(item);
      });
    }

    if (redirect) {
      props.history.push(selectedOption.value);
    }
  };

  const _getLabelView = (label, id) =>
    !!label && (
      <label htmlFor={id} className={'form-group__label form-group__label--block'}>
        {label}
      </label>
    );

  const _handleKeyDown = event => {
    const { searchOnEnter } = props;

    // Prevents error exception while entering space
    if (event.keyCode === keyCode.SPACE && event.target.value === '') {
      event.preventDefault();
    }

    if (searchOnEnter && event.key === keyCode.ENTER) {
      const value = event.target.value;

      if ((!value && props.value) || !value) {
        setTimeout(() => {
          props.handleShow();
        }, 0);
      }
    }
  };

  const _getAddedOptions = options => {
    const addedOptions = options.map((option, i) => {
      option.label = option.value === lossMitigationLabels.ON_HOLD ? _getDashboardMode(props) : option.label;

      return option;
    });

    return addedOptions;
  };

  return (
    <div className={`form-group  ${errorMessage ? 'has-error' : ''} ${formSpecialClass}`}>
      {_getLabelView(label, id)}
      <Select
        classNamePrefix="input-field-select"
        name={id}
        options={_getAddedOptions(addedOptions)}
        components={{ DropdownIndicator }}
        onChange={_onChange}
        className={className ? `multi-select ${className}` : 'multi-select'}
        styles={{ ...customStyles, ...styles }}
        isSearchable={true}
        isClearable={true}
        onKeyDown={_handleKeyDown}
        placeholder={placeholder ? placeholder : ''}
        {...otherProps}
      />
      {!!errorMessage && <p className={'help'}>{errorMessage}</p>}
    </div>
  );
});

Dropdown.propTypes = {
  label: PropTypes.string,
  errorMessage: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.shape({ label: PropTypes.string, value: PropTypes.any }),
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })),
  className: PropTypes.string,
  styles: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  isDisabled: PropTypes.bool,
  searchOnEnter: PropTypes.bool,
  useCustomFilter: PropTypes.bool,
};

Dropdown.defaultProps = {
  isMulti: PropTypes.false,
};

const mapDispatchToProps = dispatch => ({
  resetFilterValue: filterKey => dispatch(updateFilter(filterKey, 'value', null)),
});

export default connect(null, mapDispatchToProps)(withRouter(Dropdown));

Dropdown.displayName = 'Dropdown';
