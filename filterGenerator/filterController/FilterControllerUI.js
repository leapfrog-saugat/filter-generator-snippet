import React from 'react';
import PropTypes from 'prop-types';

import labels from '../../../common/constants/label';

class FilterControllerUI extends React.Component {
  render() {
    const {
      filters,
      onChange,
      handleShow,
      getFilterComponent,
      setStrict,
      parentWidth,
      filterHidden,
      filterLabel,
      showHideButton,
      onReset,
      toggleHideFilter,
    } = this.props;

    const filtersLabel = filterLabel ? filterLabel.label : labels.FILTERS;

    return (
      <>
        {showHideButton && (
          <button className="btn btn-primary" onClick={toggleHideFilter}>
            <span>{filterHidden ? 'Show' : 'Hide'} Filter</span>
          </button>
        )}

        {!filterHidden && (
          <>
            <div className="filters_form_wrapper">
              <h2>{filtersLabel}</h2>
              {filters &&
                filters.map((filter, index) => {
                  const FilterComponent = getFilterComponent(filter);

                  return (
                    FilterComponent && (
                      <FilterComponent
                        key={`Component${index}`}
                        {...filter}
                        onChange={onChange}
                        setStrict={setStrict}
                        handleShow={handleShow}
                        parentWidth={parentWidth}
                      />
                    )
                  );
                })}
            </div>
            <div className="block">
              <div className="block__content">
                <div className="form-group d-flex justify-content-around flex-wrap ml-2 mr-2">
                  <button className="btn btn--outlined filter-action" onClick={onReset}>
                    {labels.CANCEL}
                  </button>
                  <button className="btn btn--outlined filter-action" onClick={handleShow}>
                    {labels.APPLY}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

FilterControllerUI.propTypes = {
  collapseFilter: PropTypes.func,
  filterHidden: PropTypes.bool,
  filterLabel: PropTypes.object,
  filters: PropTypes.array,
  getFilterComponent: PropTypes.func,
  handleShow: PropTypes.func,
  onChange: PropTypes.func,
  onReset: PropTypes.func,
  parentWidth: PropTypes.number,
  setStrict: PropTypes.func,
  showHideButton: PropTypes.bool,
  toggleHideFilter: PropTypes.func,
};

export default FilterControllerUI;
