import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAzureStatus } from '../actions/azure';
import { Table, Icon, Row, Col } from 'antd'

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
    this.props.fetchAzureStatus()
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
      ? <Icon type="close-circle" style={{color: 'red'}}/>
      : <Icon type="check-circle" style={{color: 'green'}} />
  }

  render() {
    const { services, regions } = this.props

    const data = services.map((service, i) => {
      let dataElement = {
        key: i,
        service,
      }

      regions.map((region, i) => (
        dataElement = {...dataElement, [region]: this.checkStatus(service, region)}
      ))
      return dataElement
    })

    let columns = [
      {
        title: '',
        dataIndex: 'service'
      }
    ]

    columns = columns.concat(regions.map(region => ({
      title: region,
      dataIndex: region,
    })))

    return (
      <div>
        <h1>AZURE STATUS</h1>
        <Row>
          <Col span={3}></Col>
          <Col span={18}>
            <Table columns={columns} dataSource={data} />
          </Col>
          <Col span={3}></Col>
        </Row>
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
  services: state.azure.services,
  regions: state.azure.regions,
  errors: state.azure.errors
})

export default connect(mapStateToProps, mapDispatchToProps)(AzureComponent);
