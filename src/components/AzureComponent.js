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
  }

  componentDidUpdate(prevProps) {
    if (this.props.errors.length !== prevProps.errors.length) {
      this.setState({ errors: this.props.errors})
    }
  }

  checkStatus(service, region) {
    // Check from error
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
        {console.log('SERVICES', this.props.services)}
        {console.log('REGIONS', this.props.regions)}
        {console.log('ERRORS', this.state.errors)}
        {services.map((service) => {
          return (
            <div>
              <h1>{service}</h1>
              {regions.map((region) => <p>{region}: {this.checkStatus(service, region)}</p>)}
            </div>
          )

        })}
        {console.log(this.props.status)}
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
