import _get from 'lodash.get';
import PropTypes from 'prop-types';
import _isEqual from 'lodash.isequal';
import { connect } from 'react-redux';
import React, { Component } from 'react';

import { svgIcon } from '../../../constants';
import { setLoading } from '../../../actions/ui';
import { SvgIcon } from '../../../assets/svgIcon';
import { setData, resetData } from '../../../actions/data';
import fetchRecords from '../../../services/dashboardFilter';
import { handleError } from '../../../services/apiErrorHandler';
import accountCardServices from '../../../services/accountCard';
import FilterController from './filterController/FilterController';
import sanitizeFilterData from '../../../services/sanitizeFilterData';
import { updateFilter, resetFilter, setIsVisible, setOrderBy } from '../../../actions/filter';

class FilterGenerator extends Component {
  state = { expanded: false, width: 0 };

  constructor(props) {
    super(props);
    this.filterContainer = React.createRef();
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  render() {
    const { config, filterLabel, isFiltersVisible, setFilterVisibility } = this.props;
    const visibleFilters = config.filter(item => item.isVisible !== false);
    const expandedClass = this._getExpandedClass(isFiltersVisible);

    return (
      <div className={`sidebar ${expandedClass}`}>
        <div className={'filters'} ref={this.filterContainer}>
          {expandedClass && (
            <button className="filters__close" onClick={() => setFilterVisibility(false)}>
              <SvgIcon name={svgIcon.FILTER_CROSS} />
            </button>
          )}
          <FilterController
            handleShow={this._fetchRecords}
            filterLabel={filterLabel}
            filters={visibleFilters}
            onChange={this._onChange}
            onReset={this._onReset}
            setStrict={this._setStrict}
            showHideButton={false}
            parentWidth={this.state.width}
          />
        </div>
      </div>
    );
  }

  updateDimensions = () => {
    this.setState({ width: this.filterContainer.current.offsetWidth });
  };

  _getExpandedClass = isVisible => {
    return isVisible ? 'expanded-filter' : 'fully-collapsed-filter';
  };

  _fetchRecords = () => {
    this.props.onShow();
    this.props.setFilterVisibility(false);
  };

  _setStrict = (isStrict, newValue) => {
    this.props.setStrict(isStrict, newValue);
  };

  _onChange = (filterKey, newValue) => {
    this.props.updateFilter(filterKey, newValue);

    const updatedFilter = this.props.config.find(item => item.fieldName === filterKey);

    if (updatedFilter && updatedFilter.enableFilter) {
      const isEnabled = _isEqual(updatedFilter.enableFilter.value, newValue);
      const dependentFilter = this.props.config.find(item => item.fieldName === updatedFilter.enableFilter.fieldName);

      // Reset the filter value only if the value is not null.
      !isEnabled && !!dependentFilter.value && this.props.updateFilter(updatedFilter.enableFilter.fieldName, null);

      // Update isVisible value for dependent filter based on the config.
      this._setIsVisible(updatedFilter.enableFilter.fieldName, isEnabled);
    }
  };

  _onReset = async () => {
    const initialLoadLimit = this.props.initialUrl.configUrl.initialLoadLimit;

    this.props.onReset && this.props.onReset();
    this.props.resetFilter();
    this.props.setLoading();
    this.props.setFilterVisibility(false);
    this.props.resetOrderByConfig();
    const errorMsg = _get(this.props.errorMsg, 'defaultErrorMsg', '');
    const sanitizedFilter = sanitizeFilterData(this.props.initialFilterConfig);
    const records = await fetchRecords(this.props.initialUrl, sanitizedFilter, errorMsg, initialLoadLimit);

    if (records.error) {
      handleError(records.error);
      this.props.resetData();
    } else if (records) {
      accountCardServices.clearDashboardRecentState(accountCardServices.getDashboardType(this.props.ui));
      this.props.setData(records);
    }
    this.props.resetLoading();
  };

  _setIsVisible = (filterKey, value) => {
    const filter = this.props.config.find(item => item.fieldName === filterKey);

    // Update the value only for new value.
    filter.isVisible !== value && this.props.setIsVisible(filterKey, value);
  };
}

FilterGenerator.propTypes = {
  initialUrl: PropTypes.object,
  ui: PropTypes.object,
  errorMsg: PropTypes.object,
  updateFilter: PropTypes.func,
  resetFilter: PropTypes.func,
  setLoading: PropTypes.func,
  resetLoading: PropTypes.func,
  setData: PropTypes.func,
  resetData: PropTypes.func,
};

const mapStateToProps = state => ({
  initialUrl: state.filterUrl,
  isFiltersVisible: state.filters.isVisible,
  ui: state.ui,
  initialFilterConfig: state.filters.initial,
  errorMsg: state.errorMsg,
});

const mapDispatchToProps = dispatch => ({
  // value is sent to change value of key 'value' in redux
  updateFilter: (filter, value) => dispatch(updateFilter(filter, 'value', value)),
  setStrict: (filter, isStrict) => dispatch(updateFilter(filter, 'isStrict', isStrict)),
  // isVisible is sent to change value of key 'isVisible' for a particular filter in redux
  setIsVisible: (filter, value) => dispatch(updateFilter(filter, 'isVisible', value)),
  // this will change the visibility of full filter panel
  setFilterVisibility: value => dispatch(setIsVisible(value)),
  resetFilter: () => dispatch(resetFilter()),
  setLoading: () => dispatch(setLoading(true)),
  resetLoading: () => dispatch(setLoading(false)),
  setData: data => dispatch(setData(data)),
  resetData: () => dispatch(resetData()),
  resetOrderByConfig: () => dispatch(setOrderBy({})),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterGenerator);
