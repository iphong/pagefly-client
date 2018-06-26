import {StyleSheetManager} from 'styled-components'
import React, {Fragment} from 'react'
import {createPortal} from 'react-dom'

type IFrameState = {
    root: Element
}

export default class IFrame extends React.Component<any, any> {

    get iframe() {
        return this.frame.current
    }

    state: IFrameState = {
        root: null
    }
    private frame: React.RefObject<HTMLIFrameElement> = React.createRef()

    componentDidMount() {
        this.iframe.addEventListener('load', this.handleLoad, true)
    }

    componentWillUnmount() {
        this.iframe.removeEventListener('load', this.handleLoad, true)
    }

    handleLoad = (e: Event) => {
        const root = this.iframe.contentDocument.querySelector('html')
        this.iframe.contentDocument.body.remove()
        this.setState({root}, () => {

        })
    }

    render() {
        return <iframe
            {...this.props}
            ref={this.frame}
            name="React Portal Frame"
            srcDoc={`<!DOCTYPE html><html>
                        <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                        </head></html>`}
            style={{
                border: 0,
                width: '100%',
                ...this.props.style
            }}
        >
            {this.state.root
            && createPortal(
                <StyleSheetManager target={this.iframe.contentDocument.head}>
                    <Fragment>
                        <body>{this.props.children}</body>
                    </Fragment>
                </StyleSheetManager>,
                this.state.root
            )}
        </iframe>
    }
}