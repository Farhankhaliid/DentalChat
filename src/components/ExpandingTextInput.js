import React from 'react'
import { TextInput } from 'react-native'
import constants from './../constants/constants'
export default class ExpandingTextInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 0
    }
  }

  focus() {
    this.textInput && this.textInput.focus()
  }

  render() {
    return (
      <TextInput
        allowFontScaling={false}
        {...this.props}
        ref={(view) => (this.textInput = view)}
        multiline
        onContentSizeChange={(event) => {
          if (event && event.nativeEvent && event.nativeEvent.contentSize) {
            this.setState({
              height: event.nativeEvent.contentSize.height
            })
          }
          this.props.onContentSizeChange && this.props.onContentSizeChange(event)
        }}
        style={[this.props.style, { height: Math.max(70, this.state.height) }]}
      />
    )
  }
}