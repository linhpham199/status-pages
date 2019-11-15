import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDatadogStatus } from '../actions/datadog';

class DatadogComponent extends Component {

  componentDidMount() {
    this.props.fetchDatadogStatus()

    this.interval = setInterval(() => this.reload(), 600000)
  }

  reload() {
    window.location.reload(true)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div>
        <h1>DATADOG INCIDENTS</h1>
        { this.props.incidents.length === 0
          ? <p>Loading...</p>
          : this.props.incidents.map((inc, i) => (
            <div key={i}>
              <h2>{i+1}. {inc.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: inc.content}}/>
            </div>
          ))
        }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDatadogStatus: () => {
    dispatch(fetchDatadogStatus());
  }
});

const mapStateToProps = state => ({
  incidents: state.datadog.incidents
})

export default connect(mapStateToProps, mapDispatchToProps)(DatadogComponent);

