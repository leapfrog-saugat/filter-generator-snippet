import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Radio from '../Filters/Radio/Radio';
import Range from '../Filters/Range/Range';
import MultiSelect from '../Filters/MultiSelect';
import DropDown from '../Filters/Dropdown/Dropdown';
import Checkbox from '../Filters/Checkbox/Checkbox';
import DropdownRadio from '../Filters/DropdownRadio';
import FilterControllerUI from './FilterControllerUI';
import InputField from '../Filters/InputField/InputField';
import DatePicker from '../Filters/DatePicker/DatePicker';
import { filterType } from '../../../../constants/filterConstants';
import DateRangePicker from '../Filters/DateRangePicker/dateRangePicker';

class FilterController extends Component {
  state = {
    filterHidden: false,
  };

  render() {
    return (
      <FilterControllerUI
        filterHidden={this.state.filterHidden}
        getFilterComponent={this._getFilterComponent}
        toggleHideFilter={this._toggleHideFilter}
        {...this.props}
      />
    );
  }

  _toggleHideFilter = () => {
    this.setState({ filterHidden: !this.state.filterHidden });
  };

  _getFilterComponent = filter => {
    switch (filter.filterType) {
      case filterType.DROPDOWN:
        return DropDown;
      case filterType.INPUT_FIELD:
        return InputField;
      case filterType.DATE_PICKER:
        return DatePicker;
      case filterType.RANGE:
        return Range;
      case filterType.RADIO:
        return Radio;
      case filterType.DROPDOWN_RADIO:
        return DropdownRadio;
      case filterType.MULTI_SELECT:
        return MultiSelect;
      case filterType.DATE_RANGE_PICKER:
        return DateRangePicker;
      case filterType.CHECKBOX:
        return Checkbox;
      default:
        return;
    }
  };
}

FilterController.propTypes = {
  filters: PropTypes.array,
  onChange: PropTypes.func,
  handleShow: PropTypes.func,
  onReset: PropTypes.func,
  showHideButton: PropTypes.bool,
  filterLabel: PropTypes.object,
  setStrict: PropTypes.func,
  parentWidth: PropTypes.number,
};

export default FilterController;
