/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import url from 'url';
import isEqual from 'lodash/isEqual';
const urlQuery = url.parse(window.location.href, true).query;

import ConfigUtils from '../utils/ConfigUtils';
import { getMonitoredState } from '../utils/PluginsUtils';
import ModulePluginsContainer from "../product/pages/containers/ModulePluginsContainer";
import { createShallowSelectorCreator } from '../utils/ReselectUtils';
import BorderLayout from '../components/layout/BorderLayout';
import FlexBox, { FlexFill } from '../components/layout/FlexBox';

const PluginsContainer = connect(
    createShallowSelectorCreator(isEqual)(
        state => state.plugins,
        state => state.mode,
        state => state?.browser?.mobile,
        state => state.controls,
        state => getMonitoredState(state, ConfigUtils.getConfigProp('monitorState')),
        (statePluginsConfig, stateMode, mobile, controls, monitoredState) => ({
            statePluginsConfig,
            mode: urlQuery.mode || stateMode || (mobile ? 'mobile' : 'desktop'),
            pluginsState: controls,
            monitoredState
        })
    )
)(ModulePluginsContainer);

const MapViewerLayout = ({
    id,
    header,
    footer,
    background,
    leftColumn,
    rightColumn,
    columns,
    className,
    top,
    bottom,
    children,
    bodyClassName
}) => {
    return (
        <FlexBox id={id} className={className} column classNames={['_fill', '_absolute']}>
            {header}
            <FlexFill flexBox column className={bodyClassName} classNames={['_relative', 'ms2-layout-body']}>
                <div className="_fill _absolute">{background}</div>
                <div className="_relative">{top}</div>
                <FlexFill flexBox classNames={['_relative', 'ms2-layout-main-content']}>
                    <div className="_relative ms2-layout-left-column">{leftColumn}</div>
                    <FlexFill classNames={['_relative', 'ms2-layout-content']}>
                        {children}
                    </FlexFill>
                    <div className="_relative ms2-layout-right-column">{rightColumn}</div>
                    <div className="ms2-layout-columns">{columns}</div>
                </FlexFill>
                <div className="_relative">{bottom}</div>
            </FlexFill>
            {footer}
        </FlexBox>
    );
};

class MapViewer extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        params: PropTypes.object,
        statePluginsConfig: PropTypes.object,
        pluginsConfig: PropTypes.object,
        loadMapConfig: PropTypes.func,
        plugins: PropTypes.object,
        loaderComponent: PropTypes.func,
        onLoaded: PropTypes.func,
        component: PropTypes.any
    };

    static defaultProps = {
        mode: 'desktop',
        className: 'viewer',
        loadMapConfig: () => {},
        onLoaded: () => {}
    };

    UNSAFE_componentWillMount() {
        this.props.loadMapConfig();
    }

    render() {
        return (<PluginsContainer key="viewer" id="viewer" className={this.props.className}
            pluginsConfig={this.props.pluginsConfig || this.props.statePluginsConfig || ConfigUtils.getConfigProp('plugins')}
            plugins={this.props.plugins}
            params={this.props.params}
            loaderComponent={this.props.loaderComponent}
            onLoaded={this.props.onLoaded}
            component={this.props.component || MapViewerLayout}
        />);
    }
}

export default MapViewer;
