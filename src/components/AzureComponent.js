import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAzureStatus } from '../actions/azure';

class AzureComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: this.props.errors
    }
  }

  componentDidMount() {
    this.props.fetchAzureStatus()

    this.interval = setInterval(() => this.reload(), 600000)
  }

  reload() {
    window.location.reload(true)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors.length !== prevProps.errors.length) {
      this.setState({ errors: this.props.errors})
    }
  }

  checkStatus(service, region) {
    const { errors } = this.state
    return errors.find((error) =>
      error.service === service && error.region === region)
      ? <span style={{color: 'red'}}>ERROR</span>
      : 'GOOD'
  }

  render() {
    const { services, regions } = this.props

    return (
      <div>
        <h1>AZURE STATUS</h1>
        {services.map((service, i) => {
          return (
            <div key={i}>
              <h2>{service}</h2>
              {regions.map((region, i) => <p key={i}>{region}: {this.checkStatus(service, region)}</p>)}
            </div>
          )
        })}
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  fetchAzureStatus: () => {
    dispatch(fetchAzureStatus());
  }
});

const mapStateToProps = state => ({
  status: state.azure.status,
  services: state.azure.services,
  regions: state.azure.regions,
  errors: state.azure.errors
})

export default connect(mapStateToProps, mapDispatchToProps)(AzureComponent);
