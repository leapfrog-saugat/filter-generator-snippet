import React, { Component } from 'react';

class CheckboxComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { index: null };
  }

  render() {
    const { label, value, options, errorMsg } = this.props;
    const val = value === null ? [] : value;

    return (
      <div className="block">
        <div className="block__title">
          <h3>{label}</h3>
        </div>

        <div className="block__content">
          {options.map((option, i) => (
            <div className="form-check" key={`checkbox_${i}`}>
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="radio"
                  onChange={event => this._handleChange(event, option)}
                  checked={val.findIndex(x => x.value === option.key) !== -1}
                />
                {option.label}
              </label>
            </div>
          ))}
          {!!errorMsg && <span className="help">{errorMsg}</span>}
        </div>
      </div>
    );
  }

  _handleChange = (event, item) => {
    const checked = event.target.checked;
    let val = this.props.value;

    val = val === null ? [] : val;
    if (checked) {
      val = [...val, { value: item.key }];
    } else {
      const index = val.findIndex(x => x.value === item.key);

      val.splice(index, 1);
    }
    const { fieldName } = this.props;

    this.props.onChange(fieldName, val);
  };
}

export default CheckboxComponent;
