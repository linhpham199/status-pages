import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchDatadogStatus } from '../actions/datadog';
import { Timeline, Row, Col, Icon } from 'antd';
import * as moment from 'moment';

class DatadogComponent extends Component {

  componentDidMount() {
    this.props.fetchDatadogStatus()

    this.interval = setInterval(() => this.reload(), 600000)
  }

  reload() {
    window.location.reload()
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div>
        <h1>DATADOG INCIDENTS</h1>
        <Row>
          <Col span={7}></Col>
          <Col span={10}>
            <div >
              { this.props.incidents.length === 0
                ? <p>Loading...</p>
                : <Timeline style={{textAlign: 'left'}}>
                    { this.props.incidents.map((inc, i) => (
                      <Timeline.Item key={i} dot={<Icon type="clock-circle-o" style={{ fontSize: '1.4em' }} />}>
                        <div style={{paddingLeft: '.5em'}}>
                          <div style={{fontSize: '1.3em'}}>
                            <h4> {moment(inc.date).format('YYYY-MM-DD')} {inc.title.toUpperCase()}</h4>
                          </div>
                          <div dangerouslySetInnerHTML={{ __html: inc.content}}/>
                        </div>
                      </Timeline.Item>
                    ))}
                </Timeline>
              }
            </div>
          </Col>
          <Col span={7}></Col>
        </Row>
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

